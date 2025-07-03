"use client";

import React, { useState, useMemo } from "react";

// --- SWIPER KÜTÜPHANESİNDEN GEREKLİ İÇE AKTARMALAR ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperCore } from 'swiper'; // Swiper instance tipi için

// --- SWIPER STİLLERİ ---
import 'swiper/css';
import 'swiper/css/pagination';
// Okları kaldırdığımız için navigation.css'e artık gerek yok.

import { BalanceDisplay } from "../components/BalanceDisplay";
import { TradeEntryForm } from "../components/TradeEntryForm";
import { TradeCard } from "../components/TradeCard";
import { TradeHistory } from "../components/TradeHistory";
import { SettingsModal } from "../components/SettingsModal";
import { useBalance } from "../hooks/useBalance";
import { useTrades } from "../hooks/useTrades";
import { useSettings } from "../hooks/useSettings";
import { StatsPanel } from "../components/StatsPanel";

// Sekmeleri ve slaytları yönetmek için bir dizi oluşturalım
const TABS = [
  { id: 'trade', title: 'Trade' },
  { id: 'history', title: 'History' },
  { id: 'stats', title: 'Stats' }
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
  
  // === YENİ STATE'LER: SWIPER KONTROLÜ İÇİN ===
  // Swiper instance'ını tutmak için state (programatik olarak kontrol etmek için)
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  // Aktif sekmenin/slaytın indeksini tutmak için state
  const [activeIndex, setActiveIndex] = useState(0);


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

  // Sekmeye tıklandığında Swiper'ı ilgili slayta kaydıran fonksiyon
  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    swiperInstance?.slideTo(index);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
            <BalanceDisplay balance={balance} lockedAmount={lockedAmount} />
        </div>

        {/* === DEĞİŞTİRİLEN BÖLÜM: ORTALANMIŞ VE SEKME EKLENMİŞ SWIPER === */}
        <div className="max-w-3xl mx-auto mt-8">
            {/* Sekmeli Navigasyon */}
            <div className="flex justify-center border-b border-gray-200 mb-0">
                {TABS.map((tab, index) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(index)}
                        className={`py-2 px-6 font-medium text-center transition-colors w-1/3 ${
                            activeIndex === index
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            
            {/* Swiper Paneli */}
            <div className="p-2">
                <Swiper
                    // onSwiper ile instance'ı state'e kaydediyoruz
                    onSwiper={setSwiperInstance}
                    // Slayt değiştiğinde aktif indeksi güncelliyoruz
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    modules={[Pagination]} // Sadece Pagination modülü kaldı
                    slidesPerView={1}
                    pagination={{ clickable: true }} // Noktalar tıklanabilir
                    className="h-full w-full"
                >
                    <SwiperSlide className="p-6">
                        <TradeEntryForm
                        setSelectedLeverage={setSelectedLeverage}
                        leverage={selectedLeverage}
                        availableBalance={availableBalance}
                        onTradePlaced={handleTradePlaced}
                        />
                    </SwiperSlide>
                    <SwiperSlide className="p-6">
                        <TradeHistory trades={closedTrades} />
                    </SwiperSlide>
                    <SwiperSlide className="p-6">
                        <StatsPanel trades={closedTrades} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>

        {/* Açık Pozisyonlar - Artık panelin altında yer alıyor */}
        <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Open Trades ({openTrades.length})</h2>
            {openTrades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                    No open trades.
                </div>
            )}
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
}