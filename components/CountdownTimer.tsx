'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  timeRemaining: number; // seconds
  totalTime: number; // seconds
  onTimeUp: () => void;
}

export default function CountdownTimer({ timeRemaining, totalTime, onTimeUp }: CountdownTimerProps) {
  const percentage = (timeRemaining / totalTime) * 100;
  const isUrgent = timeRemaining <= 5;
  const isCritical = timeRemaining <= 3;

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Time Remaining:</span>
        <span 
          className={`text-2xl font-bold transition-colors duration-200 ${
            isCritical ? 'text-red-600 animate-pulse' : 
            isUrgent ? 'text-orange-500' : 
            'text-green-600'
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {timeRemaining}s
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            isCritical ? 'bg-red-500' :
            isUrgent ? 'bg-orange-400' :
            'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={timeRemaining}
          aria-valuemin={0}
          aria-valuemax={totalTime}
        />
      </div>
      
      {isUrgent && (
        <p className="text-center text-xs mt-2 font-semibold text-orange-600 animate-pulse">
          Hurry! ⏰
        </p>
      )}
    </div>
  );
}
