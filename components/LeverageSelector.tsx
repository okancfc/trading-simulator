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

    // Ana bileşendeki durumu her zaman güncelle
    onLeverageChange(newLeverage);

    // --- YENİ EKLENEN TİTREŞİM MANTIĞI ---

    // Sadece kaldıraç değeri değiştiğinde (her adımda bir kez) titreşim gönder
    // ve tarayıcının bu özelliği desteklediğinden emin ol.
    if (newLeverage !== selectedLeverage && navigator.vibrate) {
      // Çok kısa bir titreşim (10-20 milisaniye) "tırtıklı" hissi için idealdir.
      navigator.vibrate(15);
    }
    // ------------------------------------
  };

  return (
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
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-pan-y"
        />
      </div>
    </div>
  );
};