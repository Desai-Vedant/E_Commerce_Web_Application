import Order from "../models/Order.js";

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

    let orders;

    if (req.user.isSeller) {
      orders = await Order.find({});
    } else {
      orders = await Order.find({ userId });
    }

    if (orders.length === 0) {
      return res.status(200).json({ message: "No Orders Found", orders });
    }

    res.status(200).json({ message: "Orders retrieved successfully.", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders.", error: error.message });
  }
};
