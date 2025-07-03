import React from 'react';
import type { ClosedTrade } from '../lib/types';
import { formatCurrency } from '../lib/utils';

interface TradeHistoryProps {
  trades: ClosedTrade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  if (trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No closed trades yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">📒 Trade History</h3>
      <ul className="divide-y divide-gray-200">
        {trades.map((trade) => (
          <li key={trade.id} className="py-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="text-md font-semibold text-gray-800">{trade.pair} Trade</h4>
                <p className="text-sm text-gray-500">{new Date(trade.closeTimestamp).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {trade.outcome === 'profit' ? (
                    <span className="text-green-600 font-semibold">✅ TP</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ SL</span>
                  )}
                </p>
                <p
                  className={`text-lg font-bold ${
                    trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(trade.pnl)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-2">
              <div>
                <span className="block">Entry Amount</span>
                <span className="font-semibold text-gray-800">{formatCurrency(trade.entryAmount)}</span>
              </div>
              <div>
                <span className="block">Leverage</span>
                <span className="font-semibold text-gray-800">{trade.leverage}x</span>
              </div>
              <div>
                <span className="block">Entry Price</span>
                <span className="font-semibold text-gray-800">{trade.entryPrice}</span>
              </div>
              <div>
                <span className="block">Position Size</span>
                <span className="font-semibold text-gray-800">{formatCurrency(trade.positionSize)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
