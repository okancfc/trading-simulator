import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Trade, ClosedTrade } from "../lib/types";

export const useTrades = () => {
  const [openTrades, setOpenTrades] = useLocalStorage<Trade[]>(
    "open_trades",
    []
  );
  const [closedTrades, setClosedTrades] = useLocalStorage<ClosedTrade[]>(
    "closed_trades",
    []
  );

  const addTrade = (trade: Trade) => {
    setOpenTrades([...openTrades, trade]);
  };

  const closeTrade = (
    tradeId: string,
    outcome: "profit" | "loss",
    grossPnl: number,
    fee: number
  ) => {
    const trade = openTrades.find((t) => t.id === tradeId);
    if (!trade) return;

    // Calculate net PnL: for profit, fee is deducted; for loss, fee adds to the loss
    const netPnl = outcome === "profit" ? grossPnl - fee : grossPnl - fee;

    const closedTrade: ClosedTrade = {
      ...trade,
      outcome,
      pnl: netPnl,
      grossPnl,
      status: "closed",
      closeTimestamp: new Date(),
    };

    setClosedTrades([closedTrade, ...closedTrades]);
    setOpenTrades(openTrades.filter((t) => t.id !== tradeId));
  };

  const clearAllTrades = () => {
    setOpenTrades([]);
    setClosedTrades([]);
  };

  return {
    openTrades,
    closedTrades,
    addTrade,
    closeTrade,
    clearAllTrades,
  };
};
