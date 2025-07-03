import React from 'react';
import { formatCurrency } from '../lib/utils';
import type { Trade } from '../lib/types';

interface TradeCardProps {
  trade: Trade;
  onTakeProfit: (tradeId: string, pnl: number) => void;
  onStopLoss: (tradeId: string, pnl: number) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  onTakeProfit,
  onStopLoss,
}) => {
  const potentialProfit = (trade.positionSize * trade.tpPercentage) / 100;
  const potentialLoss = (trade.positionSize * trade.slPercentage) / 100;

  const handleTakeProfit = () => {
    onTakeProfit(trade.id, potentialProfit);
  };

  const handleStopLoss = () => {
    onStopLoss(trade.id, -potentialLoss);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Open Position</h4>
          <p className="text-sm text-gray-600">
            {trade.timestamp.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Entry Amount</p>
          <p className="text-lg font-semibold">{formatCurrency(trade.entryAmount)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-md">
        <div>
          <p className="text-sm text-gray-600">Leverage</p>
          <p className="font-semibold">{trade.leverage}x</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Position Size</p>
          <p className="font-semibold">{formatCurrency(trade.positionSize)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-md">
          <p className="text-sm text-green-700">TP ({trade.tpPercentage}%)</p>
          <p className="text-lg font-bold text-green-600">
            +{formatCurrency(potentialProfit)}
          </p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-md">
          <p className="text-sm text-red-700">SL ({trade.slPercentage}%)</p>
          <p className="text-lg font-bold text-red-600">
            -{formatCurrency(potentialLoss)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleTakeProfit}
          className="py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          ✅ Take Profit
        </button>
        <button
          onClick={handleStopLoss}
          className="py-3 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          ❌ Stop Loss
        </button>
      </div>
    </div>
  );
};
