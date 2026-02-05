import React from "react";
import { formatCurrency } from "../lib/utils";
import type { Trade } from "../lib/types";

interface TradeCardProps {
  trade: Trade;
  onTakeProfit: (tradeId: string, grossPnl: number, fee: number) => void;
  onStopLoss: (tradeId: string, grossPnl: number, fee: number) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  onTakeProfit,
  onStopLoss,
}) => {
  const potentialProfit = (trade.positionSize * trade.tpPercentage) / 100;
  const potentialLoss = (trade.positionSize * trade.slPercentage) / 100;

  // Net values after fee deduction
  const netProfit = potentialProfit - trade.fee;
  const netLoss = potentialLoss + trade.fee; // Fee adds to loss

  const handleTakeProfit = () => {
    onTakeProfit(trade.id, potentialProfit, trade.fee);
  };

  const handleStopLoss = () => {
    onStopLoss(trade.id, -potentialLoss, trade.fee);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-blue-500 dark:border-blue-600 transition-colors duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{trade.pair}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(trade.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Entry Amount</p>
          <p className="text-lg font-semibold dark:text-gray-200">
            {formatCurrency(trade.entryAmount)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Leverage</p>
          <p className="font-semibold dark:text-gray-200">{trade.leverage}x</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pos. Size</p>
          <p className="font-semibold dark:text-gray-200">{formatCurrency(trade.positionSize)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fee</p>
          <p className="font-semibold text-orange-500 dark:text-orange-400">{formatCurrency(trade.fee)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleTakeProfit}
          className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors w-full"
        >
          <p className="text-sm text-green-700 dark:text-green-400">
            TP ({trade.tpPercentage.toFixed(2)}%)
          </p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            +{formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            (Gross: +{formatCurrency(potentialProfit)})
          </p>
        </button>
        <button
          onClick={handleStopLoss}
          className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors w-full"
        >
          <p className="text-sm text-red-700 dark:text-red-400">
            SL ({trade.slPercentage.toFixed(2)}%)
          </p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            -{formatCurrency(netLoss)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            (Loss + Fee: -{formatCurrency(potentialLoss)} - {formatCurrency(trade.fee)})
          </p>
        </button>
      </div>
    </div>
  );
};
