export interface Trade {
  id: string;
  pair: string;
  entryAmount: number;
  leverage: number;
  positionSize: number;
  tpPercentage: number;
  slPercentage: number;
  timestamp: Date;
  status: "open" | "closed";
  fee: number; // Trading fee (maker + taker)
}

export interface ClosedTrade extends Trade {
  outcome: "profit" | "loss";
  pnl: number; // Net PnL after fees
  grossPnl: number; // PnL before fees
  closeTimestamp: Date;
}

export interface Settings {
  initialBalance: number;
  defaultLeverage: number;
  profitLossPercentage: number;
  makerFee: number; // Maker fee percentage (e.g., 0.02 for 0.02%)
  takerFee: number; // Taker fee percentage (e.g., 0.05 for 0.05%)
}
