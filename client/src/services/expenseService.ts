import type { ApiResponse, Expense } from "@/types";
import api from "./api";

export const createExpense = async (data: {
  amount: number;
  description: string;
  category: string;
  date: string;
}) => {
  const response = await api.post<ApiResponse<Expense>>("/expenses", data);
  return response.data;
};

export const getAllExpenses = async (endPoint: string) => {
  const response = await api.get<ApiResponse<Expense[]>>(endPoint);
  return response.data;
};
