'use client';

import { useEffect, useState } from 'react';

interface BunnyRunnerProps {
  trigger: number; // Increment this to trigger a new bunny
}

interface Bunny {
  id: number;
  delay: number;
  duration: number;
  verticalOffset: number;
}

export default function BunnyRunner({ trigger }: BunnyRunnerProps) {
  const [bunnies, setBunnies] = useState<Bunny[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      // Add a new bunny with random properties
      const newBunny: Bunny = {
        id: Date.now() + Math.random(),
        delay: Math.random() * 200, // 0-200ms delay
        duration: 2 + Math.random() * 1, // 2-3 seconds
        verticalOffset: Math.random() * 60 - 30, // -30 to +30 vh
      };
      
      setBunnies(prev => [...prev, newBunny]);
      
      // Remove bunny after animation completes
      setTimeout(() => {
        setBunnies(prev => prev.filter(b => b.id !== newBunny.id));
      }, (newBunny.duration + newBunny.delay / 1000) * 1000);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {bunnies.map(bunny => (
        <div
          key={bunny.id}
          className="absolute left-0 text-6xl"
          style={{
            top: `calc(50% + ${bunny.verticalOffset}vh)`,
            animation: `bunnyRun ${bunny.duration}s ease-in-out ${bunny.delay}ms forwards`,
          }}
        >
          🐰
        </div>
      ))}
    </div>
  );
}
