import { useLocalStorage } from './useLocalStorage';

export const useBalance = (initialBalance: number = 10000) => {
  const [balance, setBalance] = useLocalStorage<number>('trading_balance', initialBalance);

  const updateBalance = (amount: number) => {
    setBalance(Math.max(0, balance + amount));
  };

  const resetBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  return { balance, updateBalance, resetBalance };
};
