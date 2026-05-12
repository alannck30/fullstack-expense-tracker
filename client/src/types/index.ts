export type ExpenseCategory =
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "healthcare"
  | "shopping"
  | "education"
  | "other";

export const expenseCategoryList: ExpenseCategory[] = [
  "food",
  "transport",
  "utilities",
  "entertainment",
  "healthcare",
  "shopping",
  "education",
  "other",
] as const;

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
