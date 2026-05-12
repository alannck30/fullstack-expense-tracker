import ExpenseList from "@/components/Expenses/ExpenseList";
import ExpenseModal from "@/components/Expenses/ExpenseModal";
import ExpenseFilters from "@/components/Expenses/ExpenseFilters";
import { useExpenseStore } from "@/store/expenseStore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

function ExpensesPage() {
  const { isLoading, getAllExpenses } = useExpenseStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleClick() {
    setIsModalOpen(true);
  }

  useEffect(() => {
    getAllExpenses();
  }, [getAllExpenses]);

  return (
    <main className="bg-slate-950 px-4 py-8 sm:px-8 sm:py-12">
      <div className="border-b border-purple-950 pb-4 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Expenses</h1>
          <p className="text-gray-400 mt-1">Manage and track your expenses</p>
        </div>
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-6 py-3 bg-purple-950 text-gray-100 rounded-sm hover:bg-purple-800 transition font-medium">
          <Plus className="size-5" /> Add Expense
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-24">
          <p className="text-gray-400 text-lg">Loading expenses...</p>
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-6">
          <ExpenseFilters />
          <ExpenseList />
        </div>
      )}

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

export default ExpensesPage;
