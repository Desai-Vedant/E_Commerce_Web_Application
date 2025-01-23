import Order from "../models/Order.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

// Add a new Order
export const addOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId; // Assumes req.user is populated by an authentication middleware

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required." });
    }

    const newOrder = new Order({
      productId,
      quantity,
      userId,
      isCompleted: false, // Default value for a new order
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order added successfully.", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding order.", error: error.message });
  }
};

// Update Order
export const updateOrder = async (req, res) => {
  try {
    const { orderId, ...updatedDetails } = req.body;
    const userId = req.user.userId; // Assumes req.user is populated by an authentication middleware

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized to update." });
    }

    // Update only fields that are provided in the request
    Object.assign(order, updatedDetails);

    await order.save();

    res.status(200).json({ message: "Order updated successfully.", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order.", error: error.message });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.userId; // Assumes req.user is populated by an authentication middleware

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const order = await Order.findOneAndDelete({ _id: orderId, userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized to delete." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order.", error: error.message });
  }
};

// View Orders
export const viewOrder = async (req, res) => {
  try {
    const userId = req.user.userId; // Assumes req.user is populated by an authentication middleware
    const { orderStatus } = req.body;

    let orders;

    if (req.user.isSeller) {
      const sellerId = new ObjectId(userId);
      orders = await Order.aggregate([
        {
          $lookup: {
            from: "products",
            let: { productId: { $toString: "$productId" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: "$_id" }, "$$productId"],
                  },
                },
              },
            ],
            as: "productdetails",
          },
        },
        {
          $addFields: {
            productdetails: { $arrayElemAt: ["$productdetails", 0] },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { sellerId: { $toString: "$productdetails.sellerId" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: "$_id" }, "$$sellerId"],
                  },
                },
              },
            ],
            as: "sellerdetails",
          },
        },
        {
          $addFields: {
            sellerdetails: { $arrayElemAt: ["$sellerdetails", 0] },
          },
        },
        {
          $match: {
            "sellerdetails._id": sellerId,
          },
        },
        {
          $project: {
            orderId: "$_id",
            productName: "$productdetails.name",
            productDetails: "$productdetails.description",
            orderQuantity: "$quantity",
            totalPrice: { $multiply: ["$quantity", "$productdetails.price"] },
          },
        },
      ]);
    } else {
      orders = await Order.aggregate([
        {
          $match: {
            userId: userId,
            isCompleted: orderStatus,
          },
        },
        {
          $lookup: {
            from: "products",
            let: { productId: { $toString: "$productId" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: "$_id" }, "$$productId"],
                  },
                },
              },
            ],
            as: "productdetails",
          },
        },
        {
          $addFields: {
            product: { $arrayElemAt: ["$productdetails", 0] },
          },
        },
        {
          $project: {
            orderId: "$_id",
            productName: "$product.name",
            productDetails: "$product.description",
            productPrice: "$product.price",
            orderQuantity: "$quantity",
            totalPrice: { $multiply: ["$quantity", "$product.price"] },
          },
        },
      ]);
    }
    res.status(200).json({ message: "Orders retrieved successfully.", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders.", error: error.message });
  }
};
