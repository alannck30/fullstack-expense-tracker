import type { ExpenseState } from "@/types/expense.types";
import { create } from "zustand";
import {
  createExpense as createExpenseService,
  getAllExpenses as getAllExpensesService,
} from "@/services/expenseService";
import type { AxiosError } from "axios";

interface ExpenseStore extends ExpenseState {
  clearError: () => void;

  createExpense: (data: {
    amount: number;
    description: string;
    category: string;
    date: string;
  }) => Promise<void>;

  getAllExpenses: () => Promise<void>;

  setCategory: (category: string) => void;

  setSort: (sort: string) => void;

  clearFilters: () => void;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  currentExpense: null,
  filters: { category: "all", sort: "-date" },

  clearError: () => set({ error: null }),

  setCategory: (category: string) => {
    set({ filters: { ...get().filters, category } });

    get().getAllExpenses();
  },

  setSort: (sort: string) => {
    set({ filters: { ...get().filters, sort } });

    get().getAllExpenses();
  },

  clearFilters: () => {
    set({ filters: { category: "all", sort: "-date" } });
    get().getAllExpenses();
  },

  createExpense: async (data: {
    amount: number;
    description: string;
    category: string;
    date: string;
  }) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await createExpenseService(data);

      if (response.data) {
        set((state) => ({
          expenses: [...state.expenses, response.data!],
          isLoading: false,
          error: null,
        }));
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      set({
        error: err.response?.data?.error,
        isLoading: false,
      });
    }
  },

  getAllExpenses: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const { filters } = get();

      const queryParams = new URLSearchParams();

      if (filters.category && filters.category !== "all") {
        queryParams.append("category", filters.category);
      }

      if (filters.sort) {
        queryParams.append("sort", filters.sort);
      }

      const queryString = queryParams.toString();

      const endPoint = queryString ? `/expenses?${queryString}` : "/expenses";

      const response = await getAllExpensesService(endPoint);

      if (response.data) {
        set({
          expenses: response.data,
          totalCount: response.data.length,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      set({
        error: err.response?.data?.error,
        isLoading: false,
      });
    }
  },
}));
