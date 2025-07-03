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

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const generateTradeId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
