'use client';

import { useEffect, useState } from 'react';
import { BuddyCharacter } from '@/components/characters';

interface BunnyInstance {
  id: number;
  top: number;
  animationDuration: number;
}

interface BunnyRunnerProps {
  active?: boolean;
}

export default function BunnyRunner({ active = false }: BunnyRunnerProps) {
  const [bunnies, setBunnies] = useState<BunnyInstance[]>([]);

  useEffect(() => {
    if (!active) {
      setBunnies([]);
      return;
    }

    // Create a new bunny
    const newBunny: BunnyInstance = {
      id: Date.now(),
      top: Math.random() * 60 + 20, // Random position between 20% and 80%
      animationDuration: Math.random() * 2 + 2.5, // Random duration between 2.5s and 4.5s
    };

    setBunnies((prev) => [...prev, newBunny]);

    // Remove bunny after animation completes
    const timeout = setTimeout(() => {
      setBunnies((prev) => prev.filter((b) => b.id !== newBunny.id));
    }, newBunny.animationDuration * 1000);

    return () => clearTimeout(timeout);
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {bunnies.map((bunny) => (
        <div
          key={bunny.id}
          className="absolute"
          style={{
            top: `${bunny.top}%`,
            left: '-150px',
            animation: `buddyRescueRun ${bunny.animationDuration}s linear forwards`,
          }}
        >
          <BuddyCharacter
            pose="running"
            size="small"
            animated
            showButterflies
          />
        </div>
      ))}
    </div>
  );
}
