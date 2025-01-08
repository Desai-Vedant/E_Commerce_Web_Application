import Product from "../models/Product.js"; // Mongoose Schema for Product

// Add a new Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const sellerId = req.user.userId; // Assumes req.user is populated by authentication middleware

    if (!name || !description || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newProduct = new Product({ name, description, price, sellerId });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully.", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product.", error: error.message });
  }
};

// Update an existing Product
export const updateProduct = async (req, res) => {
  try {
    const { productId, name, description, price } = req.body;
    const sellerId = req.user.userId; // Assumes req.user is populated by authentication middleware

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const product = await Product.findOne({ _id: productId, sellerId });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized to update." });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;

    await product.save();

    res.status(200).json({ message: "Product updated successfully.", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product.", error: error.message });
  }
};

// Delete a Product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body; // Product ID passed in the body
    const sellerId = req.user.userId; // Authenticated user's ID
    const isSeller = req.user.isSeller; // Authenticated user's role

    if (!isSeller) {
      return res
        .status(403)
        .json({ message: "Only sellers can delete products." });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const product = await Product.findOneAndDelete({
      _id: productId,
      sellerId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized to delete." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product.", error: error.message });
  }
};

// View Products
export const viewProduct = async (req, res) => {
  try {
    const body = req.body;
    const isSeller = req.user.isSeller; // Role from the authenticated user
    const userId = req.user.userId; // Authenticated user's ID

    let products;
    if (isSeller) {
      // If user is a seller, show only their products
      products = await Product.find({ sellerId: userId });
    } else {
      // If user is not a seller, show all products
      products = await Product.find({});
    }

    res
      .status(200)
      .json({ message: "Got product details successfully.", products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products.", error: error.message });
  }
};
