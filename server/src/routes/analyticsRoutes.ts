import { Router } from "express";
import {
  getDashboardStats,
  getExpensesByCategories,
  getMonthlyTotals,
  getSpendingTrends,
} from "../controllers/analyticsControllers.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/category", requireAuth, getExpensesByCategories);
router.get("/monthly", requireAuth, getMonthlyTotals);
router.get("/dashboard", requireAuth, getDashboardStats);
router.get("/trends", requireAuth, getSpendingTrends);

export default router;
