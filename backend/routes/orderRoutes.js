import express from "express";
import {
  addOrder,
  updateOrder,
  deleteOrder,
  viewOrder,
} from "../controllers/orderController.js";
import { authenticateToken } from "../utils/authorization.js";

const router = express.Router();

router.post("/add", authenticateToken, addOrder);
router.post("/update", authenticateToken, updateOrder);
router.post("/delete", authenticateToken, deleteOrder);
router.post("/view", authenticateToken, viewOrder);

export default router;
