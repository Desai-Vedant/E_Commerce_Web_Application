import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  userId: String,
  isCompleted: Boolean,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
