import {
  createNewExpense,
  deleteExpenseById,
  getAllExpenses,
  getExpenseById,
  updateExpenseById,
} from "../controllers/expenseControllers.js";
import { Router } from "express";

const router = Router();

router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.post("/", createNewExpense);
router.put("/:id", updateExpenseById);
router.delete("/:id", deleteExpenseById);

export default router;
