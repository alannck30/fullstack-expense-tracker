import { AppError } from "../middleware/errorMiddleware.js";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers.js";
import { Response, Request, NextFunction } from "express";
import { DashboardStats, MonthlyTotals } from "../types/index.js";
import Expense from "../models/Expense.js";

const getMonthString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${month}-${year}`;
};
const getCurrentMonth = (): string => {
  return getMonthString(new Date());
};

const getLastMonth = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return getMonthString(date);
};

export const getExpensesByCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const userExpenses = await Expense.find({ userId } as any);

    if (userExpenses.length === 0) {
      return sendSuccess(
        res,
        [],
        "No expenses found. Create an expense to get started",
      );
    }

    const categoryTotals = userExpenses.reduce(
      (acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = { total: 0, count: 0 };
        }
        acc[expense.category].total += expense.amount;
        acc[expense.category].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    const grandTotal = Object.values(categoryTotals).reduce(
      (sum, cat) => sum + cat.total,
      0,
    );

    const categoryArray = Object.entries(categoryTotals).map(
      // ["food",{total:475,count:5}]
      ([category, cat]) => ({
        category,
        ...cat,
        percentage: Math.round((cat.total / grandTotal) * 100),
        total: Math.round(cat.total * 100) / 100,
      }),
    );

    categoryArray.sort((a, b) => b.total - a.total);

    sendSuccess(res, categoryArray, "Category breakdown retrieved");
  },
);

export const getMonthlyTotals = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const year = req.query.year
      ? Number(req.query.year)
      : new Date().getFullYear();

    if (isNaN(year)) {
      throw new AppError("Year must be a valid number", 400);
    }

    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 1) {
      throw new AppError(
        `Year must be between 2000 and ${currentYear + 1}`,
        400,
      );
    }

    const userExpenses = await Expense.find({ userId } as any);

    const yearExpenses = userExpenses.filter((exp) => {
      const expenseYear = new Date(exp.date).getFullYear();
      return expenseYear === year;
    });

    if (yearExpenses.length === 0) {
      return sendSuccess(res, [], `No expenses found for ${year}`);
    }

    const monthlyTotals = yearExpenses.reduce(
      (acc, expense) => {
        const monthString = getMonthString(new Date(expense.date));
        if (!acc[monthString]) {
          acc[monthString] = {
            month: monthString,
            total: 0,
            count: 0,
          };
        }
        acc[monthString].total += expense.amount;
        acc[monthString].count += 1;
        return acc;
      },
      {} as Record<string, MonthlyTotals>,
    );

    const monthlyArray = Object.values(monthlyTotals);

    monthlyArray.sort((a, b) => a.month.localeCompare(b.month));

    monthlyArray.forEach((month) => {
      month.total = Math.round(month.total * 100) / 100;
    });

    sendSuccess(res, monthlyArray, `Monthly total for ${year} retrieved`);
  },
);

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const userExpenses = await Expense.find({ userId } as any);

    if (userExpenses.length === 0) {
      return sendSuccess(
        res,
        [],
        "No expenses found. Create an expense to get started",
      );
    }

    const totalExpenses = userExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const averageExpense = totalExpenses / userExpenses.length;

    const roundedAverageExpenseAmount = Math.round(averageExpense * 10) / 10;

    const amounts = userExpenses.map((expense) => expense.amount);

    const maxAmount = Math.max(...amounts);

    const minAmount = Math.min(...amounts);

    const highestExpense = userExpenses.find(
      (exp) => exp.amount === maxAmount,
    )!;

    const lowestExpense = userExpenses.find((exp) => exp.amount === minAmount)!;

    const currentMonth = getCurrentMonth();

    const currentMonthExpenses = userExpenses.filter(
      (exp) => getMonthString(new Date(exp.date)) === currentMonth,
    );

    const currentMonthTotal = currentMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0,
    );

    const lastMonth = getLastMonth();

    const lastMonthExpenses = userExpenses.filter(
      (exp) => getMonthString(new Date(exp.date)) === lastMonth,
    );

    const lastMonthTotal = lastMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0,
    );

    let monthlyChange = 0;

    if (lastMonthTotal > 0) {
      monthlyChange =
        ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      monthlyChange = Math.round(monthlyChange * 10) / 10;
    } else if (currentMonthTotal > 0) {
      monthlyChange = 100;
    }

    const stats: DashboardStats = {
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      expenseCount: userExpenses.length,
      roundedAverageExpenseAmount,
      highestExpense,
      lowestExpense,
      currentMonthTotal: Math.round(currentMonthTotal * 100) / 100,
      lastMonthTotal: Math.round(lastMonthTotal * 100) / 100,
      monthlyChange,
    };

    sendSuccess(res, stats, "Dashboard statistics retrieved");
  },
);

export const getSpendingTrends = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const userExpenses = await Expense.find({ userId } as any);

    if (userExpenses.length === 0) {
      sendSuccess(
        res,
        [],
        "No expenses found. Create an expense to get started",
      );
      return;
    }

    const trends = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      const monthString = getMonthString(date);
      const monthExpenses = userExpenses.filter(
        (exp) => getMonthString(new Date(exp.date)) === monthString,
      );
      const monthTotal = monthExpenses.reduce(
        (sum, exp) => sum + exp.amount,
        0,
      );
      trends.push({
        month: monthString,
        total: Math.round(monthTotal * 100) / 100,
        count: monthExpenses.length,
      });
    }
    sendSuccess(res, trends, "Spending trends retrieved");
  },
);
