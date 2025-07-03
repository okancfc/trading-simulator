import React from 'react';
import { formatCurrency } from '../lib/utils';

interface BalanceDisplayProps {
  balance: number;
  lockedAmount: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, lockedAmount }) => {
  const availableBalance = balance - lockedAmount;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Account Balance</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(balance)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-xl font-semibold text-blue-600">{formatCurrency(availableBalance)}</p>
          {lockedAmount > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              Locked: {formatCurrency(lockedAmount)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
