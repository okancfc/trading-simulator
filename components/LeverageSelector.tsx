import React from 'react';

interface LeverageSelectorProps {
  selectedLeverage: number;
  onLeverageChange: (leverage: number) => void;
}

const leverageOptions = [1, 2, 5, 10, 20, 50, 100];

export const LeverageSelector: React.FC<LeverageSelectorProps> = ({
  selectedLeverage,
  onLeverageChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Leverage</h3>
      <div className="flex flex-wrap gap-2">
        {leverageOptions.map((leverage) => (
          <button
            key={leverage}
            onClick={() => onLeverageChange(leverage)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedLeverage === leverage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {leverage}x
          </button>
        ))}
      </div>
    </div>
  );
};
