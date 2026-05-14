import { useExpenseStore } from "@/store/expenseStore";
import type { ChangeEvent } from "react";

function AmountRangeFilter() {
  const { filters, setAmountRange } = useExpenseStore();

  const handleMinAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value || null;
    setAmountRange(Number(newMin), filters.maxAmount ?? null);
  };

  const handleMaxAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value || null;
    setAmountRange(filters.minAmount ?? null, Number(newMax));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="min-amount"
          className="text-sm font-medium text-gray-400">
          Min Amount ($)
        </label>
        <input
          type="number"
          id="min-amount"
          onChange={handleMinAmountChange}
          value={filters.minAmount || ""}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="px-4 py-2.5 bg-purple-950 rounded-sm text-gray-100 border-none outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="max-amount"
          className="text-sm font-medium text-gray-400">
          Max Amount ($)
        </label>
        <input
          type="number"
          id="max-amount"
          onChange={handleMaxAmountChange}
          value={filters.maxAmount || ""}
          placeholder="No limit"
          step="0.01"
          min={filters.minAmount || "0"}
          className="px-4 py-2.5 bg-purple-950 rounded-sm text-gray-100 border-none outline-none"
        />
      </div>
    </div>
  );
}

export default AmountRangeFilter;
