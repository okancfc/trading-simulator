import React, { useState, useEffect } from "react";
import type { Settings } from "../lib/types";
import {
  Cog6ToothIcon,
  XMarkIcon,
  BanknotesIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onResetBalance: (newBalance: number) => void;
  onClearHistory: () => void;
}

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
        className={`bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-200 ease-out ${
          isAnimatingOut ? "animate-modal-out" : "animate-modal-in"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="h-6 w-6 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <BanknotesIcon className="h-5 w-5 mr-2 text-gray-400" />
              Initial Balance
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                value={localSettings.initialBalance}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    initialBalance: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full pl-7 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <TrashIcon className="h-5 w-5 mr-2 text-red-500" />
              Danger Zone
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
              <p className="text-sm text-red-800 flex-1 mr-4">
                This will permanently delete all trade history.
              </p>
              <button
                onClick={handleClearHistoryConfirm}
                className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
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
