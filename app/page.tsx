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
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

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
    <div className="min-h-screen overflow-y-auto scrollbar-hide bg-gray-50 pt-32 md:pt-24">
      {/*
        ===================================================================
        RESPONSIVE HEADER DÜZENLEMESİ
        ===================================================================
      */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          
          {/*
            ============================================================
            1. MASAÜSTÜ İÇİN HEADER (Eski, Tek Satırlı Hali)
            - `hidden md:flex` ile sadece orta ve büyük ekranlarda görünür.
            ============================================================
          */}
          <div className="hidden md:flex justify-between items-center h-20">
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200 hover:scale-110 active:scale-95 group"
                aria-label="Ayarlar"
              >
                <Cog6ToothIcon className="h-6 w-6 text-gray-700 transition-transform duration-200 group-hover:rotate-90" />
              </button>
            </div>

            <div className="flex-shrink-0">
              <div className="relative flex justify-center items-center gap-2 bg-gray-100 rounded-full p-1.5 shadow-inner">
                {/* Sliding Background */}
                <div 
                  className="absolute top-1.5 bg-white rounded-full shadow-lg transition-all duration-300 ease-out"
                  style={{
                    left: `${activeIndex * (100 / 3)}%`,
                    height: 'calc(100% - 0.75rem)',
                    marginLeft: '0.375rem',
                    marginRight: '0.375rem',
                    width: 'calc(33.333% - 0.75rem)'
                  }}
                />
                {TABS.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(index)}
                    className={`relative z-10 py-2 px-5 font-semibold text-center transition-all duration-300 ease-out w-full text-sm rounded-full transform hover:scale-105 ${
                      activeIndex === index
                        ? "text-blue-600 scale-105"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                  >
                    <span className="relative z-10">{tab.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-end">
              <BalanceDisplay balance={balance} lockedAmount={lockedAmount} />
            </div>
          </div>

          {/*
            ============================================================
            2. MOBİL İÇİN HEADER (Yeni, İki Satırlı Hali)
            - `flex md:hidden` ile sadece küçük ekranlarda görünür.
            ============================================================
          */}
          <div className="flex flex-col md:hidden py-3">
            <div className="w-full flex justify-between items-center">
              <div className="flex-1 flex justify-start">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200 hover:scale-110 active:scale-95 group"
                  aria-label="Ayarlar"
                >
                  <Cog6ToothIcon className="h-6 w-6 text-gray-700 transition-transform duration-200 group-hover:rotate-90" />
                </button>
              </div>
              <div className="flex-1 flex justify-end">
                <BalanceDisplay balance={balance} lockedAmount={lockedAmount} />
              </div>
            </div>

            <div className="flex-shrink-0 mt-2">
              <div className="relative flex justify-center items-center gap-2 bg-gray-100 rounded-full p-1.5 shadow-inner">
                {/* Sliding Background for Mobile */}
                <div 
                  className="absolute top-1.5 bg-white rounded-full shadow-lg transition-all duration-300 ease-out"
                  style={{
                    left: `${activeIndex * (100 / 3)}%`,
                    height: 'calc(100% - 0.75rem)',
                    marginLeft: '0.375rem',
                    marginRight: '0.375rem',
                    width: 'calc(33.333% - 0.75rem)'
                  }}
                />
                {TABS.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(index)}
                    className={`relative z-10 py-2 px-5 font-semibold text-center transition-all duration-300 ease-out w-full text-sm rounded-full transform hover:scale-105 active:scale-95 ${
                      activeIndex === index
                        ? "text-blue-600 scale-105"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                  >
                    <span className="relative z-10">{tab.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </header>

      {/* Sayfa içeriği */}
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {/*
            DÜZELTME: Sabit yükseklik (h-[...]) kaldırıldı.
            Artık yükseklik, içindeki slaytlar tarafından belirlenecek.
          */}
          <div className="mt-2">
            <Swiper
              // DÜZELTME: autoHeight kaldırıldı.
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              modules={[Pagination]}
              slidesPerView={1}
              pagination={{ clickable: true }}
              className="w-full"
              speed={300}
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
                <SwiperSlide key={index} className="p-2 pb-10">
                  {component}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pb-12">
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