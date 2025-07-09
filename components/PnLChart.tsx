import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ClosedTrade } from "../lib/types";

interface PnLChartProps {
  trades: ClosedTrade[];
}

type TimeFrame = "daily" | "weekly" | "monthly";

export const PnLChart: React.FC<PnLChartProps> = ({ trades }) => {
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">📈 P&L Trend</h3>
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
  );
};
