import { ApiResponse, Expense, ExpenseCategory } from "../types/index.js";
import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers.js";
import { AppError } from "../middleware/errorHandler.js";

export let fakeExpenses: Expense[] = [
  {
    id: "1",
    userId: "user123",
    amount: 45.99111,
    category: ExpenseCategory.FOOD,
    description: "Lunch at restaurant",
    date: new Date("2025-10-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "1",
    userId: "user123",
    amount: 12,
    category: ExpenseCategory.TRANSPORT,
    description: "MTR",
    date: new Date("2025-9-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "1",
    userId: "user123",
    amount: 1123,
    category: ExpenseCategory.TRANSPORT,
    description: "MTR",
    date: new Date("2026-4-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "1",
    userId: "user123",
    amount: 123123,
    category: ExpenseCategory.TRANSPORT,
    description: "MTR",
    date: new Date("2026-3-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user002",
    amount: 20.0,
    category: ExpenseCategory.TRANSPORT,
    description: "Uber to work",
    date: new Date("2025-10-14"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getAllExpenses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    sendSuccess(res, fakeExpenses, "Expenses retrieved successfully");
  },
);

export const getExpenseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const expense = fakeExpenses.find((exp) => exp.id === id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }
    sendSuccess(res, expense, "Expense retrieved successfully");
  },
);

export const createNewExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      userId: "user123",
      amount,
      category,
      description: description.trim(),
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fakeExpenses.push(newExpense);
    sendSuccess(res, newExpense, "Expense created successfully", 201);
  },
);

export const updateExpenseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { amount, description, category, date } = req.body;
    const existingExpense = fakeExpenses.find((exp) => exp.id === id);

    // Type Narrowing
    if (!existingExpense) {
      throw new AppError("Expense not found", 404);
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

    const expenseIndex = fakeExpenses.indexOf(existingExpense);

    fakeExpenses[expenseIndex] = {
      ...existingExpense,
      amount: amount ?? existingExpense.amount,
      description: description.trim() ?? existingExpense.description,
      category: category ?? existingExpense.category,
      date: date ? new Date(date) : existingExpense.date,
      updatedAt: new Date(),
    };

    sendSuccess(
      res,
      fakeExpenses[expenseIndex],
      "Expense updated successfully",
      200,
    );
  },
);

export const deleteExpenseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const expenseIndex = fakeExpenses.findIndex((exp) => exp.id === id);
    if (expenseIndex === -1) {
      throw new AppError("Expense not found", 404);
    }
    fakeExpenses.splice(expenseIndex, 1);

    sendSuccess(res, null, "Expense deleted successfully");
  },
);
