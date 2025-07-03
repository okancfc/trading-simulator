"use client";

import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperCore } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import { BalanceDisplay } from "../components/BalanceDisplay";
import { TradeEntryForm } from "../components/TradeEntryForm";
import { TradeCard } from "../components/TradeCard";
import { TradeHistory } from "../components/TradeHistory";
import { SettingsModal } from "../components/SettingsModal";
import { useBalance } from "../hooks/useBalance";
import { useTrades } from "../hooks/useTrades";
import { useSettings } from "../hooks/useSettings";
import { StatsPanel } from "../components/StatsPanel";
import { Bars3Icon } from "@heroicons/react/24/outline";

const TABS = [
  { id: "trade", title: "Trade" },
  { id: "history", title: "History" },
  { id: "stats", title: "Stats" },
];

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

  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const lockedAmount = useMemo(() => {
    return openTrades.reduce((sum, trade) => sum + trade.entryAmount, 0);
  }, [openTrades]);

  const availableBalance = balance - lockedAmount;

  const handleTradePlaced = (trade: any) => {
    if (trade.entryAmount > availableBalance) {
      alert("Insufficient available balance for this trade.");
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

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    swiperInstance?.slideTo(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 md:pt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 -mt-10 pb-10">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Ayarlar"
            >
              <Bars3Icon className="h-8 w-8 text-gray-600" />
            </button>

            <BalanceDisplay balance={balance} lockedAmount={lockedAmount} />
          </div>

          <div className="flex justify-center gap-2 bg-gray-50 rounded-2xl p-2">
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(index)}
                className={`py-3 px-6 font-medium text-center transition-all duration-300 w-1/3 text-sm rounded-xl ${
                  activeIndex === index
                    ? "bg-white text-blue-600 shadow-md ring-2 ring-blue-100 transform scale-105"
                    : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <Swiper
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              modules={[Pagination]}
              slidesPerView={1}
              pagination={{ clickable: true }}
              className="w-full"
            >
              {[
                <TradeEntryForm
                  key="trade"
                  setSelectedLeverage={setSelectedLeverage}
                  leverage={selectedLeverage}
                  availableBalance={availableBalance}
                  onTradePlaced={handleTradePlaced}
                />,
                <TradeHistory key="history" trades={closedTrades} />,
                <StatsPanel key="stats" trades={closedTrades} />,
              ].map((component, index) => (
                <SwiperSlide key={index} className="p-4 h-full">
                  <div className="h-full overflow-y-auto p-2">{component}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pb-5">
          <h3 className="text-xl font-bold text-gray-800 mb-4 px-2">
            🍄 Open Trades ({openTrades.length})
          </h3>
          {openTrades.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {openTrades.map((trade) => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  onTakeProfit={handleTakeProfit}
                  onStopLoss={handleStopLoss}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
              No open trades.
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetBalance={resetBalance}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
