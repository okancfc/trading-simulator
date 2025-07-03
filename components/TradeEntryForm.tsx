import React, { useState } from "react";
import {
  formatCurrency,
  calculatePositionSize,
  generateTradeId,
} from "../lib/utils";
import type { Trade } from "../lib/types";
import { LeverageSelector } from "./LeverageSelector";

interface TradeEntryFormProps {
  leverage: number;
  availableBalance: number;
  onTradePlaced: (trade: Trade) => void;
  setSelectedLeverage: (leverage: number) => void;
}

// O anki piyasa fiyatını simüle etmek için basit bir fonksiyon.
// Gerçek bir uygulamada burası bir API'den gelen veriyi kullanırdı.
const getSimulatedCurrentPrice = (pair: string) => {
  // Parite isminden deterministik ama rastgele görünen bir sayı üretelim
  let hash = 0;
  for (let i = 0; i < pair.length; i++) {
    const char = pair.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // 32bit integer'a çevir
  }
  
  const basePrice = (Math.abs(hash) % 40000) + 1000; // 1,000 ile 41,000 arası bir baz fiyat
  const fluctuation = Math.random() * 100 - 50; // +/- 50 dalgalanma
  
  // Fiyatı daha gerçekçi göstermek için ondalık bırakalım
  return parseFloat((basePrice + fluctuation).toFixed(2));
};


export const TradeEntryForm: React.FC<TradeEntryFormProps> = ({
  leverage,
  availableBalance,
  onTradePlaced,
  setSelectedLeverage,
}) => {
  const [entryAmount, setEntryAmount] = useState("");
  const [pair, setPair] = useState("");
  // Fiyat state'leri kaldırıldı, yerine yüzde state'leri geldi
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
    
    // YENİ MANTIK: Fiyatları simüle et ve hesapla
    const entryPrice = getSimulatedCurrentPrice(pair);
    const tpPrice = entryPrice * (1 + tpPercent / 100);
    const slPrice = entryPrice * (1 - slPercent / 100);


    const trade: Trade = {
      id: generateTradeId(),
      pair: pair.trim().toUpperCase(),
      entryAmount: amount,
      leverage,
      positionSize: calculatePositionSize(amount, leverage),
      entryPrice: entryPrice,
      tpPrice: parseFloat(tpPrice.toFixed(4)), // Fiyatları hassas ama makul ondalıkta tut
      slPrice: parseFloat(slPrice.toFixed(4)),
      tpPercentage: tpPercent,
      slPercentage: slPercent,
      timestamp: new Date(),
      status: "open",
    };

    onTradePlaced(trade);

    // Formu sıfırla
    setEntryAmount("");
    setTpPercentage("");
    setSlPercentage("");
    setPair("");
  };

  const amountNum = parseFloat(entryAmount) || 0;
  const positionSize = calculatePositionSize(amountNum, leverage);

  return (
    <div className="bg-white rounded-lg p-5 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-4 border-b">
        🎯 Place Trade
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trading Pair
          </label>
          <input
            type="text"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            placeholder="e.g. BTC/USDT"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            value={entryAmount}
            onChange={(e) => setEntryAmount(e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Fiyat inputları kaldırıldı, yerine yüzde inputları geldi */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Take Profit (%)
            </label>
            <input
              type="number"
              value={tpPercentage}
              onChange={(e) => setTpPercentage(e.target.value)}
              step="0.001" // 0.XX ondalık hassasiyeti için
              min="0"
              placeholder="e.g. 1.25"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stop Loss (%)
            </label>
            <input
              type="number"
              value={slPercentage}
              onChange={(e) => setSlPercentage(e.target.value)}
              step="0.001" // 0.XX ondalık hassasiyeti için
              min="0"
              placeholder="e.g. 0.80"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <LeverageSelector
          selectedLeverage={leverage}
          onLeverageChange={setSelectedLeverage}
        />

        <div className="bg-gray-50 p-3 rounded-lg border">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Position Size:</span>
            <span className="font-semibold text-blue-600">
              {formatCurrency(positionSize)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Place Trade
        </button>
      </form>
    </div>
  );
};