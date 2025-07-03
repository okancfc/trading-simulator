export interface Trade {
    id: string;
    entryAmount: number;
    leverage: number;
    positionSize: number;
    tpPercentage: number;  
    slPercentage: number; 
    timestamp: Date;
    status: 'open' | 'closed';
  }
  
  export interface ClosedTrade extends Trade {
    outcome: 'profit' | 'loss';
    pnl: number;
    closeTimestamp: Date;
  }
  
  export interface Settings {
    initialBalance: number;
    defaultLeverage: number;
    profitLossPercentage: number;
  }
  