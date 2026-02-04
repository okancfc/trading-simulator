import { useLocalStorage } from "./useLocalStorage";
import type { Settings } from "../lib/types";

const defaultSettings: Settings = {
  initialBalance: 10000,
  defaultLeverage: 10,
  profitLossPercentage: 10,
  makerFee: 0.02, // 0.0200%
  takerFee: 0.05, // 0.0500%
};

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "trading_settings",
    defaultSettings
  );

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return { settings, updateSettings, resetSettings };
};
