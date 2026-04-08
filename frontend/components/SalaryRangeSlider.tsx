"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SalaryRangeSliderProps {
  min: number;
  max: number;
  minLimit?: number;
  maxLimit?: number;
  onChange: (values: { min: number; max: number }) => void;
}

const SalaryRangeSlider = ({
  min,
  max,
  minLimit = 0,
  maxLimit = 500,
  onChange,
}: SalaryRangeSliderProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) =>
      Math.round(((value - minLimit) / (maxLimit - minLimit)) * 100),
    [minLimit, maxLimit],
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Update internal state when props change (e.g. on reset)
  useEffect(() => {
    if (min !== minValRef.current) {
      setMinVal(min);
      minValRef.current = min;
    }
    if (max !== maxValRef.current) {
      setMaxVal(max);
      maxValRef.current = max;
    }
  }, [min, max]);

  const handleMinChange = (value: number) => {
    const newVal = Math.min(value, maxVal - 1);
    setMinVal(newVal);
    minValRef.current = newVal;
    onChange({ min: newVal, max: maxVal });
  };

  const handleMaxChange = (value: number) => {
    const newVal = Math.max(value, minVal + 1);
    setMaxVal(newVal);
    maxValRef.current = newVal;
    onChange({ min: minVal, max: newVal });
  };

  return (
    <div className="flex flex-col gap-6 w-full py-4">
      <div className="relative w-full flex items-center h-4">
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minVal}
          onChange={(event) => handleMinChange(Number(event.target.value))}
          className={cn("thumb thumb--left", minVal > maxLimit - 100 && "z-30")}
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxVal}
          onChange={(event) => handleMaxChange(Number(event.target.value))}
          className="thumb thumb--right"
        />

        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
        <div className="flex flex-col px-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Min Salary
          </span>
          <span className="text-sm font-bold text-gray-900">${minVal}k</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex flex-col px-3 text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Max Salary
          </span>
          <span className="text-sm font-bold text-gray-900">${maxVal}k</span>
        </div>
      </div>

      <style jsx>{`
        .thumb,
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }

        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          z-index: 20;
          background: none;
        }

        .thumb--left {
          z-index: 30;
        }

        .thumb--right {
          z-index: 20;
        }

        /* Webkit */
        .thumb::-webkit-slider-thumb {
          background-color: #2563eb;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
          cursor: pointer;
          height: 20px;
          width: 20px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .thumb:active::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
        }

        /* Firefox */
        .thumb::-moz-range-thumb {
          background-color: #2563eb;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
          cursor: pointer;
          height: 20px;
          width: 20px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .slider {
          position: relative;
          width: 100%;
        }

        .slider__track,
        .slider__range {
          border-radius: 3px;
          height: 6px;
          position: absolute;
        }

        .slider__track {
          background-color: #f1f5f9;
          width: 100%;
          z-index: 10;
        }

        .slider__range {
          background-image: linear-gradient(to right, #3b82f6, #8b5cf6);
          z-index: 11;
        }
      `}</style>
    </div>
  );
};

export default SalaryRangeSlider;
