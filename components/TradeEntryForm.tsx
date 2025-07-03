import React, { useState } from 'react';
import { formatCurrency, calculatePositionSize, generateTradeId } from '../lib/utils';
import type { Trade } from '../lib/types';
import { LeverageSelector } from './LeverageSelector';

interface TradeEntryFormProps {
  leverage: number;
  availableBalance: number;
  onTradePlaced: (trade: Trade) => void;
  setSelectedLeverage: (leverage: number) => void
}

export const TradeEntryForm: React.FC<TradeEntryFormProps> = ({
  leverage,
  availableBalance,
  onTradePlaced,
  setSelectedLeverage
}) => {
  const [entryAmount, setEntryAmount] = useState('');
  const [pair, setPair] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [tpPrice, setTpPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(entryAmount);
    const entry = parseFloat(entryPrice);
    const tp = parseFloat(tpPrice);
    const sl = parseFloat(slPrice);

    if (
      isNaN(amount) || isNaN(entry) || isNaN(tp) || isNaN(sl) ||
      amount <= 0 || amount > availableBalance || pair.trim() === ''
    ) {
      alert('Please enter valid trade values.');
      return;
    }

    const tpPercentage = ((tp - entry) / entry) * 100;
    const slPercentage = ((entry - sl) / entry) * 100;

    const trade: Trade = {
      id: generateTradeId(),
      pair: pair.trim().toUpperCase(),
      entryAmount: amount,
      leverage,
      positionSize: calculatePositionSize(amount, leverage),
      entryPrice: entry,
      tpPrice: tp,
      slPrice: sl,
      tpPercentage,
      slPercentage,
      timestamp: new Date(),
      status: 'open',
    };

    onTradePlaced(trade);
    setEntryAmount('');
    setEntryPrice('');
    setTpPrice('');
    setSlPrice('');
    setPair('');
  };

  const amountNum = parseFloat(entryAmount) || 0;
  const positionSize = calculatePositionSize(amountNum, leverage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Place Trade</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trading Pair</label>
          <input
            type="text"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            placeholder="e.g. BTC/USDT"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input
            type="number"
            value={entryAmount}
            onChange={(e) => setEntryAmount(e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entry Price</label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              step="0.0001"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TP Price</label>
            <input
              type="number"
              value={tpPrice}
              onChange={(e) => setTpPrice(e.target.value)}
              step="0.0001"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SL Price</label>
            <input
              type="number"
              value={slPrice}
              onChange={(e) => setSlPrice(e.target.value)}
              step="0.0001"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <LeverageSelector
              selectedLeverage={leverage}
              onLeverageChange={setSelectedLeverage}
            />

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Leverage:</span>
            <span className="font-semibold">{leverage}x</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Position Size:</span>
            <span className="font-semibold text-blue-600">{formatCurrency(positionSize)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Place Trade
        </button>
      </form>
    </div>
  );
};
