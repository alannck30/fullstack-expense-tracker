import { useExpenseStore } from "@/store/expenseStore";
import { Package } from "lucide-react";
import ExpenseCard from "./ExpenseCard";
import type { Expense } from "@/types";
import { useMemo } from "react";

interface ExpenseListProps {
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

function ExpenseList({ onEdit, onDelete }: ExpenseListProps) {
  const { expenses, filters } = useExpenseStore();

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter((exp) => {
        const descriptionMatch = exp.description
          .toLowerCase()
          .includes(searchLower);
        const categoryMatch = exp.category.toLowerCase().includes(searchLower);
        const amountMatch = exp.amount.toString().includes(searchLower);

        return descriptionMatch || categoryMatch || amountMatch;
      });
    }

    if (filters.startDate) {
      result = result.filter((exp) => {
        const expenseDate = exp.date.split("T")[0];
        return expenseDate >= filters.startDate!;
      });
    }

    if (filters.endDate) {
      result = result.filter((exp) => {
        const expenseDate = exp.date.split("T")[0];
        return expenseDate <= filters.endDate!;
      });
    }

    if (filters.minAmount !== null) {
      result = result.filter((exp) => exp.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== null) {
      result = result.filter((exp) => exp.amount <= filters.maxAmount!);
    }

    return result;
  }, [expenses, filters]);

  function getEmptyMessage(): string {
    const hasActiveFilters =
      filters.searchTerm ||
      filters.startDate ||
      filters.endDate ||
      filters.minAmount ||
      filters.maxAmount ||
      (filters.category && filters.category !== "all") ||
      (filters.sort && filters.sort !== "-date");

    if (hasActiveFilters) {
      return "No expense match your filter";
    }
    return "No expenses found";
  }

  function getEmptyHint(): string {
    const hasActiveFilters =
      filters.searchTerm ||
      filters.startDate ||
      filters.endDate ||
      filters.minAmount ||
      filters.maxAmount ||
      (filters.category && filters.category !== "all") ||
      (filters.sort && filters.sort !== "-date");

    if (hasActiveFilters) {
      return "Try adjusting or clearing your filters";
    }
    return "Start by adding your first expense";
  }

  return (
    <section className="col-span-4 flex flex-col gap-6">
      {filteredExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Package className="size-24 text-gray-700" />
          <div className="text-center">
            <p className="text-xl text-gray-400 font-medium">
              {getEmptyMessage()}
            </p>
            <p className="text-gray-500 mt-1">{getEmptyHint()}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-100">
              {filters.category && filters.category !== "all"
                ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}`
                : "Your Expenses"}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredExpenses.length} expense
              {filteredExpenses.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExpenses.map((exp) => (
              <ExpenseCard
                expense={exp}
                key={exp._id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default ExpenseList;
