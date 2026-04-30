import {
  createNewExpense,
  deleteExpenseById,
  getAllExpenses,
  getExpenseById,
  updateExpenseById,
} from "../controllers/expenseControllers.js";
import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, getAllExpenses);
router.get("/:id", requireAuth, getExpenseById);
router.post("/", requireAuth, createNewExpense);
router.put("/:id", requireAuth, updateExpenseById);
router.delete("/:id", requireAuth, deleteExpenseById);

export default router;
