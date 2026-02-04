import React from "react";
import type { ClosedTrade } from "../lib/types";
import { formatCurrency } from "../lib/utils";

interface TradeHistoryProps {
  trades: ClosedTrade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  if (trades.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center min-h-[550px] transition-colors duration-200">
        <div>
          <div className="text-4xl mb-2">📝</div>
          <p>No closed trades yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg flex flex-col shadow-md min-h-[550px] transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          📒 Trade History
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {trades.length} closed trades
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-h-[450px]">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {trades.map((trade) => (
            <li key={trade.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                    {trade.pair} Trade
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(trade.closeTimestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {trade.outcome === "profit" ? (
                      <span className="font-semibold text-green-600">
                        ✅ Profit
                      </span>
                    ) : (
                      <span className="font-semibold text-red-600">
                        ❌ Loss
                      </span>
                    )}
                  </p>
                  <p
                    className={`text-lg font-bold ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {formatCurrency(trade.pnl)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mt-3 pt-3 border-t dark:border-gray-700">
                <div>
                  <span className="block opacity-70">Entry Amount</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {formatCurrency(trade.entryAmount)}
                  </span>
                </div>
                <div>
                  <span className="block opacity-70">Position Size</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {formatCurrency(trade.positionSize)}
                  </span>
                </div>
                <div>
                  <span className="block opacity-70">Leverage</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {trade.leverage}x
                  </span>
                </div>
                <div>
                  <span className="block opacity-70">Volume (%)</span>
                  <span className="font-semibold text-gray-800">
                    {trade.outcome === "profit" ? (
                      <span className="font-semibold text-">
                        % +{trade.tpPercentage}
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        % -{trade.slPercentage}
                      </span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="block opacity-70">Fee</span>
                  <span className="font-semibold text-orange-500 dark:text-orange-400">
                    {formatCurrency(trade.fee)}
                  </span>
                </div>
                <div>
                  <span className="block opacity-70">Gross PnL</span>
                  <span className={`font-semibold ${trade.grossPnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(trade.grossPnl)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
