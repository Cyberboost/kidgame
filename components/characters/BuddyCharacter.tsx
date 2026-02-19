'use client';

import { CSSProperties } from 'react';

interface BuddyCharacterProps {
  pose?: 'running' | 'standing' | 'rescued';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
  showButterflies?: boolean;
}

const SIZE_MAP = {
  small: { width: 40, height: 55 },
  medium: { width: 80, height: 110 },
  large: { width: 130, height: 180 },
};

export default function BuddyCharacter({
  pose = 'standing',
  size = 'medium',
  animated = false,
  className = '',
  showButterflies = false,
}: BuddyCharacterProps) {
  const { width, height } = SIZE_MAP[size];
  
  const containerStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    display: 'inline-block',
    animation: animated && pose === 'running' ? 'buddyRun 0.5s ease-in-out infinite' : undefined,
  };

  // Render different SVG based on pose
  const renderPose = () => {
    switch (pose) {
      case 'running':
        return renderRunningPose();
      case 'rescued':
        return renderRescuedPose();
      default:
        return renderStandingPose();
    }
  };

  const renderStandingPose = () => (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="130" rx="25" ry="8" fill="#d0d0d0" opacity="0.4" />
      
      {/* Body */}
      <ellipse cx="50" cy="80" rx="22" ry="28" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Belly - lighter */}
      <ellipse cx="50" cy="85" rx="15" ry="20" fill="#E8C99A" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Orange shirt */}
      <path d="M 35 70 Q 28 75 28 85 L 72 85 Q 72 75 65 70 Z" fill="#F7941D" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Green shorts */}
      <path d="M 32 85 L 32 100 Q 32 105 37 105 L 45 105 L 45 85 Z" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 55 85 L 55 105 L 63 105 Q 68 105 68 100 L 68 85 Z" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Green backpack */}
      <ellipse cx="65" cy="75" rx="10" ry="15" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      <rect x="60" y="68" width="10" height="3" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Arms */}
      <ellipse cx="30" cy="75" rx="8" ry="18" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="70" cy="75" rx="8" ry="18" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Head */}
      <circle cx="50" cy="45" r="20" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Muzzle */}
      <ellipse cx="50" cy="52" rx="12" ry="10" fill="#E8C99A" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Nose */}
      <ellipse cx="50" cy="50" rx="3" ry="2.5" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Eyes */}
      <circle cx="43" cy="42" r="5" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="57" cy="42" r="5" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="44" cy="41" r="2" fill="#FFFFFF" />
      <circle cx="58" cy="41" r="2" fill="#FFFFFF" />
      
      {/* Smile */}
      <path d="M 44 56 Q 50 59 56 56" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Cheek blush */}
      <circle cx="38" cy="48" r="4" fill="#FFB5B5" opacity="0.3" />
      <circle cx="62" cy="48" r="4" fill="#FFB5B5" opacity="0.3" />
      
      {/* Ears */}
      <ellipse cx="35" cy="30" rx="7" ry="16" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="65" cy="30" rx="7" ry="16" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="35" cy="30" rx="3" ry="9" fill="#E8C99A" />
      <ellipse cx="65" cy="30" rx="3" ry="9" fill="#E8C99A" />
      
      {/* Blue cap */}
      <ellipse cx="50" cy="28" rx="22" ry="10" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 30 28 Q 30 20 50 18 Q 70 20 70 28" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Cap brim - green */}
      <ellipse cx="50" cy="28" rx="24" ry="6" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );

  const renderRunningPose = () => (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Butterflies */}
      {showButterflies && (
        <>
          <g style={{ animation: 'butterflyFlutter 0.6s ease-in-out infinite' }}>
            {/* Yellow-orange butterfly */}
            <ellipse cx="95" cy="35" rx="6" ry="10" fill="#FFC107" stroke="#1a1a1a" strokeWidth="1.5" />
            <ellipse cx="105" cy="35" rx="6" ry="10" fill="#FF6F00" stroke="#1a1a1a" strokeWidth="1.5" />
            <line x1="100" y1="25" x2="100" y2="45" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
          <g style={{ animation: 'butterflyFlutter 0.6s ease-in-out infinite 0.3s' }}>
            {/* Blue butterfly */}
            <ellipse cx="15" cy="45" rx="5" ry="9" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="1.5" />
            <ellipse cx="24" cy="45" rx="5" ry="9" fill="#0D47A1" stroke="#1a1a1a" strokeWidth="1.5" />
            <line x1="19" y1="36" x2="19" y2="54" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
        </>
      )}
      
      {/* Shadow */}
      <ellipse cx="55" cy="130" rx="25" ry="8" fill="#d0d0d0" opacity="0.4" />
      
      {/* Body - leaning forward */}
      <ellipse cx="55" cy="75" rx="22" ry="28" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(15 55 75)" />
      
      {/* Belly - lighter */}
      <ellipse cx="55" cy="80" rx="15" ry="20" fill="#E8C99A" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Orange shirt */}
      <path d="M 40 65 Q 33 70 33 80 L 77 80 Q 77 70 70 65 Z" fill="#F7941D" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Green shorts */}
      <path d="M 37 80 L 37 95 Q 37 100 42 100 L 50 100 L 50 80 Z" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 60 80 L 60 100 L 68 100 Q 73 100 73 95 L 73 80 Z" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Green backpack */}
      <ellipse cx="70" cy="70" rx="10" ry="15" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      <rect x="65" y="63" width="10" height="3" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Left arm - holding net */}
      <ellipse cx="35" cy="70" rx="8" ry="18" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-30 35 70)" />
      
      {/* Net handle - blue */}
      <line x1="30" y1="60" x2="10" y2="30" stroke="#29ABE2" strokeWidth="4" strokeLinecap="round" />
      
      {/* Net mesh */}
      <path d="M 5 25 Q 2 20 5 15 Q 10 10 15 13 Q 18 15 15 20 Q 12 25 8 28 Z" fill="#FFFFFF" fillOpacity="0.6" stroke="#29ABE2" strokeWidth="2" />
      
      {/* Right arm - swinging back */}
      <ellipse cx="75" cy="70" rx="8" ry="18" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(30 75 70)" />
      
      {/* Legs - running pose */}
      {/* Left leg - up */}
      <ellipse cx="45" cy="108" rx="7" ry="16" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-20 45 108)" />
      
      {/* Right leg - back */}
      <ellipse cx="62" cy="115" rx="7" ry="18" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(10 62 115)" />
      
      {/* Head */}
      <circle cx="55" cy="45" r="20" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Muzzle */}
      <ellipse cx="55" cy="52" rx="12" ry="10" fill="#E8C99A" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Nose */}
      <ellipse cx="55" cy="50" rx="3" ry="2.5" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Eyes - excited */}
      <circle cx="48" cy="42" r="5" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="62" cy="42" r="5" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="49" cy="41" r="2" fill="#FFFFFF" />
      <circle cx="63" cy="41" r="2" fill="#FFFFFF" />
      
      {/* Open mouth smile */}
      <path d="M 49 56 Q 55 60 61 56" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="55" cy="58" rx="4" ry="3" fill="#FF69B4" />
      
      {/* Cheek blush */}
      <circle cx="43" cy="48" r="4" fill="#FFB5B5" opacity="0.3" />
      <circle cx="67" cy="48" r="4" fill="#FFB5B5" opacity="0.3" />
      
      {/* Ears */}
      <ellipse cx="40" cy="30" rx="7" ry="16" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="70" cy="30" rx="7" ry="16" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="40" cy="30" rx="3" ry="9" fill="#E8C99A" />
      <ellipse cx="70" cy="30" rx="3" ry="9" fill="#E8C99A" />
      
      {/* Blue cap - backwards */}
      <ellipse cx="55" cy="28" rx="22" ry="10" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 35 28 Q 35 20 55 18 Q 75 20 75 28" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Cap brim - green (backwards) */}
      <rect x="53" y="25" width="18" height="4" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );

  const renderRescuedPose = () => (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="130" rx="25" ry="8" fill="#d0d0d0" opacity="0.4" />
      
      {/* Body - jumping */}
      <ellipse cx="50" cy="75" rx="22" ry="28" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Belly - lighter */}
      <ellipse cx="50" cy="80" rx="15" ry="20" fill="#E8C99A" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Orange shirt */}
      <path d="M 35 65 Q 28 70 28 80 L 72 80 Q 72 70 65 65 Z" fill="#F7941D" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Green shorts */}
      <path d="M 32 80 L 32 95 Q 32 100 37 100 L 45 100 L 45 80 Z" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 55 80 L 55 100 L 63 100 Q 68 100 68 95 L 68 80 Z" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Green backpack */}
      <ellipse cx="65" cy="70" rx="10" ry="15" fill="#388E3C" stroke="#1a1a1a" strokeWidth="2.5" />
      <rect x="60" y="63" width="10" height="3" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Arms - raised in joy */}
      <ellipse cx="30" cy="55" rx="8" ry="18" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-45 30 55)" />
      <ellipse cx="70" cy="55" rx="8" ry="18" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(45 70 55)" />
      
      {/* Head */}
      <circle cx="50" cy="40" r="20" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Muzzle */}
      <ellipse cx="50" cy="47" rx="12" ry="10" fill="#E8C99A" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Nose */}
      <ellipse cx="50" cy="45" rx="3" ry="2.5" fill="#8B4513" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Eyes - happy closed */}
      <path d="M 38 37 Q 43 39 48 37" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 52 37 Q 57 39 62 37" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Big smile */}
      <path d="M 42 51 Q 50 55 58 51" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Cheek blush */}
      <circle cx="38" cy="43" r="4" fill="#FFB5B5" opacity="0.3" />
      <circle cx="62" cy="43" r="4" fill="#FFB5B5" opacity="0.3" />
      
      {/* Ears */}
      <ellipse cx="35" cy="23" rx="7" ry="16" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="65" cy="23" rx="7" ry="16" fill="#C4956A" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="35" cy="23" rx="3" ry="9" fill="#E8C99A" />
      <ellipse cx="65" cy="23" rx="3" ry="9" fill="#E8C99A" />
      
      {/* Blue cap */}
      <ellipse cx="50" cy="23" rx="22" ry="10" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 30 23 Q 30 15 50 13 Q 70 15 70 23" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Cap brim - green */}
      <ellipse cx="50" cy="23" rx="24" ry="6" fill="#2E7D32" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );

  return (
    <div className={className} style={containerStyle}>
      {renderPose()}
    </div>
  );
}
