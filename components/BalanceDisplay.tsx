import React from "react";
import { formatCurrency } from "../lib/utils";

interface BalanceDisplayProps {
  balance: number;
  lockedAmount: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  lockedAmount,
}) => {
  const availableBalance = balance - lockedAmount;

  return (
    <div className="text-right">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Account Balance</p>
      <p className="font-bold text-[14px] sm:text-base md:text-lg text-gray-900 dark:text-gray-100 -mt-1">
        {formatCurrency(balance)}
      </p>
    </div>
  );
};
