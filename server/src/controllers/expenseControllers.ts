import { ApiResponse, ExpenseCategory } from "../types/index.js";
import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers.js";
import { AppError } from "../middleware/errorMiddleware.js";
import Expense from "../models/Expense.js";

// export let fakeExpenses: Expense[] = [
//   {
//     _id: "1",
//     userId: "user123",
//     amount: 45.99111,
//     category: ExpenseCategory.FOOD,
//     description: "Lunch at restaurant",
//     date: new Date("2025-10-15"),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     _id: "12",
//     userId: "user123",
//     amount: 12,
//     category: ExpenseCategory.TRANSPORT,
//     description: "MTR",
//     date: new Date("2025-9-15"),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     _id: "13",
//     userId: "user123",
//     amount: 1123,
//     category: ExpenseCategory.TRANSPORT,
//     description: "MTR",
//     date: new Date("2026-4-15"),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     _id: "14",
//     userId: "user123",
//     amount: 123123,
//     category: ExpenseCategory.TRANSPORT,
//     description: "MTR",
//     date: new Date("2026-3-15"),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     _id: "2",
//     userId: "user002",
//     amount: 20.0,
//     category: ExpenseCategory.TRANSPORT,
//     description: "Uber to work",
//     date: new Date("2025-10-14"),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

export const getAllExpenses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const { category, sort } = req.query;

    const filter: { userId: string; category?: string } = {
      userId,
    };

    if (category && typeof category === "string") {
      filter.category = category;
    }

    let query = Expense.find(filter as any);

    if (sort && typeof sort === "string") {
      if (sort === "amount") {
        query = query.sort({ amount: 1 });
      } else if (sort === "-amount") {
        query = query.sort({ amount: -1 });
      } else if (sort === "date") {
        query = query.sort({ date: 1 });
      } else if (sort === "-date") {
        query = query.sort({ date: -1 });
      }
    }

    const expenses = await query;

    sendSuccess(res, expenses, `Found ${expenses.length} expenses`);
  },
);

export const getExpenseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    if (expense.userId.toString() !== userId) {
      throw new AppError("Unauthorized access to this expense", 403);
    }

    sendSuccess(res, expense, "Expense retrieved successfully");
  },
);

export const createNewExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const { amount, category, description, date } = req.body;

    if (!amount) {
      throw new AppError("Amount is required", 400);
    }
    if (!category) {
      throw new AppError("Category is required", 400);
    }
    if (!description) {
      throw new AppError("Description is required", 400);
    }

    // Validation - Data Types
    if (typeof amount !== "number") {
      throw new AppError("Amount must be a number", 400);
    }

    // Validation - Business Logic
    if (amount <= 0) {
      throw new AppError("Amount must be greater than 0", 400);
    }
    if (amount >= 1000000) {
      throw new AppError("Amount cannot exceed 1,000,000", 400);
    }

    // Validation - Category
    const validCategories = Object.values(ExpenseCategory);
    if (!validCategories.includes(category)) {
      throw new AppError(
        `Invalid category. Must be one of: ${validCategories.join(", ")}`,
        400,
      );
    }

    // Validation - description
    if (description.length < 3) {
      throw new AppError("Description must be at least 3 characters", 400);
    }
    if (description.length > 100) {
      throw new AppError("Description cannot exceed 100 characters", 400);
    }

    const expenseDate = date ? new Date(date) : new Date();
    const today = new Date();

    if (expenseDate > today) {
      throw new AppError("Cannot create an expense for a future date", 400);
    }

    const newExpense = new Expense({
      userId: userId,
      amount,
      category,
      description,
      date: expenseDate,
    });

    const createdExpense = await newExpense.save();

    sendSuccess(res, createdExpense, "Expense created successfully", 201);
  },
);

export const updateExpenseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const { id } = req.params;

    const { amount, description, category, date } = req.body;

    const expense = await Expense.findById(id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    if (expense.userId.toString() !== userId) {
      throw new AppError("Unauthorized access to this expense", 403);
    }

    // Validation - Provided Fields

    if (amount !== undefined) {
      if (typeof amount !== "number") {
        throw new AppError("Amount must be a number", 400);
      }
      if (amount <= 0) {
        throw new AppError("Amount must be greater than 0", 400);
      }
      if (amount > 1000000) {
        throw new AppError("Amount cannot exceed 1,000,000", 400);
      }
    }

    if (category !== undefined) {
      const validCategories = Object.values(ExpenseCategory);
      if (!validCategories.includes(category)) {
        throw new AppError(
          `Invalid category. Must be one of: ${validCategories.join(", ")}`,
          400,
        );
      }
    }

    if (description !== undefined) {
      if (description.length < 3) {
        throw new AppError("Description must be at least 3 characters", 400);
      }
      if (description.length > 100) {
        throw new AppError("Description cannot exceed 100 characters", 400);
      }
    }

    if (amount !== undefined) {
      expense.amount = amount;
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (description !== undefined) {
      expense.description = description;
    }

    if (date !== undefined) {
      expense.date = new Date(date);
    }

    const updatedExpense = await expense.save();

    sendSuccess(res, updatedExpense, "Expense updated successfully", 200);
  },
);

export const deleteExpenseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    if (expense.userId.toString() !== userId) {
      throw new AppError("Unauthorized access to this expense", 403);
    }

    await Expense.findByIdAndDelete(id);

    sendSuccess(res, null, "Expense deleted successfully");
  },
);
