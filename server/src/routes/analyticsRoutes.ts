import { Router } from "express";
import {
  getDashboardStats,
  getExpensesByCategories,
  getMonthlyTotals,
} from "../controllers/analyticsControllers.js";

const router = Router();

router.get("/category", getExpensesByCategories);
router.get("/monthly", getMonthlyTotals);
router.get("/dashboard", getDashboardStats);

export default router;
