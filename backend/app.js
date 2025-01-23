import express from "express";
import connectDB from "./utils/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentController from "./controllers/paymentController.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/user", authRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentController);

export default app;
