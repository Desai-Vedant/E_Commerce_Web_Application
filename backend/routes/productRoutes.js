import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  viewProduct,
} from "../controllers/productController.js";
import { authenticateToken } from "../utils/authorization.js";

const router = express.Router();

router.post("/add", authenticateToken, addProduct);
router.post("/update", authenticateToken, updateProduct);
router.post("/delete", authenticateToken, deleteProduct);
router.post("/view", authenticateToken, viewProduct);

export default router;
