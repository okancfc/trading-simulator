import React, { useState } from 'react';
import { formatCurrency, calculatePositionSize, generateTradeId } from '../lib/utils';
import type { Trade } from '../lib/types';
import { useSettings } from '../hooks/useSettings';

interface TradeEntryFormProps {
  leverage: number;
  availableBalance: number;
  onTradePlaced: (trade: Trade) => void;
}

export const TradeEntryForm: React.FC<TradeEntryFormProps> = ({
  leverage,
  availableBalance,
  onTradePlaced,
}) => {
  const { settings } = useSettings();
  const [entryAmount, setEntryAmount] = useState<string>('');
  const [tpPercentage, setTpPercentage] = useState<string>(settings.profitLossPercentage.toString());
  const [slPercentage, setSlPercentage] = useState<string>(settings.profitLossPercentage.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(entryAmount);
    const tp = parseFloat(tpPercentage);
    const sl = parseFloat(slPercentage);

    if (amount <= 0 || amount > availableBalance) {
      alert('Invalid entry amount');
      return;
    }

    const trade: Trade = {
      id: generateTradeId(),
      entryAmount: amount,
      leverage,
      positionSize: calculatePositionSize(amount, leverage),
      tpPercentage: tp,
      slPercentage: sl,
      timestamp: new Date(),
      status: 'open',
    };

    onTradePlaced(trade);
    setEntryAmount('');
  };

  const entryAmountNum = parseFloat(entryAmount) || 0;
  const positionSize = calculatePositionSize(entryAmountNum, leverage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Place Trade</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Entry Amount</label>
          <input
            type="number"
            value={entryAmount}
            onChange={(e) => setEntryAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            max={availableBalance}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-600 mt-1">
            Available: {formatCurrency(availableBalance)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">TP (%)</label>
            <input
              type="number"
              value={tpPercentage}
              onChange={(e) => setTpPercentage(e.target.value)}
              min="0.1"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SL (%)</label>
            <input
              type="number"
              value={slPercentage}
              onChange={(e) => setSlPercentage(e.target.value)}
              min="0.1"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Leverage:</span>
            <span className="font-semibold">{leverage}x</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Position Size:</span>
            <span className="font-semibold text-blue-600">
              {formatCurrency(positionSize)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={entryAmountNum <= 0 || entryAmountNum > availableBalance}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Place Trade
        </button>
      </form>
    </div>
  );
};
