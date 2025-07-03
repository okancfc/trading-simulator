import React from 'react';
import { formatCurrency } from '../lib/utils';
import type { ClosedTrade } from '../lib/types';

interface TradeHistoryProps {
  trades: ClosedTrade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  if (trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Trade History</h3>
        <p className="text-gray-600">No trades completed yet.</p>
      </div>
    );
  }

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winRate = trades.length > 0 ? (trades.filter(t => t.outcome === 'profit').length / trades.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Trade History</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total P&L</p>
          <p className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
          </p>
          <p className="text-sm text-gray-600">Win Rate: {winRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className={`p-4 rounded-md border-l-4 ${
              trade.outcome === 'profit' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">
                  {formatCurrency(trade.entryAmount)} @ {trade.leverage}x
                </p>
                <p className="text-sm text-gray-600">
                  {trade.closeTimestamp.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  trade.outcome === 'profit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                </p>
                <p className="text-sm text-gray-600">
                  {trade.outcome === 'profit' ? '✅ TP' : '❌ SL'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
