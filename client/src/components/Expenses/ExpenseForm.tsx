import { useExpenseStore } from "@/store/expenseStore";
import { expenseCategoryList, type ExpenseCategory } from "@/types";
import { getCategoryConfig } from "@/utils/CategoryConfig";
import { useState, type SubmitEvent } from "react";

interface ExpenseFormProps {
  onSuccess: () => void;
}

function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { error, isLoading, createExpense } = useExpenseStore();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("other");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const expenseData = {
      amount: parseFloat(amount),
      description,
      category,
      date,
    };

    await createExpense(expenseData);

    const { error: currentError } = useExpenseStore.getState();
    if (!currentError) {
      setAmount("");
      setDescription("");
      setCategory("other");
      setDate(new Date().toISOString().split("T")[0]);

      if (onSuccess) {
        onSuccess();
      }
    }
  }

  return (
    <div className="col-span-4 sm:col-span-3 flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <p className="text-gray-400">Track your spending</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-4 py-3 bg-red-900/20 border-red-700 rounded-sm text-red-400">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-6 border border-purple-950 rounded-sm p-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-gray-300">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                placeholder="49.99"
                disabled={isLoading}
                className="px-4 py-3 bg-purple-950 rounded-sm text-gray-100 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-300">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Lunch at restaurant"
                disabled={isLoading}
                className="px-4 py-3 bg-purple-950 rounded-sm text-gray-100 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-300">
                Category
              </label>
              <select
                name="category"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                disabled={isLoading}
                className="px-4 py-3 bg-purple-950 rounded-sm text-gray-100 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer">
                {expenseCategoryList.map((cat) => {
                  const config = getCategoryConfig(cat);
                  return (
                    <option value={cat} key={cat}>
                      {config.emoji} {config.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-300">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isLoading}
                className="px-4 py-3 bg-purple-950 rounded-sm text-gray-100 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-purple-950 text-gray-100 rounded-sm border border-purple-950 hover:border-purple-950 hover:bg-transparent transition font-medium">
            {isLoading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
