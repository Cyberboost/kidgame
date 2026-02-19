'use client';

import React from 'react';

interface MapBackgroundProps {
  currentZone: 'meadow' | 'forest' | 'clouds' | 'rainbow';
}

export default function MapBackground({ currentZone }: MapBackgroundProps) {
  const clouds = Array.from({ length: 5 }, (_, i) => i);
  const stars = Array.from({ length: 15 }, (_, i) => i);
  const flowers = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Sky gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        currentZone === 'clouds' || currentZone === 'rainbow'
          ? 'from-sky-300 via-sky-200 to-purple-200'
          : 'from-sky-400 via-sky-300 to-sky-200'
      }`} />

      {/* Twinkling stars */}
      {stars.map((i) => (
        <div
          key={`star-${i}`}
          className="absolute text-yellow-300 text-xs"
          style={{
            top: `${Math.random() * 30}%`,
            left: `${Math.random() * 100}%`,
            animation: `star-twinkle ${2 + Math.random() * 3}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          ⭐
        </div>
      ))}

      {/* Drifting clouds */}
      {clouds.map((i) => (
        <div
          key={`cloud-${i}`}
          className="absolute text-6xl opacity-80"
          style={{
            top: `${10 + i * 15}%`,
            animation: `cloud-drift ${30 + i * 10}s linear infinite`,
            animationDelay: `${-i * 5}s`,
          }}
        >
          ☁️
        </div>
      ))}

      {/* Hills - midground */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-grass-400 to-grass-300 rounded-t-[50%] opacity-80" style={{ transform: 'translateY(20%)' }} />
      <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-grass-500 to-grass-400 rounded-t-[60%] opacity-90" style={{ transform: 'translateY(30%)' }} />

      {/* Rainbow arc for rainbow zone */}
      {currentZone === 'rainbow' && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-48">
          <div className="w-full h-full rounded-t-full border-8 border-t-red-400 border-l-red-400 border-r-red-400 border-b-transparent opacity-60" style={{ transform: 'scale(1.2)' }}></div>
          <div className="absolute top-2 left-2 right-2 w-full h-full rounded-t-full border-8 border-t-orange-400 border-l-orange-400 border-r-orange-400 border-b-transparent opacity-60" style={{ transform: 'scale(1.1)' }}></div>
          <div className="absolute top-4 left-4 right-4 w-full h-full rounded-t-full border-8 border-t-yellow-400 border-l-yellow-400 border-r-yellow-400 border-b-transparent opacity-60" style={{ transform: 'scale(1.0)' }}></div>
          <div className="absolute top-6 left-6 right-6 w-full h-full rounded-t-full border-8 border-t-green-400 border-l-green-400 border-r-green-400 border-b-transparent opacity-60" style={{ transform: 'scale(0.9)' }}></div>
          <div className="absolute top-8 left-8 right-8 w-full h-full rounded-t-full border-8 border-t-blue-400 border-l-blue-400 border-r-blue-400 border-b-transparent opacity-60" style={{ transform: 'scale(0.8)' }}></div>
          <div className="absolute top-10 left-10 right-10 w-full h-full rounded-t-full border-8 border-t-purple-400 border-l-purple-400 border-r-purple-400 border-b-transparent opacity-60" style={{ transform: 'scale(0.7)' }}></div>
        </div>
      )}

      {/* Foreground decorative flowers */}
      {flowers.map((i) => {
        const flowerEmojis = ['🌸', '🌼', '🌺', '🌻'];
        return (
          <div
            key={`flower-${i}`}
            className="absolute text-2xl"
            style={{
              bottom: `${5 + Math.random() * 20}%`,
              left: `${i * 10}%`,
              animation: `gentle-sway ${3 + Math.random() * 2}s infinite ease-in-out`,
              animationDelay: `${Math.random()}s`,
            }}
          >
            {flowerEmojis[i % flowerEmojis.length]}
          </div>
        );
      })}

      {/* Floating particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute text-xl opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `float-particle ${10 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {['🍃', '🌸', '✨'][i % 3]}
        </div>
      ))}

      {/* Zone-specific decorations */}
      {currentZone === 'forest' && (
        <>
          <div className="absolute bottom-24 left-10 text-6xl">🌳</div>
          <div className="absolute bottom-20 right-20 text-5xl">🌲</div>
          <div className="absolute bottom-16 left-1/3 text-4xl">🍄</div>
        </>
      )}

      {currentZone === 'clouds' && (
        <>
          <div className="absolute top-1/3 left-1/4 text-4xl opacity-60">☁️</div>
          <div className="absolute top-1/2 right-1/4 text-5xl opacity-60">☁️</div>
        </>
      )}

      {/* Bees flying around */}
      {currentZone === 'meadow' && (
        <>
          <div
            className="absolute text-2xl"
            style={{
              top: '30%',
              left: '20%',
              animation: 'bee-fly 8s infinite ease-in-out',
            }}
          >
            🐝
          </div>
          <div
            className="absolute text-2xl"
            style={{
              top: '50%',
              left: '60%',
              animation: 'bee-fly 10s infinite ease-in-out',
              animationDelay: '3s',
            }}
          >
            🐝
          </div>
        </>
      )}
    </div>
  );
}
