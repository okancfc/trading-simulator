import React, { useState, useEffect } from "react";
import type { Settings } from "../lib/types";
import { useTheme, ThemeMode } from "../contexts/ThemeContext";
import {
  Cog6ToothIcon,
  XMarkIcon,
  BanknotesIcon,
  TrashIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onResetBalance: (newBalance: number) => void;
  onClearHistory: () => void;
}

// Theme option component for the settings modal
const ThemeOption = ({ mode, icon, label }: { mode: ThemeMode, icon: React.ReactNode, label: string }) => {
  const { themeMode, setThemeMode } = useTheme();
  const isSelected = themeMode === mode;
  
  return (
    <button 
      onClick={() => setThemeMode(mode)}
      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${isSelected 
        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500 dark:ring-blue-400' 
        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    >
      <div className={`text-gray-700 dark:text-gray-300 ${isSelected ? 'text-blue-600 dark:text-blue-400' : ''}`}>
        {icon}
      </div>
      <span className={`mt-1 text-xs font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {label}
      </span>
    </button>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetBalance,
  onClearHistory,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 200);
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    if (localSettings.initialBalance !== settings.initialBalance) {
      onResetBalance(localSettings.initialBalance);
    }
    handleClose();
  };

  const handleClearHistoryConfirm = () => {
    if (
      confirm(
        "Are you sure you want to clear all trade history? This cannot be undone."
      )
    ) {
      onClearHistory();
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full flex flex-col transform transition-all duration-200 ease-out ${
          isAnimatingOut ? "animate-modal-out" : "animate-modal-in"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Settings</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
              <BanknotesIcon className="h-5 w-5 mr-2 text-gray-400 inline" />
              Initial Balance
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="text" 
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                value={localSettings.initialBalance > 0 ? localSettings.initialBalance : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = value === '' ? 0 : parseFloat(value);
                  setLocalSettings({
                    ...localSettings,
                    initialBalance: isNaN(numValue) ? 0 : numValue,
                  });
                }}
                className="w-full pl-7 pr-10 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition-colors"
              />
              {localSettings.initialBalance > 0 && (
                <button
                  onClick={() => setLocalSettings({
                    ...localSettings,
                    initialBalance: 0,
                  })}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear balance"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <SunIcon className="h-5 w-5 mr-2 text-amber-500 inline" />
              Theme Options
            </label>
            <div className="grid grid-cols-3 gap-3">
              <ThemeOption mode="light" icon={<SunIcon className="h-5 w-5" />} label="Light" />
              <ThemeOption mode="dark" icon={<MoonIcon className="h-5 w-5" />} label="Dark" />
              <ThemeOption mode="system" icon={<ComputerDesktopIcon className="h-5 w-5" />} label="System" />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <TrashIcon className="h-5 w-5 mr-2 text-red-500" />
              Danger Zone
            </h3>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-red-800 dark:text-red-300 flex-1">
                This will permanently delete all trade history.
              </p>
              <button
                onClick={handleClearHistoryConfirm}
                className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex-shrink-0"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-in {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes modal-out {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out forwards;
        }
        .animate-modal-out {
          animation: modal-out 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
