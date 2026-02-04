export const calculatePositionSize = (
  entryAmount: number,
  leverage: number
): number => {
  return entryAmount * leverage;
};

export const calculatePnL = (
  positionSize: number,
  percentage: number,
  outcome: "profit" | "loss"
): number => {
  const pnl = (positionSize * percentage) / 100;
  return outcome === "profit" ? pnl : -pnl;
};

// Calculate trading fee based on position size and fee rates
export const calculateTradingFee = (
  positionSize: number,
  makerFee: number,
  takerFee: number
): number => {
  // Both maker and taker fees are applied (open position = maker, close position = taker)
  const totalFeePercentage = makerFee + takerFee;
  return (positionSize * totalFeePercentage) / 100;
};

// Calculate net PnL after deducting fees
export const calculateNetPnL = (
  grossPnl: number,
  fee: number
): number => {
  return grossPnl - fee;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const generateTradeId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
