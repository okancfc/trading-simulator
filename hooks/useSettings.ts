import { useLocalStorage } from "./useLocalStorage";
import type { Settings } from "../lib/types";

const defaultSettings: Settings = {
  initialBalance: 10000,
  defaultLeverage: 10,
  profitLossPercentage: 10,
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
