import React, { useState } from "react";
import {
  formatCurrency,
  calculatePositionSize,
  generateTradeId,
  calculateTradingFee,
} from "../lib/utils";
import type { Trade } from "../lib/types";
import { LeverageSelector } from "./LeverageSelector";

interface TradeEntryFormProps {
  leverage: number;
  availableBalance: number;
  onTradePlaced: (trade: Trade) => void;
  setSelectedLeverage: (leverage: number) => void;
  makerFee: number;
  takerFee: number;
}

export const TradeEntryForm: React.FC<TradeEntryFormProps> = ({
  leverage,
  availableBalance,
  onTradePlaced,
  setSelectedLeverage,
  makerFee,
  takerFee,
}) => {
  const [entryAmount, setEntryAmount] = useState("");
  const [pair, setPair] = useState("");
  const [tpPercentage, setTpPercentage] = useState("");
  const [slPercentage, setSlPercentage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(entryAmount);
    const tpPercent = parseFloat(tpPercentage);
    const slPercent = parseFloat(slPercentage);

    if (
      isNaN(amount) ||
      isNaN(tpPercent) ||
      isNaN(slPercent) ||
      amount <= 0 ||
      tpPercent <= 0 ||
      slPercent <= 0 ||
      amount > availableBalance ||
      pair.trim() === ""
    ) {
      alert("Please enter valid and complete trade values.");
      return;
    }

    const positionSize = calculatePositionSize(amount, leverage);
    const fee = calculateTradingFee(positionSize, makerFee, takerFee);

    const trade: Trade = {
      id: generateTradeId(),
      pair: pair.trim().toUpperCase(),
      entryAmount: amount,
      leverage,
      positionSize,
      tpPercentage: tpPercent,
      slPercentage: slPercent,
      timestamp: new Date(),
      status: "open",
      fee,
    };

    onTradePlaced(trade);

    setEntryAmount("");
    setTpPercentage("");
    setSlPercentage("");
    setPair("");
  };

  const amountNum = parseFloat(entryAmount) || 0;
  const positionSize = calculatePositionSize(amountNum, leverage);
  const estimatedFee = calculateTradingFee(positionSize, makerFee, takerFee);
  const totalFeePercentage = makerFee + takerFee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md transition-colors duration-200">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-4 border-b dark:border-gray-700 transition-colors duration-200">
        🎯 Place Trade
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trading Pair
          </label>
          <input
            type="text"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            placeholder="e.g. BTC/USDT"
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            value={entryAmount}
            onChange={(e) => setEntryAmount(e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 transition-colors duration-200"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Take Profit (%)
            </label>
            <input
              type="number"
              value={tpPercentage}
              onChange={(e) => setTpPercentage(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stop Loss (%)
            </label>
            <input
              type="number"
              value={slPercentage}
              onChange={(e) => setSlPercentage(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 transition-colors duration-200"
              required
            />
          </div>
        </div>

        <LeverageSelector
          selectedLeverage={leverage}
          onLeverageChange={setSelectedLeverage}
        />

        <div className="mt-6 border-t pt-4 border-gray-100 dark:border-gray-700 space-y-3 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Position Size</div>
            <div className="font-semibold text-gray-800 dark:text-gray-100">
              {formatCurrency(positionSize)}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Estimated Fee ({totalFeePercentage.toFixed(4)}%)
            </div>
            <div className="font-semibold text-orange-500 dark:text-orange-400">
              {formatCurrency(estimatedFee)}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
            <div>Maker: {makerFee.toFixed(4)}% | Taker: {takerFee.toFixed(4)}%</div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Place Trade
        </button>
      </form>
    </div>
  );
};
