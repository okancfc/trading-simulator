export interface Trade {
  id: string;
  pair: string;
  entryAmount: number;
  leverage: number;
  positionSize: number;
  entryPrice: number;
  tpPrice: number;
  slPrice: number;
  tpPercentage: number;
  slPercentage: number;
  timestamp: Date;
  status: "open" | "closed";
}

export interface ClosedTrade extends Trade {
  outcome: "profit" | "loss";
  pnl: number;
  closeTimestamp: Date;
}

export interface Settings {
  initialBalance: number;
  defaultLeverage: number;
  profitLossPercentage: number;
}
