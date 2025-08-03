import React, { useMemo, useState } from "react";
import type { ClosedTrade } from "../lib/types";
import { formatCurrency } from "../lib/utils";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatsPanelProps {
  trades: ClosedTrade[];
}

type TimeFrame = "daily" | "weekly" | "monthly";

export const StatsPanel: React.FC<StatsPanelProps> = ({ trades }) => {
  const now = new Date();
  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const winCount = trades.filter((t) => t.outcome === "profit").length;
  const winRate = trades.length > 0 ? (winCount / trades.length) * 100 : 0;

  const pnl7Days = trades
    .filter((t) => new Date(t.closeTimestamp) > daysAgo(7))
    .reduce((sum, t) => sum + t.pnl, 0);

  const pnl30Days = trades
    .filter((t) => new Date(t.closeTimestamp) > daysAgo(30))
    .reduce((sum, t) => sum + t.pnl, 0);

  const [timeframe, setTimeframe] = useState<TimeFrame>("daily");

  const formatDate = (date: Date, type: TimeFrame) => {
    if (type === "daily") {
      return date.toLocaleDateString();
    }
    if (type === "weekly") {
      const week = getWeekNumber(date);
      return `${date.getFullYear()} - W${week}`;
    }
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  };

  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
  };

  const groupedData = useMemo(() => {
    const map = new Map<string, number>();
    trades.forEach((trade) => {
      const key = formatDate(new Date(trade.closeTimestamp), timeframe);
      map.set(key, (map.get(key) || 0) + trade.pnl);
    });
    return Array.from(map.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, pnl]) => ({ date, pnl }));
  }, [trades, timeframe]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md min-h-[550px] transition-colors duration-200">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        📊 Performance Stats
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 text-gray-700 dark:text-gray-300">
        <div className="flex justify-between">
          <span>Total Trades</span>
          <span className="font-semibold dark:text-gray-200">{trades.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Win Rate</span>
          <span className="font-semibold dark:text-gray-200">{winRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Total P&L</span>
          <span
            className={`font-semibold ${
              totalPnL >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(totalPnL)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Last 7 Days P&L</span>
          <span
            className={`font-semibold ${
              pnl7Days >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(pnl7Days)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Last 30 Days P&L</span>
          <span
            className={`font-semibold ${
              pnl30Days >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(pnl30Days)}
          </span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100">📈 P&L Trend</h4>
          <div className="flex gap-3">
            <button
              onClick={() => setTimeframe("daily")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${timeframe === "daily" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${timeframe === "weekly" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${timeframe === "monthly" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              Monthly
            </button>
          </div>
        </div>

        {trades.length < 2 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 mt-12">
            <div className="text-4xl mb-3">📈</div>
            <p>Need more trade data for charts.</p>
            <p className="text-sm mt-1">Close at least 2 trades to see charts.</p>
          </div>
        ) : groupedData.length === 0 ? (
          <p className="flex justify-center text-sm text-gray-500 dark:text-gray-400 py-20">
            No data available.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={groupedData}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" opacity={0.7} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-primary, #333)' }}
                angle={-30}
                textAnchor="end"
                interval="preserveStartEnd"
                stroke="var(--border-subtle, #ddd)"
              />
              <YAxis 
                tick={{ fill: 'var(--text-primary, #333)' }}
                stroke="var(--border-subtle, #ddd)"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-surface, white)',
                  borderColor: 'var(--border-subtle, #ddd)',
                  color: 'var(--text-primary, #333)'
                }}
              />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="var(--color-accent, #4ade80)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 1 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
