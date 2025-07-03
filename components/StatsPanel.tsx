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
    if (type === "daily") return date.toLocaleDateString();
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
    return Array.from(map.entries()).map(([date, pnl]) => ({ date, pnl }));
  }, [trades, timeframe]);

  return (
    // DÜZELTME: Sabit yükseklik (h-[580px]) ve overflow-y-auto kaldırıldı.
    <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        📊 Performance Stats
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
        <div className="flex justify-between">
          <span>Total Trades</span>
          <span className="font-semibold">{trades.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Win Rate</span>
          <span className="font-semibold">{winRate.toFixed(1)}%</span>
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
          <h4 className="text-md font-semibold text-gray-800">📈 P&L Trend</h4>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {groupedData.length === 0 ? (
          <p className="text-sm text-gray-500">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={groupedData}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#4ade80"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};