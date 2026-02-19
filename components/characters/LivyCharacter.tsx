'use client';

import { CSSProperties } from 'react';

interface LivyCharacterProps {
  pose?: 'waving' | 'celebrating' | 'cheering' | 'thinking' | 'standing';
  size?: 'small' | 'medium' | 'large' | 'hero';
  animated?: boolean;
  className?: string;
}

const SIZE_MAP = {
  small: { width: 40, height: 55 },
  medium: { width: 80, height: 110 },
  large: { width: 130, height: 180 },
  hero: { width: 220, height: 300 },
};

export default function LivyCharacter({
  pose = 'standing',
  size = 'medium',
  animated = false,
  className = '',
}: LivyCharacterProps) {
  const { width, height } = SIZE_MAP[size];
  
  const containerStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    display: 'inline-block',
    animation: animated ? 'livyBob 2s ease-in-out infinite' : undefined,
  };

  // Render different SVG based on pose
  const renderPose = () => {
    switch (pose) {
      case 'waving':
        return renderWavingPose();
      case 'celebrating':
        return renderCelebratingPose();
      case 'cheering':
        return renderCheeringPose();
      case 'thinking':
        return renderThinkingPose();
      default:
        return renderStandingPose();
    }
  };

  const renderStandingPose = () => (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="130" rx="25" ry="8" fill="#d0d0d0" opacity="0.4" />
      
      {/* Body */}
      <ellipse cx="50" cy="80" rx="22" ry="28" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Dress */}
      <path d="M 35 70 Q 28 80 28 95 Q 28 105 35 110 L 65 110 Q 72 105 72 95 Q 72 80 65 70 Z" fill="#2D2D2D" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 28 95 Q 28 105 35 110 L 65 110 Q 72 105 72 95" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      
      {/* White buttons */}
      <circle cx="50" cy="80" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="50" cy="90" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Arms */}
      <ellipse cx="30" cy="75" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="70" cy="75" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Head */}
      <circle cx="50" cy="45" r="20" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Muzzle */}
      <ellipse cx="50" cy="52" rx="12" ry="10" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Nose */}
      <ellipse cx="50" cy="50" rx="3" ry="2.5" fill="#E8A0A0" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Eyes */}
      <circle cx="43" cy="42" r="5" fill="#1565C0" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="57" cy="42" r="5" fill="#1565C0" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="44" cy="41" r="2" fill="#FFFFFF" />
      <circle cx="58" cy="41" r="2" fill="#FFFFFF" />
      
      {/* Cheek blush */}
      <circle cx="38" cy="48" r="4" fill="#FFB5B5" opacity="0.4" />
      <circle cx="62" cy="48" r="4" fill="#FFB5B5" opacity="0.4" />
      
      {/* Ears */}
      <ellipse cx="35" cy="28" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="65" cy="28" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="35" cy="28" rx="4" ry="10" fill="#FFB5C0" />
      <ellipse cx="65" cy="28" rx="4" ry="10" fill="#FFB5C0" />
      
      {/* Left ear bow */}
      <path d="M 30 20 Q 25 20 22 18 Q 20 16 22 14 Q 25 12 30 12 Q 32 14 30 16 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 30 20 Q 35 20 38 18 Q 40 16 38 14 Q 35 12 30 12 Q 28 14 30 16 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="30" cy="16" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Bow tie */}
      <path d="M 45 65 Q 42 65 40 63 Q 38 61 40 59 Q 42 57 45 57 Q 47 59 45 61 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 55 65 Q 58 65 60 63 Q 62 61 60 59 Q 58 57 55 57 Q 53 59 55 61 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="50" cy="61" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );

  const renderWavingPose = () => (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="60" cy="130" rx="25" ry="8" fill="#d0d0d0" opacity="0.4" />
      
      {/* Body */}
      <ellipse cx="60" cy="80" rx="22" ry="28" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Dress */}
      <path d="M 45 70 Q 38 80 38 95 Q 38 105 45 110 L 75 110 Q 82 105 82 95 Q 82 80 75 70 Z" fill="#2D2D2D" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 38 95 Q 38 105 45 110 L 75 110 Q 82 105 82 95" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      
      {/* White buttons */}
      <circle cx="60" cy="80" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="60" cy="90" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Left arm - holding carrot */}
      <ellipse cx="40" cy="85" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Carrot */}
      <path d="M 35 95 L 38 105 L 32 105 Z" fill="#FF6B35" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 35 95 L 33 88 L 35 88 L 37 88 L 35 95 Z" fill="#4CAF50" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Right arm - waving */}
      <ellipse cx="85" cy="45" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-45 85 45)" />
      
      {/* Head */}
      <circle cx="60" cy="45" r="20" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Muzzle */}
      <ellipse cx="60" cy="52" rx="12" ry="10" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Nose */}
      <ellipse cx="60" cy="50" rx="3" ry="2.5" fill="#E8A0A0" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Eyes - open */}
      <circle cx="53" cy="42" r="5" fill="#1565C0" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="67" cy="42" r="5" fill="#1565C0" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="54" cy="41" r="2" fill="#FFFFFF" />
      <circle cx="68" cy="41" r="2" fill="#FFFFFF" />
      
      {/* Smile */}
      <path d="M 54 56 Q 60 59 66 56" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Cheek blush */}
      <circle cx="48" cy="48" r="4" fill="#FFB5B5" opacity="0.4" />
      <circle cx="72" cy="48" r="4" fill="#FFB5B5" opacity="0.4" />
      
      {/* Ears */}
      <ellipse cx="45" cy="28" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="75" cy="28" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="45" cy="28" rx="4" ry="10" fill="#FFB5C0" />
      <ellipse cx="75" cy="28" rx="4" ry="10" fill="#FFB5C0" />
      
      {/* Left ear bow */}
      <path d="M 40 20 Q 35 20 32 18 Q 30 16 32 14 Q 35 12 40 12 Q 42 14 40 16 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 40 20 Q 45 20 48 18 Q 50 16 48 14 Q 45 12 40 12 Q 38 14 40 16 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="40" cy="16" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Bow tie */}
      <path d="M 55 65 Q 52 65 50 63 Q 48 61 50 59 Q 52 57 55 57 Q 57 59 55 61 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 65 65 Q 68 65 70 63 Q 72 61 70 59 Q 68 57 65 57 Q 63 59 65 61 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="60" cy="61" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );

  const renderCelebratingPose = () => (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Confetti */}
      <rect x="20" y="15" width="6" height="6" fill="#29ABE2" className="confetti" style={{ animation: 'confettiFall 2s linear infinite' }} />
      <rect x="35" y="10" width="6" height="6" fill="#F7941D" className="confetti" style={{ animation: 'confettiFall 2.3s linear infinite 0.2s' }} />
      <rect x="85" y="12" width="6" height="6" fill="#29ABE2" className="confetti" style={{ animation: 'confettiFall 2.1s linear infinite 0.4s' }} />
      <rect x="100" y="18" width="6" height="6" fill="#F7941D" className="confetti" style={{ animation: 'confettiFall 2.5s linear infinite 0.1s' }} />
      <rect x="15" y="25" width="5" height="5" fill="#29ABE2" className="confetti" style={{ animation: 'confettiFall 2.2s linear infinite 0.5s' }} />
      <rect x="105" y="22" width="5" height="5" fill="#F7941D" className="confetti" style={{ animation: 'confettiFall 2.4s linear infinite 0.3s' }} />
      <rect x="45" y="8" width="5" height="5" fill="#29ABE2" className="confetti" style={{ animation: 'confettiFall 2s linear infinite 0.6s' }} />
      <rect x="75" y="14" width="5" height="5" fill="#F7941D" className="confetti" style={{ animation: 'confettiFall 2.3s linear infinite 0.7s' }} />
      
      {/* Shadow */}
      <ellipse cx="60" cy="130" rx="25" ry="8" fill="#d0d0d0" opacity="0.4" />
      
      {/* Body - jumping */}
      <ellipse cx="60" cy="75" rx="22" ry="28" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Dress */}
      <path d="M 45 65 Q 38 75 38 90 Q 38 100 45 105 L 75 105 Q 82 100 82 90 Q 82 75 75 65 Z" fill="#2D2D2D" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 38 90 Q 38 100 45 105 L 75 105 Q 82 100 82 90" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      
      {/* White buttons */}
      <circle cx="60" cy="75" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="60" cy="85" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Arms - both raised */}
      <ellipse cx="35" cy="55" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-45 35 55)" />
      <ellipse cx="85" cy="55" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(45 85 55)" />
      
      {/* Head */}
      <circle cx="60" cy="40" r="20" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Muzzle */}
      <ellipse cx="60" cy="47" rx="12" ry="10" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Nose */}
      <ellipse cx="60" cy="45" rx="3" ry="2.5" fill="#E8A0A0" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Eyes - closed happy */}
      <path d="M 48 37 Q 53 39 58 37" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 62 37 Q 67 39 72 37" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Big smile */}
      <path d="M 52 51 Q 60 55 68 51" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Cheek blush */}
      <circle cx="48" cy="43" r="4" fill="#FFB5B5" opacity="0.4" />
      <circle cx="72" cy="43" r="4" fill="#FFB5B5" opacity="0.4" />
      
      {/* Ears */}
      <ellipse cx="45" cy="23" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="75" cy="23" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="45" cy="23" rx="4" ry="10" fill="#FFB5C0" />
      <ellipse cx="75" cy="23" rx="4" ry="10" fill="#FFB5C0" />
      
      {/* Left ear bow */}
      <path d="M 40 15 Q 35 15 32 13 Q 30 11 32 9 Q 35 7 40 7 Q 42 9 40 11 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 40 15 Q 45 15 48 13 Q 50 11 48 9 Q 45 7 40 7 Q 38 9 40 11 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="40" cy="11" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Bow tie */}
      <path d="M 55 60 Q 52 60 50 58 Q 48 56 50 54 Q 52 52 55 52 Q 57 54 55 56 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 65 60 Q 68 60 70 58 Q 72 56 70 54 Q 68 52 65 52 Q 63 54 65 56 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="60" cy="56" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );

  const renderCheeringPose = () => (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Confetti */}
      <rect x="25" y="20" width="6" height="6" fill="#29ABE2" className="confetti" style={{ animation: 'confettiFall 2s linear infinite' }} />
      <rect x="40" y="15" width="6" height="6" fill="#F7941D" className="confetti" style={{ animation: 'confettiFall 2.3s linear infinite 0.2s' }} />
      <rect x="80" y="18" width="6" height="6" fill="#29ABE2" className="confetti" style={{ animation: 'confettiFall 2.1s linear infinite 0.4s' }} />
      <rect x="95" y="22" width="6" height="6" fill="#F7941D" className="confetti" style={{ animation: 'confettiFall 2.5s linear infinite 0.1s' }} />
      <rect x="18" y="28" width="5" height="5" fill="#29ABE2" className="confetti" style={{ animation: 'confettiFall 2.2s linear infinite 0.5s' }} />
      <rect x="100" y="25" width="5" height="5" fill="#F7941D" className="confetti" style={{ animation: 'confettiFall 2.4s linear infinite 0.3s' }} />
      
      {/* Shadow */}
      <ellipse cx="60" cy="130" rx="25" ry="8" fill="#d0d0d0" opacity="0.4" />
      
      {/* Body - leaning forward */}
      <ellipse cx="60" cy="78" rx="22" ry="28" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(10 60 78)" />
      
      {/* Dress */}
      <path d="M 44 68 Q 37 78 37 93 Q 37 103 44 108 L 74 108 Q 81 103 81 93 Q 81 78 74 68 Z" fill="#2D2D2D" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 37 93 Q 37 103 44 108 L 74 108 Q 81 103 81 93" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      
      {/* White buttons */}
      <circle cx="59" cy="78" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="59" cy="88" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Arms - fists raised */}
      <ellipse cx="38" cy="58" rx="8" ry="16" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-30 38 58)" />
      <ellipse cx="82" cy="58" rx="8" ry="16" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(30 82 58)" />
      <circle cx="35" cy="48" r="6" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle cx="85" cy="48" r="6" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Head */}
      <circle cx="60" cy="42" r="20" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Muzzle */}
      <ellipse cx="60" cy="49" rx="12" ry="10" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Nose */}
      <ellipse cx="60" cy="47" rx="3" ry="2.5" fill="#E8A0A0" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Eyes - squinting happy */}
      <path d="M 50 39 Q 53 41 56 39" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 64 39 Q 67 41 70 39" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Big smile */}
      <path d="M 52 53 Q 60 57 68 53" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Cheek blush */}
      <circle cx="48" cy="45" r="4" fill="#FFB5B5" opacity="0.4" />
      <circle cx="72" cy="45" r="4" fill="#FFB5B5" opacity="0.4" />
      
      {/* Ears */}
      <ellipse cx="45" cy="25" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="75" cy="25" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="45" cy="25" rx="4" ry="10" fill="#FFB5C0" />
      <ellipse cx="75" cy="25" rx="4" ry="10" fill="#FFB5C0" />
      
      {/* Left ear bow */}
      <path d="M 40 17 Q 35 17 32 15 Q 30 13 32 11 Q 35 9 40 9 Q 42 11 40 13 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 40 17 Q 45 17 48 15 Q 50 13 48 11 Q 45 9 40 9 Q 38 11 40 13 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="40" cy="13" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Bow tie */}
      <path d="M 55 63 Q 52 63 50 61 Q 48 59 50 57 Q 52 55 55 55 Q 57 57 55 59 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 65 63 Q 68 63 70 61 Q 72 59 70 57 Q 68 55 65 55 Q 63 57 65 59 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="60" cy="59" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );

  const renderThinkingPose = () => (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Question mark - animated */}
      <g style={{ animation: 'questionBob 2s ease-in-out infinite' }}>
        <text x="90" y="35" fontSize="24" fill="#29ABE2" fontWeight="bold" stroke="#1a1a1a" strokeWidth="1">?</text>
      </g>
      
      {/* Shadow */}
      <ellipse cx="50" cy="130" rx="25" ry="8" fill="#d0d0d0" opacity="0.4" />
      
      {/* Body */}
      <ellipse cx="50" cy="80" rx="22" ry="28" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Dress */}
      <path d="M 35 70 Q 28 80 28 95 Q 28 105 35 110 L 65 110 Q 72 105 72 95 Q 72 80 65 70 Z" fill="#2D2D2D" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M 28 95 Q 28 105 35 110 L 65 110 Q 72 105 72 95" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      
      {/* White buttons */}
      <circle cx="50" cy="80" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="50" cy="90" r="3" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Left arm - regular */}
      <ellipse cx="30" cy="75" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Right arm - raised to chin */}
      <ellipse cx="68" cy="52" rx="8" ry="16" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-20 68 52)" />
      
      {/* Head - tilted */}
      <circle cx="50" cy="45" r="20" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      
      {/* Muzzle */}
      <ellipse cx="50" cy="52" rx="12" ry="10" fill="#FFFFFF" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Nose */}
      <ellipse cx="50" cy="50" rx="3" ry="2.5" fill="#E8A0A0" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Eyes - big worried */}
      <circle cx="43" cy="40" r="6" fill="#1565C0" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="57" cy="40" r="6" fill="#1565C0" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="44" cy="39" r="2.5" fill="#FFFFFF" />
      <circle cx="58" cy="39" r="2.5" fill="#FFFFFF" />
      
      {/* Slight frown */}
      <path d="M 45 56 Q 50 55 55 56" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      
      {/* Cheek blush */}
      <circle cx="38" cy="48" r="4" fill="#FFB5B5" opacity="0.4" />
      <circle cx="62" cy="48" r="4" fill="#FFB5B5" opacity="0.4" />
      
      {/* Ears */}
      <ellipse cx="35" cy="28" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="65" cy="28" rx="8" ry="18" fill="#E0E0E0" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="35" cy="28" rx="4" ry="10" fill="#FFB5C0" />
      <ellipse cx="65" cy="28" rx="4" ry="10" fill="#FFB5C0" />
      
      {/* Left ear bow */}
      <path d="M 30 20 Q 25 20 22 18 Q 20 16 22 14 Q 25 12 30 12 Q 32 14 30 16 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 30 20 Q 35 20 38 18 Q 40 16 38 14 Q 35 12 30 12 Q 28 14 30 16 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="30" cy="16" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      
      {/* Bow tie */}
      <path d="M 45 65 Q 42 65 40 63 Q 38 61 40 59 Q 42 57 45 57 Q 47 59 45 61 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M 55 65 Q 58 65 60 63 Q 62 61 60 59 Q 58 57 55 57 Q 53 59 55 61 Z" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="50" cy="61" r="3" fill="#29ABE2" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );

  return (
    <div className={className} style={containerStyle}>
      {renderPose()}
    </div>
  );
}
