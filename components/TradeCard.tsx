import React from "react";
import { formatCurrency } from "../lib/utils";
import type { Trade } from "../lib/types";

interface TradeCardProps {
  trade: Trade;
  onTakeProfit: (tradeId: string, pnl: number) => void;
  onStopLoss: (tradeId: string, pnl: number) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  onTakeProfit,
  onStopLoss,
}) => {
  const potentialProfit = (trade.positionSize * trade.tpPercentage) / 100;
  const potentialLoss = (trade.positionSize * trade.slPercentage) / 100;

  const handleTakeProfit = () => {
    onTakeProfit(trade.id, potentialProfit);
  };

  const handleStopLoss = () => {
    onStopLoss(trade.id, -potentialLoss);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            {trade.pair}
          </h4>
          <p className="text-xs text-gray-500">
            {trade.timestamp.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Entry Amount</p>
          <p className="text-lg font-semibold">
            {formatCurrency(trade.entryAmount)}
          </p>
        </div>
      </div>

      {/*
        DÜZELTME: Bu grid varsayılan olarak tek sütun (mobil),
        geniş ekranlarda iki sütun olacak şekilde güncellendi (`sm:grid-cols-2`).
      */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">Leverage</p>
          <p className="font-semibold">{trade.leverage}x</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Pos. Size</p>
          <p className="font-semibold">{formatCurrency(trade.positionSize)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">TP Price</p>
          <p className="font-semibold text-green-600">{trade.tpPrice}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">SL Price</p>
          <p className="font-semibold text-red-600">{trade.slPrice}</p>
        </div>
      </div>

      {/*
        DÜZELTME: Butonlar da mobil cihazlarda daha iyi görünmesi için
        tek sütundan başlayacak şekilde ayarlandı.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleTakeProfit}
          className="text-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors w-full"
        >
          <p className="text-sm text-green-700">
            TP ({trade.tpPercentage.toFixed(1)}%)
          </p>
          <p className="text-lg font-bold text-green-600">
            +{formatCurrency(potentialProfit)}
          </p>
        </button>
        <button
          onClick={handleStopLoss}
          className="text-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors w-full"
        >
          <p className="text-sm text-red-700">
            SL ({trade.slPercentage.toFixed(1)}%)
          </p>
          <p className="text-lg font-bold text-red-600">
            -{formatCurrency(potentialLoss)}
          </p>
        </button>
      </div>
    </div>
  );
};