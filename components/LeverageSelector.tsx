import React from 'react';

interface LeverageSelectorProps {
  selectedLeverage: number;
  onLeverageChange: (leverage: number) => void;
}

export const LeverageSelector: React.FC<LeverageSelectorProps> = ({
  selectedLeverage,
  onLeverageChange,
}) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Slider'dan gelen değeri doğrudan sayıya çevirip state'i güncelliyoruz.
    const newLeverage = parseInt(event.target.value, 10);
    onLeverageChange(newLeverage);
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Leverage</h3>
        {/* Seçili kaldıraç değerini gösteren etiket */}
        <span className="px-3 py-1 text-sm font-bold text-white bg-blue-600 rounded-full">
          {selectedLeverage}x
        </span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="1"      // Minimum kaldıraç değeri
          max="100"    // Maksimum kaldıraç değeri
          step="1"     // Artış adımı
          value={selectedLeverage} // Değer doğrudan state'ten geliyor
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
};