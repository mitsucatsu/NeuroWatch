import React, { useState, useEffect, forwardRef } from "react";

interface SliderProps {
  onValueChange?: (value: number) => void;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ onValueChange }, ref) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [selectedDateTime, setSelectedDateTime] = useState("");

    useEffect(() => {
      const date = new Date(sliderValue);
      const formattedTime = date.toISOString().substr(11, 12);
      setSelectedDateTime(formattedTime);
    }, [sliderValue]);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value, 10);
      setSliderValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div className="w-full bg-gray-700 text-white p-4">
        <h3 className="text-lg font-semibold mb-2">Select Date and Time</h3>
        <input
          type="range"
          id="datetime-slider"
          min="0"
          max="86400000"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full"
          ref={ref}
        />
        <div id="selected-datetime" className="mt-2">
          {selectedDateTime}
        </div>
      </div>
    );
  }
);

export default Slider;
