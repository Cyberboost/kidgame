'use client';

interface LivyCharacterProps {
  size?: 'small' | 'medium' | 'large' | 'hero';
  animated?: boolean;
  className?: string;
}

export default function LivyCharacter({
  size = 'medium',
  animated = false,
  className = '',
}: LivyCharacterProps) {
  // Size mapping
  const sizeMap = {
    small: { width: 40, height: 56 },
    medium: { width: 80, height: 112 },
    large: { width: 120, height: 168 },
    hero: { width: 160, height: 224 },
  };

  const dimensions = sizeMap[size];

  return (
    <div
      className={`inline-block ${animated ? 'animate-livy-bob' : ''} ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <svg
        viewBox="0 0 80 112"
        width={dimensions.width}
        height={dimensions.height}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Drop shadow */}
        <defs>
          <filter id={`shadow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow ellipse beneath feet */}
        <ellipse
          cx="40"
          cy="108"
          rx="20"
          ry="4"
          fill="rgba(0,0,0,0.2)"
        />

        {/* Dress - Dark gray/black */}
        <path
          d="M 30 58 Q 28 65 28 72 L 28 90 Q 28 95 33 95 L 47 95 Q 52 95 52 90 L 52 72 Q 52 65 50 58 Z"
          fill="#2D2D2D"
          stroke="#000"
          strokeWidth="2"
        />

        {/* White dress trim at bottom */}
        <rect x="28" y="90" width="24" height="4" rx="2" fill="#FFF" />

        {/* Body - Light gray fur */}
        <ellipse
          cx="40"
          cy="50"
          rx="18"
          ry="22"
          fill="#E8E8E8"
          stroke="#000"
          strokeWidth="2"
        />

        {/* Belly - Lighter area */}
        <ellipse
          cx="40"
          cy="55"
          rx="12"
          ry="15"
          fill="#F5F5F5"
          stroke="none"
        />

        {/* Head - Gray circle */}
        <circle
          cx="40"
          cy="28"
          r="16"
          fill="#E8E8E8"
          stroke="#000"
          strokeWidth="2"
        />

        {/* White muzzle area */}
        <ellipse
          cx="40"
          cy="32"
          rx="10"
          ry="8"
          fill="#FFF"
          stroke="none"
        />

        {/* Left ear (with blue bow) */}
        <ellipse
          cx="32"
          cy="15"
          rx="5"
          ry="12"
          fill="#E8E8E8"
          stroke="#000"
          strokeWidth="2"
        />
        <ellipse
          cx="32"
          cy="15"
          rx="3"
          ry="8"
          fill="#FFB6C1"
          stroke="none"
        />

        {/* Right ear */}
        <ellipse
          cx="48"
          cy="15"
          rx="5"
          ry="12"
          fill="#E8E8E8"
          stroke="#000"
          strokeWidth="2"
        />
        <ellipse
          cx="48"
          cy="15"
          rx="3"
          ry="8"
          fill="#FFB6C1"
          stroke="none"
        />

        {/* Blue bow on left ear */}
        <g transform="translate(32, 10)">
          <path d="M -6 0 Q -8 2 -6 4 L -2 2 Z" fill="#29ABE2" stroke="#000" strokeWidth="1" />
          <path d="M 6 0 Q 8 2 6 4 L 2 2 Z" fill="#29ABE2" stroke="#000" strokeWidth="1" />
          <circle cx="0" cy="2" r="1.5" fill="#29ABE2" stroke="#000" strokeWidth="1" />
        </g>

        {/* Eyes - Big blue eyes */}
        <g>
          {/* Left eye */}
          <ellipse cx="35" cy="26" rx="4" ry="5" fill="#FFF" stroke="#000" strokeWidth="1.5" />
          <ellipse cx="35" cy="27" rx="3" ry="4" fill="#2196F3" />
          <circle cx="35" cy="26" r="2" fill="#000" />
          <circle cx="36" cy="25" r="1" fill="#FFF" /> {/* Sparkle */}
          
          {/* Right eye */}
          <ellipse cx="45" cy="26" rx="4" ry="5" fill="#FFF" stroke="#000" strokeWidth="1.5" />
          <ellipse cx="45" cy="27" rx="3" ry="4" fill="#2196F3" />
          <circle cx="45" cy="26" r="2" fill="#000" />
          <circle cx="46" cy="25" r="1" fill="#FFF" /> {/* Sparkle */}
        </g>

        {/* Pink nose - small heart shape */}
        <path
          d="M 40 33 Q 38 31 37 32 Q 36 33 37 34 L 40 36 L 43 34 Q 44 33 43 32 Q 42 31 40 33 Z"
          fill="#FF9BAA"
          stroke="none"
        />

        {/* Pink cheeks */}
        <circle cx="30" cy="30" r="3" fill="#FFB6C1" opacity="0.6" />
        <circle cx="50" cy="30" r="3" fill="#FFB6C1" opacity="0.6" />

        {/* Blue bow tie at neck */}
        <g transform="translate(40, 42)">
          <path d="M -8 0 Q -10 2 -8 4 L -3 2 Z" fill="#29ABE2" stroke="#000" strokeWidth="1" />
          <path d="M 8 0 Q 10 2 8 4 L 3 2 Z" fill="#29ABE2" stroke="#000" strokeWidth="1" />
          <rect x="-2" y="1" width="4" height="2" rx="1" fill="#29ABE2" stroke="#000" strokeWidth="1" />
        </g>

        {/* White collar on dress */}
        <ellipse
          cx="40"
          cy="44"
          rx="10"
          ry="3"
          fill="#FFF"
          stroke="none"
        />

        {/* Arms */}
        <ellipse
          cx="26"
          cy="60"
          rx="4"
          ry="10"
          fill="#E8E8E8"
          stroke="#000"
          strokeWidth="2"
        />
        <ellipse
          cx="54"
          cy="60"
          rx="4"
          ry="10"
          fill="#E8E8E8"
          stroke="#000"
          strokeWidth="2"
        />

        {/* Carrot in right hand */}
        <g transform="translate(60, 65)">
          {/* Carrot body */}
          <path
            d="M 0 0 Q -2 8 -3 12 Q -3 15 0 16 Q 3 15 3 12 Q 2 8 0 0 Z"
            fill="#FF6B35"
            stroke="#000"
            strokeWidth="1.5"
          />
          {/* Carrot leaves */}
          <path d="M 0 0 L -2 -4 L -1 0 Z" fill="#4CAF50" stroke="#000" strokeWidth="1" />
          <path d="M 0 0 L 0 -5 L 1 0 Z" fill="#4CAF50" stroke="#000" strokeWidth="1" />
          <path d="M 0 0 L 2 -4 L 1 0 Z" fill="#4CAF50" stroke="#000" strokeWidth="1" />
        </g>

        {/* Feet */}
        <ellipse
          cx="35"
          cy="100"
          rx="6"
          ry="4"
          fill="#E8E8E8"
          stroke="#000"
          strokeWidth="2"
        />
        <ellipse
          cx="45"
          cy="100"
          rx="6"
          ry="4"
          fill="#E8E8E8"
          stroke="#000"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
