import React from "react";

interface LeverageSelectorProps {
  selectedLeverage: number;
  onLeverageChange: (leverage: number) => void;
}

export const LeverageSelector: React.FC<LeverageSelectorProps> = ({
  selectedLeverage,
  onLeverageChange,
}) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLeverage = parseInt(event.target.value, 10);
    onLeverageChange(newLeverage);
  };

  return (
    // DÜZELTME BURADA: Swiper'ın bu bileşendeki kaydırma olaylarını
    // görmezden gelmesi için `swiper-no-swiping` sınıfı eklendi.
    <div className="py-2 swiper-no-swiping">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold text-gray-700">Leverage</h3>
        <span className="px-3 py-1 text-sm font-bold text-white bg-blue-600 rounded-full">
          {selectedLeverage}x
        </span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={selectedLeverage}
          onChange={handleSliderChange}
          // Bir önceki adımdaki `touch-pan-y` sınıfı, tarayıcının sayfa
          // kaydırmasını engellemek için hala gereklidir.
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-pan-y"
        />
      </div>
    </div>
  );
};