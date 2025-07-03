"use client";

import React, { useState, useMemo } from "react";
import { BalanceDisplay } from "../components/BalanceDisplay";
import { LeverageSelector } from "../components/LeverageSelector";
import { TradeEntryForm } from "../components/TradeEntryForm";
import { TradeCard } from "../components/TradeCard";
import { TradeHistory } from "../components/TradeHistory";
import { SettingsModal } from "../components/SettingsModal";
import { useBalance } from "../hooks/useBalance";
import { useTrades } from "../hooks/useTrades";
import { useSettings } from "../hooks/useSettings";
import { StatsPanel } from "../components/StatsPanel";
import { PnLChart } from "../components/PnLChart";

export default function Home() {
  const { settings, updateSettings } = useSettings();
  const { balance, updateBalance, resetBalance } = useBalance(
    settings.initialBalance
  );
  const { openTrades, closedTrades, addTrade, closeTrade, clearAllTrades } =
    useTrades();

  const [selectedLeverage, setSelectedLeverage] = useState(
    settings.defaultLeverage
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const lockedAmount = useMemo(() => {
    return openTrades.reduce((sum, trade) => sum + trade.entryAmount, 0);
  }, [openTrades]);

  const availableBalance = balance - lockedAmount;

  const handleTradePlaced = (trade: any) => {
    if (trade.entryAmount > availableBalance) {
      alert("Insufficient balance");
      return;
    }
    addTrade(trade);
  };

  const handleTakeProfit = (tradeId: string, pnl: number) => {
    updateBalance(pnl);
    closeTrade(tradeId, "profit", pnl);
  };

  const handleStopLoss = (tradeId: string, pnl: number) => {
    updateBalance(pnl);
    closeTrade(tradeId, "loss", pnl);
  };

  const handleClearHistory = () => {
    clearAllTrades();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Trading Simulator
          </h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Balance Display */}
        <BalanceDisplay balance={balance} lockedAmount={lockedAmount} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Trading Interface */}
          <div>
            <TradeEntryForm
              setSelectedLeverage={setSelectedLeverage}
              leverage={selectedLeverage}
              availableBalance={availableBalance}
              onTradePlaced={handleTradePlaced}
            />

            {/* Open Trades */}
            <div className="space-y-4">
              {openTrades.map((trade) => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  onTakeProfit={handleTakeProfit}
                  onStopLoss={handleStopLoss}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <StatsPanel trades={closedTrades} />
            <TradeHistory trades={closedTrades} />
          </div>

          {/* Settings Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetBalance={resetBalance}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>
      );
    </div>
  );
}
