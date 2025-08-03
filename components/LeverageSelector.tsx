import React, { useState, useRef, useEffect } from "react";

interface LeverageSelectorProps {
  selectedLeverage: number;
  onLeverageChange: (leverage: number) => void;
}

export const LeverageSelector: React.FC<LeverageSelectorProps> = ({
  selectedLeverage,
  onLeverageChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(selectedLeverage.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when selectedLeverage changes externally
  useEffect(() => {
    if (!isEditing) {
      setInputValue(selectedLeverage.toString());
    }
  }, [selectedLeverage, isEditing]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLeverage = parseInt(event.target.value, 10);
    
    onLeverageChange(newLeverage);
    setInputValue(newLeverage.toString());

    if (newLeverage !== selectedLeverage && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputBlur = () => {
    let newValue = parseInt(inputValue, 10);
    
    // Validate the input
    if (isNaN(newValue)) {
      newValue = selectedLeverage;
    } else if (newValue < 1) {
      newValue = 1;
    } else if (newValue > 100) {
      newValue = 100;
    }
    
    // Update the input field with the sanitized value
    setInputValue(newValue.toString());
    onLeverageChange(newValue);
    setIsEditing(false);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      inputRef.current?.blur();
    } else if (event.key === "Escape") {
      setInputValue(selectedLeverage.toString());
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };
  
  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  return (
    <div className="py-2 swiper-no-swiping">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Leverage</h3>
        {isEditing ? (
          <div className="px-2 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="w-12 py-1 text-sm font-bold text-white bg-transparent border-none focus:outline-none text-center"
              aria-label="Enter leverage value"
            />
            <span className="text-sm font-bold text-white">x</span>
          </div>
        ) : (
          <button 
            onClick={startEditing}
            className="px-3 py-1 text-sm font-bold text-white bg-blue-600 dark:bg-blue-700 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            aria-label="Click to edit leverage"
          >
            {selectedLeverage}x
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={selectedLeverage}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500 touch-pan-y"
        />
      </div>
    </div>
  );
};
