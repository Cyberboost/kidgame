'use client';

import React, { useEffect, useState } from 'react';

interface PatternSuccessAnimationProps {
  show: boolean;
  message: string;
  onComplete?: () => void;
  isError?: boolean;
}

export function PatternSuccessAnimation({
  show,
  message,
  onComplete,
  isError = false,
}: PatternSuccessAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 animate-bounce-in">
        <div className="text-center">
          {!isError ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {message}
              </div>
              <div className="text-gray-600">Keep going!</div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">😊</div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {message}
              </div>
              <div className="text-gray-600">Try again!</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
