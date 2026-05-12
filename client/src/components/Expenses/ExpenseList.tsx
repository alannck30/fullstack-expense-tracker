import { useExpenseStore } from "@/store/expenseStore";
import { Package } from "lucide-react";
import ExpenseCard from "./ExpenseCard";

function ExpenseList() {
  const { expenses, filters } = useExpenseStore();

  function getEmptyMessage(): string {
    if (filters.category && filters.category !== "all") {
      return `No ${filters.category} expenses found`;
    }
    return "No expenses found";
  }

  function getEmptyHint(): string {
    if (filters.category && filters.category !== "all") {
      return "Try changing the category filter or add a new expense";
    }
    return "Start by adding your first expense";
  }

  return (
    <section className="col-span-4 flex flex-col gap-6">
      {expenses.length === 0 ? (
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
              {expenses.length} expense{expenses.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {expenses.map((exp) => (
              <ExpenseCard expense={exp} key={exp._id} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default ExpenseList;
