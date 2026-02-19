'use client';

interface LivyCharacterProps {
  pose?: 'waving' | 'celebrating' | 'cheering' | 'thinking' | 'running';
  size?: 'small' | 'medium' | 'large' | 'hero';
  animated?: boolean;
  className?: string;
}

const SIZE_DIMENSIONS = {
  small: { width: 45, height: 65 },
  medium: { width: 90, height: 130 },
  large: { width: 150, height: 215 },
  hero: { width: 240, height: 345 },
};

export default function LivyCharacter({
  pose = 'waving',
  size = 'medium',
  animated = false,
  className = '',
}: LivyCharacterProps) {
  const { width, height } = SIZE_DIMENSIONS[size];

  const getAnimationClass = () => {
    if (!animated) return '';
    switch (pose) {
      case 'waving':
        return 'animate-livyBob';
      case 'celebrating':
        return 'animate-livyCelebrateEntry';
      case 'thinking':
        return 'animate-livyThinkSway';
      case 'running':
        return 'animate-livyRunBounce';
      default:
        return '';
    }
  };

  return (
    <div
      className={`${className} ${getAnimationClass()}`}
      style={{ width: `${width}px`, height: `${height}px`, display: 'inline-block' }}
    >
      {pose === 'waving' && <WavingPose />}
      {pose === 'celebrating' && <CelebratingPose animated={animated} />}
      {pose === 'cheering' && <CheeringPose />}
      {pose === 'thinking' && <ThinkingPose animated={animated} />}
      {pose === 'running' && <RunningPose />}
    </div>
  );
}

// Waving Pose - Primary/Default
function WavingPose() {
  return (
    <svg viewBox="0 0 240 345" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradients */}
        <radialGradient id="skinGradient">
          <stop offset="0%" stopColor="#8B5E3C" />
          <stop offset="50%" stopColor="#7B4F2E" />
          <stop offset="100%" stopColor="#6B4028" />
        </radialGradient>
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A3FCC" />
          <stop offset="50%" stopColor="#29ABE2" />
          <stop offset="100%" stopColor="#6DD5FA" />
        </linearGradient>
        <linearGradient id="dressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A5D86A" />
          <stop offset="40%" stopColor="#8BC34A" />
          <stop offset="100%" stopColor="#7CB342" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="120" cy="330" rx="50" ry="12" fill="#C0C0C0" opacity="0.35" />

      {/* Right shoe (back) */}
      <ellipse cx="100" cy="315" rx="18" ry="12" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="100" cy="315" rx="18" ry="8" fill="#8BC34A" />
      <circle cx="100" cy="310" r="3" fill="#4CAF50" />

      {/* Right sock */}
      <rect x="92" y="290" width="16" height="25" fill="#FFFFFF" rx="3" />

      {/* Right leg */}
      <ellipse cx="100" cy="280" rx="12" ry="30" fill="url(#skinGradient)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Left shoe (front, lifted) */}
      <ellipse cx="140" cy="305" rx="18" ry="12" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="140" cy="305" rx="18" ry="8" fill="#8BC34A" />
      <circle cx="140" cy="300" r="3" fill="#4CAF50" />

      {/* Left sock */}
      <rect x="132" y="280" width="16" height="25" fill="#FFFFFF" rx="3" />

      {/* Left leg */}
      <ellipse cx="140" cy="270" rx="12" ry="28" fill="url(#skinGradient)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Dress skirt */}
      <path
        d="M 80 220 Q 70 250 75 280 L 95 290 Q 120 295 145 290 L 165 280 Q 170 250 160 220 Z"
        fill="url(#dressGradient)"
        stroke="#1A1A1A"
        strokeWidth="2.5"
      />
      {/* White ruffle hem */}
      <path
        d="M 75 280 Q 80 285 90 283 Q 100 280 110 283 Q 120 286 130 283 Q 140 280 150 283 Q 160 286 165 280"
        fill="#E8F5E9"
        stroke="#FFFFFF"
        strokeWidth="3"
      />

      {/* Body/torso */}
      <ellipse cx="120" cy="190" rx="30" ry="35" fill="url(#skinGradient)" stroke="#1A1A1A" strokeWidth="2.5" />

      {/* Dress bodice */}
      <ellipse cx="120" cy="190" rx="32" ry="38" fill="url(#dressGradient)" stroke="#1A1A1A" strokeWidth="2.5" />

      {/* Left arm down (with carrot) */}
      <ellipse cx="85" cy="200" rx="10" ry="28" fill="url(#skinGradient)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-15 85 200)" />
      {/* Left hand */}
      <circle cx="80" cy="225" r="8" fill="url(#skinGradient)" stroke="#1A1A1A" strokeWidth="2" />
      {/* Carrot */}
      <path d="M 78 225 L 72 245 L 80 243 Z" fill="#FF6B35" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M 74 225 L 72 218 L 76 222 L 78 216 L 80 222 Z" fill="#4CAF50" />

      {/* Right arm raised (waving) */}
      <ellipse cx="155" cy="160" rx="10" ry="28" fill="url(#skinGradient)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-35 155 160)" />
      {/* Right hand waving */}
      <ellipse cx="168" cy="145" rx="10" ry="12" fill="url(#skinGradient)" stroke="#1A1A1A" strokeWidth="2" />
      {/* Fingers */}
      <line x1="165" y1="140" x2="165" y2="132" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <line x1="168" y1="138" x2="168" y2="130" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <line x1="171" y1="140" x2="171" y2="132" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

      {/* White collar */}
      <ellipse cx="120" cy="170" rx="35" ry="15" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <path
        d="M 85 170 Q 88 175 92 173 Q 96 170 100 173 Q 104 176 108 173 Q 112 170 116 173 Q 120 176 124 173 Q 128 170 132 173 Q 136 176 140 173 Q 144 170 148 173 Q 152 176 155 170"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
      />

      {/* Green bow tie */}
      <path d="M 110 172 L 105 177 L 110 182 L 115 177 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 130 172 L 125 177 L 130 182 L 135 177 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="177" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Green buttons */}
      <circle cx="120" cy="195" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="210" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Green belt */}
      <rect x="90" y="217" width="60" height="8" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="2" rx="2" />

      {/* Neck */}
      <rect x="110" y="160" width="20" height="12" fill="url(#skinGradient)" />

      {/* Head */}
      <circle cx="120" cy="110" r="55" fill="url(#skinGradient)" stroke="#1A1A1A" strokeWidth="2.5" />

      {/* Back hair braids (simplified) */}
      <ellipse cx="75" cy="120" rx="8" ry="40" fill="url(#hairGradient)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="165" cy="120" rx="8" ry="40" fill="url(#hairGradient)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="90" cy="135" rx="7" ry="35" fill="url(#hairGradient)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="150" cy="135" rx="7" ry="35" fill="url(#hairGradient)" stroke="#1A1A1A" strokeWidth="2" />
      
      {/* Hair beads */}
      <ellipse cx="75" cy="160" rx="6" ry="8" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="165" cy="160" rx="6" ry="8" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="90" cy="170" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="150" cy="170" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Face features */}
      {/* Left eye */}
      <ellipse cx="100" cy="105" rx="12" ry="14" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="100" cy="107" r="8" fill="#29ABE2" />
      <circle cx="100" cy="107" r="4" fill="#1565C0" />
      <circle cx="102" cy="104" r="3" fill="#FFFFFF" />

      {/* Right eye */}
      <ellipse cx="140" cy="105" rx="12" ry="14" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="140" cy="107" r="8" fill="#29ABE2" />
      <circle cx="140" cy="107" r="4" fill="#1565C0" />
      <circle cx="142" cy="104" r="3" fill="#FFFFFF" />

      {/* Eyelashes */}
      <path d="M 88 100 L 85 95" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 92 98 L 90 92" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 108 98 L 110 92" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 128 100 L 125 95" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 132 98 L 130 92" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 148 98 L 150 92" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

      {/* Eyebrows */}
      <path d="M 85 92 Q 100 88 112 92" stroke="#3D2000" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 128 92 Q 140 88 152 92" stroke="#3D2000" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M 118 115 L 120 120 L 122 115" stroke="#6B4028" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Mouth - big smile */}
      <path d="M 100 130 Q 120 142 140 130" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 105 132 Q 120 140 135 132" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Rosy cheeks */}
      <circle cx="85" cy="120" r="10" fill="#FF8C6B" opacity="0.4" />
      <circle cx="155" cy="120" r="10" fill="#FF8C6B" opacity="0.4" />

      {/* Gold earrings */}
      <circle cx="70" cy="115" r="4" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="170" cy="115" r="4" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Front hair braids */}
      <ellipse cx="105" cy="80" rx="7" ry="30" fill="url(#hairGradient)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="135" cy="80" rx="7" ry="30" fill="url(#hairGradient)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="105" cy="110" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="135" cy="110" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Hair bows on left side */}
      {/* Front bow - lime/yellow-green */}
      <path d="M 75 75 L 70 70 L 70 80 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 85 75 L 90 70 L 90 80 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="80" cy="75" r="3" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Back bow - medium green */}
      <path d="M 68 85 L 63 80 L 63 90 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 78 85 L 83 80 L 83 90 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="73" cy="85" r="3" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
    </svg>
  );
}

// Celebrating Pose
function CelebratingPose({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 240 345" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skinGradientC">
          <stop offset="0%" stopColor="#8B5E3C" />
          <stop offset="50%" stopColor="#7B4F2E" />
          <stop offset="100%" stopColor="#6B4028" />
        </radialGradient>
        <linearGradient id="hairGradientC" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A3FCC" />
          <stop offset="50%" stopColor="#29ABE2" />
          <stop offset="100%" stopColor="#6DD5FA" />
        </linearGradient>
        <linearGradient id="dressGradientC" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A5D86A" />
          <stop offset="40%" stopColor="#8BC34A" />
          <stop offset="100%" stopColor="#7CB342" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="120" cy="335" rx="45" ry="10" fill="#C0C0C0" opacity="0.35" />

      {/* Shoes (both off ground) */}
      <ellipse cx="95" cy="310" rx="18" ry="10" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="95" cy="310" rx="18" ry="6" fill="#8BC34A" />
      <ellipse cx="145" cy="310" rx="18" ry="10" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="145" cy="310" rx="18" ry="6" fill="#8BC34A" />

      {/* Socks */}
      <rect x="87" y="285" width="16" height="25" fill="#FFFFFF" rx="3" />
      <rect x="137" y="285" width="16" height="25" fill="#FFFFFF" rx="3" />

      {/* Legs */}
      <ellipse cx="95" cy="275" rx="12" ry="28" fill="url(#skinGradientC)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="145" cy="275" rx="12" ry="28" fill="url(#skinGradientC)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Dress skirt */}
      <path
        d="M 75 215 Q 65 245 70 275 L 90 285 Q 120 290 150 285 L 170 275 Q 175 245 165 215 Z"
        fill="url(#dressGradientC)"
        stroke="#1A1A1A"
        strokeWidth="2.5"
      />
      <path
        d="M 70 275 Q 75 280 85 278 Q 95 275 105 278 Q 115 281 125 278 Q 135 275 145 278 Q 155 281 170 275"
        fill="#E8F5E9"
        stroke="#FFFFFF"
        strokeWidth="3"
      />

      {/* Body */}
      <ellipse cx="120" cy="185" rx="30" ry="35" fill="url(#skinGradientC)" stroke="#1A1A1A" strokeWidth="2.5" />
      <ellipse cx="120" cy="185" rx="32" ry="38" fill="url(#dressGradientC)" stroke="#1A1A1A" strokeWidth="2.5" />

      {/* Both arms raised HIGH */}
      <ellipse cx="75" cy="150" rx="10" ry="32" fill="url(#skinGradientC)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-45 75 150)" />
      <circle cx="60" cy="125" r="10" fill="url(#skinGradientC)" stroke="#1A1A1A" strokeWidth="2" />
      
      <ellipse cx="165" cy="150" rx="10" ry="32" fill="url(#skinGradientC)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(45 165 150)" />
      <circle cx="180" cy="125" r="10" fill="url(#skinGradientC)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Collar and bow */}
      <ellipse cx="120" cy="165" rx="35" ry="15" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M 110 167 L 105 172 L 110 177 L 115 172 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 130 167 L 125 172 L 130 177 L 135 172 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="172" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Buttons and belt */}
      <circle cx="120" cy="190" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="205" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <rect x="90" y="212" width="60" height="8" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="2" rx="2" />

      {/* Neck */}
      <rect x="110" y="155" width="20" height="12" fill="url(#skinGradientC)" />

      {/* Head (thrown back slightly) */}
      <circle cx="120" cy="100" r="55" fill="url(#skinGradientC)" stroke="#1A1A1A" strokeWidth="2.5" />

      {/* Hair braids flying outward */}
      <ellipse cx="65" cy="110" rx="9" ry="42" fill="url(#hairGradientC)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-15 65 110)" />
      <ellipse cx="175" cy="110" rx="9" ry="42" fill="url(#hairGradientC)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(15 175 110)" />
      <ellipse cx="85" cy="125" rx="8" ry="38" fill="url(#hairGradientC)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="155" cy="125" rx="8" ry="38" fill="url(#hairGradientC)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Hair beads */}
      <ellipse cx="65" cy="152" rx="6" ry="8" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="175" cy="152" rx="6" ry="8" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="85" cy="163" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="155" cy="163" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Eyes CLOSED - happy curves */}
      <path d="M 88 100 Q 100 105 112 100" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 128 100 Q 140 105 152 100" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Eyelashes */}
      <path d="M 88 100 L 85 95" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 100 103 L 100 97" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 112 100 L 115 95" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 128 100 L 125 95" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 140 103 L 140 97" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 152 100 L 155 95" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

      {/* Eyebrows */}
      <path d="M 85 87 Q 100 83 112 87" stroke="#3D2000" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 128 87 Q 140 83 152 87" stroke="#3D2000" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M 118 110 L 120 115 L 122 110" stroke="#6B4028" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Big happy smile */}
      <path d="M 95 125 Q 120 138 145 125" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 100 127 Q 120 136 140 127" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Cheeks */}
      <circle cx="80" cy="115" r="10" fill="#FF8C6B" opacity="0.4" />
      <circle cx="160" cy="115" r="10" fill="#FF8C6B" opacity="0.4" />

      {/* Earrings */}
      <circle cx="65" cy="105" r="4" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="175" cy="105" r="4" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Front braids */}
      <ellipse cx="100" cy="75" rx="7" ry="30" fill="url(#hairGradientC)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="140" cy="75" rx="7" ry="30" fill="url(#hairGradientC)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="100" cy="105" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="140" cy="105" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Hair bows */}
      <path d="M 70 65 L 65 60 L 65 70 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 80 65 L 85 60 L 85 70 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="75" cy="65" r="3" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 63 75 L 58 70 L 58 80 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 73 75 L 78 70 L 78 80 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="68" cy="75" r="3" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Confetti pieces */}
      {animated && (
        <g>
          <rect x="50" y="80" width="6" height="6" fill="#29ABE2" className="animate-confettiPiece" style={{ animationDelay: '0s' }} />
          <rect x="180" y="90" width="6" height="6" fill="#8BC34A" className="animate-confettiPiece" style={{ animationDelay: '0.1s' }} />
          <rect x="70" y="70" width="5" height="5" fill="#29ABE2" className="animate-confettiPiece" style={{ animationDelay: '0.2s' }} />
          <rect x="160" y="75" width="5" height="5" fill="#8BC34A" className="animate-confettiPiece" style={{ animationDelay: '0.3s' }} />
          <rect x="90" y="65" width="6" height="6" fill="#29ABE2" className="animate-confettiPiece" style={{ animationDelay: '0.15s' }} />
          <rect x="150" y="68" width="6" height="6" fill="#8BC34A" className="animate-confettiPiece" style={{ animationDelay: '0.25s' }} />
          <rect x="110" y="60" width="5" height="5" fill="#29ABE2" className="animate-confettiPiece" style={{ animationDelay: '0.05s' }} />
          <rect x="130" y="62" width="5" height="5" fill="#8BC34A" className="animate-confettiPiece" style={{ animationDelay: '0.18s' }} />
          <rect x="40" y="100" width="4" height="4" fill="#29ABE2" className="animate-confettiPiece" style={{ animationDelay: '0.12s' }} />
          <rect x="190" y="105" width="4" height="4" fill="#8BC34A" className="animate-confettiPiece" style={{ animationDelay: '0.22s' }} />
        </g>
      )}
    </svg>
  );
}

// Cheering Pose
function CheeringPose() {
  return (
    <svg viewBox="0 0 240 345" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skinGradientCh">
          <stop offset="0%" stopColor="#8B5E3C" />
          <stop offset="50%" stopColor="#7B4F2E" />
          <stop offset="100%" stopColor="#6B4028" />
        </radialGradient>
        <linearGradient id="hairGradientCh" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A3FCC" />
          <stop offset="50%" stopColor="#29ABE2" />
          <stop offset="100%" stopColor="#6DD5FA" />
        </linearGradient>
        <linearGradient id="dressGradientCh" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A5D86A" />
          <stop offset="40%" stopColor="#8BC34A" />
          <stop offset="100%" stopColor="#7CB342" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="120" cy="330" rx="48" ry="12" fill="#C0C0C0" opacity="0.35" />

      {/* Left shoe on ground */}
      <ellipse cx="100" cy="315" rx="18" ry="12" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="100" cy="315" rx="18" ry="8" fill="#8BC34A" />
      <rect x="92" y="290" width="16" height="25" fill="#FFFFFF" rx="3" />
      <ellipse cx="100" cy="280" rx="12" ry="30" fill="url(#skinGradientCh)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Right foot kicked up */}
      <ellipse cx="155" cy="285" rx="18" ry="10" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" transform="rotate(25 155 285)" />
      <ellipse cx="155" cy="285" rx="18" ry="6" fill="#8BC34A" transform="rotate(25 155 285)" />
      <rect x="140" y="270" width="16" height="20" fill="#FFFFFF" rx="3" transform="rotate(15 148 280)" />
      <ellipse cx="145" cy="265" rx="11" ry="25" fill="url(#skinGradientCh)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(15 145 265)" />

      {/* Dress */}
      <path
        d="M 78 220 Q 68 250 73 280 L 93 290 Q 120 295 147 290 L 167 280 Q 172 250 162 220 Z"
        fill="url(#dressGradientCh)"
        stroke="#1A1A1A"
        strokeWidth="2.5"
      />
      <path
        d="M 73 280 Q 78 285 88 283 Q 98 280 108 283 Q 118 286 128 283 Q 138 280 148 283 Q 158 286 167 280"
        fill="#E8F5E9"
        stroke="#FFFFFF"
        strokeWidth="3"
      />

      {/* Body */}
      <ellipse cx="120" cy="190" rx="30" ry="35" fill="url(#skinGradientCh)" stroke="#1A1A1A" strokeWidth="2.5" />
      <ellipse cx="120" cy="190" rx="32" ry="38" fill="url(#dressGradientCh)" stroke="#1A1A1A" strokeWidth="2.5" />

      {/* Arms bent - fists raised in cheer */}
      <ellipse cx="85" cy="175" rx="10" ry="26" fill="url(#skinGradientCh)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-25 85 175)" />
      <circle cx="75" cy="155" r="9" fill="url(#skinGradientCh)" stroke="#1A1A1A" strokeWidth="2" />
      
      <ellipse cx="155" cy="175" rx="10" ry="26" fill="url(#skinGradientCh)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(25 155 175)" />
      <circle cx="165" cy="155" r="9" fill="url(#skinGradientCh)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Collar and accessories */}
      <ellipse cx="120" cy="170" rx="35" ry="15" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M 110 172 L 105 177 L 110 182 L 115 177 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 130 172 L 125 177 L 130 182 L 135 177 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="177" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="195" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="210" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <rect x="90" y="217" width="60" height="8" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="2" rx="2" />

      {/* Neck */}
      <rect x="110" y="160" width="20" height="12" fill="url(#skinGradientCh)" />

      {/* Head leaning forward */}
      <circle cx="120" cy="105" r="55" fill="url(#skinGradientCh)" stroke="#1A1A1A" strokeWidth="2.5" />

      {/* Hair swinging forward */}
      <ellipse cx="80" cy="115" rx="8" ry="40" fill="url(#hairGradientCh)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="160" cy="115" rx="8" ry="40" fill="url(#hairGradientCh)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="95" cy="130" rx="7" ry="35" fill="url(#hairGradientCh)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="145" cy="130" rx="7" ry="35" fill="url(#hairGradientCh)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="80" cy="155" rx="6" ry="8" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="160" cy="155" rx="6" ry="8" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="95" cy="165" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="145" cy="165" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Eyes closed/squinting */}
      <path d="M 88 98 Q 100 103 112 98" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 128 98 Q 140 103 152 98" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Eyelashes */}
      <path d="M 88 98 L 85 93" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 100 101 L 100 95" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 112 98 L 115 93" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 128 98 L 125 93" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 140 101 L 140 95" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 152 98 L 155 93" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

      {/* Eyebrows */}
      <path d="M 85 90 Q 100 86 112 90" stroke="#3D2000" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 128 90 Q 140 86 152 90" stroke="#3D2000" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M 118 113 L 120 118 L 122 113" stroke="#6B4028" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Big smile */}
      <path d="M 98 128 Q 120 140 142 128" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 103 130 Q 120 138 137 130" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Cheeks */}
      <circle cx="83" cy="118" r="10" fill="#FF8C6B" opacity="0.4" />
      <circle cx="157" cy="118" r="10" fill="#FF8C6B" opacity="0.4" />

      {/* Earrings */}
      <circle cx="70" cy="110" r="4" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="170" cy="110" r="4" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Front braids */}
      <ellipse cx="105" cy="78" rx="7" ry="30" fill="url(#hairGradientCh)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="135" cy="78" rx="7" ry="30" fill="url(#hairGradientCh)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="105" cy="108" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="135" cy="108" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Hair bows */}
      <path d="M 73 70 L 68 65 L 68 75 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 83 70 L 88 65 L 88 75 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="78" cy="70" r="3" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 66 80 L 61 75 L 61 85 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 76 80 L 81 75 L 81 85 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="71" cy="80" r="3" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Confetti */}
      <rect x="60" y="130" width="5" height="5" fill="#29ABE2" opacity="0.8" />
      <rect x="170" y="140" width="5" height="5" fill="#8BC34A" opacity="0.8" />
      <rect x="85" y="125" width="4" height="4" fill="#29ABE2" opacity="0.8" />
      <rect x="155" y="135" width="4" height="4" fill="#8BC34A" opacity="0.8" />
      <rect x="110" y="120" width="5" height="5" fill="#29ABE2" opacity="0.8" />
      <rect x="130" y="118" width="5" height="5" fill="#8BC34A" opacity="0.8" />
    </svg>
  );
}

// Thinking Pose
function ThinkingPose({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 240 345" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skinGradientT">
          <stop offset="0%" stopColor="#8B5E3C" />
          <stop offset="50%" stopColor="#7B4F2E" />
          <stop offset="100%" stopColor="#6B4028" />
        </radialGradient>
        <linearGradient id="hairGradientT" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A3FCC" />
          <stop offset="50%" stopColor="#29ABE2" />
          <stop offset="100%" stopColor="#6DD5FA" />
        </linearGradient>
        <linearGradient id="dressGradientT" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A5D86A" />
          <stop offset="40%" stopColor="#8BC34A" />
          <stop offset="100%" stopColor="#7CB342" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="120" cy="330" rx="50" ry="12" fill="#C0C0C0" opacity="0.35" />

      {/* Left shoe */}
      <ellipse cx="95" cy="315" rx="18" ry="12" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="95" cy="315" rx="18" ry="8" fill="#8BC34A" />
      <rect x="87" y="290" width="16" height="25" fill="#FFFFFF" rx="3" />
      <ellipse cx="95" cy="280" rx="12" ry="30" fill="url(#skinGradientT)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Right shoe */}
      <ellipse cx="130" cy="318" rx="18" ry="12" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="130" cy="318" rx="18" ry="8" fill="#8BC34A" />
      <rect x="122" y="293" width="16" height="25" fill="#FFFFFF" rx="3" />
      <ellipse cx="130" cy="283" rx="12" ry="30" fill="url(#skinGradientT)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Dress */}
      <path
        d="M 78 220 Q 68 250 73 280 L 93 290 Q 120 295 147 293 L 167 283 Q 172 253 162 220 Z"
        fill="url(#dressGradientT)"
        stroke="#1A1A1A"
        strokeWidth="2.5"
      />
      <path
        d="M 73 280 Q 78 285 88 283 Q 98 280 108 283 Q 118 286 128 283 Q 138 280 148 283 Q 158 286 167 283"
        fill="#E8F5E9"
        stroke="#FFFFFF"
        strokeWidth="3"
      />

      {/* Body */}
      <ellipse cx="120" cy="190" rx="30" ry="35" fill="url(#skinGradientT)" stroke="#1A1A1A" strokeWidth="2.5" />
      <ellipse cx="120" cy="190" rx="32" ry="38" fill="url(#dressGradientT)" stroke="#1A1A1A" strokeWidth="2.5" />

      {/* Left arm supporting right elbow */}
      <ellipse cx="95" cy="205" rx="10" ry="26" fill="url(#skinGradientT)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(10 95 205)" />
      <circle cx="92" cy="230" r="8" fill="url(#skinGradientT)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Right arm raised to chin */}
      <ellipse cx="145" cy="185" rx="10" ry="28" fill="url(#skinGradientT)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(45 145 185)" />
      <circle cx="158" cy="165" r="9" fill="url(#skinGradientT)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Collar and accessories */}
      <ellipse cx="120" cy="170" rx="35" ry="15" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M 110 172 L 105 177 L 110 182 L 115 177 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 130 172 L 125 177 L 130 182 L 135 177 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="177" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="195" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="120" cy="210" r="4" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <rect x="90" y="217" width="60" height="8" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="2" rx="2" />

      {/* Neck */}
      <rect x="110" y="160" width="20" height="12" fill="url(#skinGradientT)" />

      {/* Head tilted */}
      <circle cx="120" cy="105" r="55" fill="url(#skinGradientT)" stroke="#1A1A1A" strokeWidth="2.5" transform="rotate(-8 120 105)" />

      {/* Hair */}
      <ellipse cx="75" cy="118" rx="8" ry="40" fill="url(#hairGradientT)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="165" cy="118" rx="8" ry="40" fill="url(#hairGradientT)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="90" cy="133" rx="7" ry="35" fill="url(#hairGradientT)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="150" cy="133" rx="7" ry="35" fill="url(#hairGradientT)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="75" cy="158" rx="6" ry="8" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="165" cy="158" rx="6" ry="8" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="90" cy="168" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="150" cy="168" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Eyes WIDE open, looking up-right */}
      <ellipse cx="102" cy="103" rx="13" ry="15" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="105" cy="100" r="9" fill="#29ABE2" />
      <circle cx="105" cy="100" r="4" fill="#1565C0" />
      <circle cx="107" cy="97" r="3" fill="#FFFFFF" />

      <ellipse cx="138" cy="103" rx="13" ry="15" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="141" cy="100" r="9" fill="#29ABE2" />
      <circle cx="141" cy="100" r="4" fill="#1565C0" />
      <circle cx="143" cy="97" r="3" fill="#FFFFFF" />

      {/* Eyelashes */}
      <path d="M 89 98 L 86 93" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 95 96 L 93 90" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 109 96 L 111 90" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 125 98 L 122 93" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 131 96 L 129 90" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 145 96 L 147 90" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

      {/* Eyebrows slightly raised */}
      <path d="M 86 90 Q 101 85 113 89" stroke="#3D2000" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 125 89 Q 137 84 149 88" stroke="#3D2000" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M 118 113 L 120 118 L 122 113" stroke="#6B4028" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Thoughtful expression - slight smile */}
      <path d="M 105 128 Q 120 133 135 128" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="85" cy="118" r="10" fill="#FF8C6B" opacity="0.4" />
      <circle cx="155" cy="118" r="10" fill="#FF8C6B" opacity="0.4" />

      {/* Earrings */}
      <circle cx="70" cy="110" r="4" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="170" cy="110" r="4" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Front braids */}
      <ellipse cx="105" cy="78" rx="7" ry="30" fill="url(#hairGradientT)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="135" cy="78" rx="7" ry="30" fill="url(#hairGradientT)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="105" cy="108" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="135" cy="108" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Hair bows */}
      <path d="M 73 70 L 68 65 L 68 75 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 83 70 L 88 65 L 88 75 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="78" cy="70" r="3" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 66 80 L 61 75 L 61 85 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 76 80 L 81 75 L 81 85 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="71" cy="80" r="3" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Question mark floating upper-right */}
      <g className={animated ? 'animate-questionMarkBob' : ''}>
        <path
          d="M 165 60 Q 175 55 180 65 Q 185 75 175 80 Q 170 83 170 90"
          stroke="#29ABE2"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="170" cy="100" r="4" fill="#29ABE2" />
      </g>
    </svg>
  );
}

// Running Pose
function RunningPose() {
  return (
    <svg viewBox="0 0 240 345" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skinGradientR">
          <stop offset="0%" stopColor="#8B5E3C" />
          <stop offset="50%" stopColor="#7B4F2E" />
          <stop offset="100%" stopColor="#6B4028" />
        </radialGradient>
        <linearGradient id="hairGradientR" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1A3FCC" />
          <stop offset="50%" stopColor="#29ABE2" />
          <stop offset="100%" stopColor="#6DD5FA" />
        </linearGradient>
        <linearGradient id="dressGradientR" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A5D86A" />
          <stop offset="40%" stopColor="#8BC34A" />
          <stop offset="100%" stopColor="#7CB342" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="100" cy="330" rx="40" ry="10" fill="#C0C0C0" opacity="0.35" />

      {/* Back leg extended */}
      <ellipse cx="150" cy="295" rx="11" ry="32" fill="url(#skinGradientR)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(35 150 295)" />
      <ellipse cx="165" cy="320" rx="16" ry="10" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" transform="rotate(20 165 320)" />
      <ellipse cx="165" cy="320" rx="16" ry="6" fill="#8BC34A" transform="rotate(20 165 320)" />
      <rect x="150" y="290" width="14" height="20" fill="#FFFFFF" rx="3" transform="rotate(25 157 300)" />

      {/* Front leg bent forward */}
      <ellipse cx="85" cy="280" rx="11" ry="28" fill="url(#skinGradientR)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-25 85 280)" />
      <ellipse cx="70" cy="305" rx="16" ry="10" fill="#FFFFF0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="70" cy="305" rx="16" ry="6" fill="#8BC34A" />
      <rect x="75" y="275" width="14" height="20" fill="#FFFFFF" rx="3" transform="rotate(-15 82 285)" />

      {/* Body leaning forward 45° */}
      <ellipse cx="110" cy="220" rx="28" ry="38" fill="url(#dressGradientR)" stroke="#1A1A1A" strokeWidth="2.5" transform="rotate(-30 110 220)" />

      {/* Dress skirt flowing */}
      <path
        d="M 85 210 Q 75 235 78 260 L 95 275 Q 115 280 135 275 L 152 260 Q 158 235 148 210 Z"
        fill="url(#dressGradientR)"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        transform="rotate(-20 115 240)"
      />

      {/* Back arm pumping back */}
      <ellipse cx="135" cy="210" rx="9" ry="30" fill="url(#skinGradientR)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-55 135 210)" />
      <circle cx="150" cy="235" r="8" fill="url(#skinGradientR)" stroke="#1A1A1A" strokeWidth="2" />

      {/* Front arm pumping forward with carrot */}
      <ellipse cx="75" cy="195" rx="9" ry="28" fill="url(#skinGradientR)" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-20 75 195)" />
      <circle cx="65" cy="175" r="8" fill="url(#skinGradientR)" stroke="#1A1A1A" strokeWidth="2" />
      {/* Carrot tucked under arm */}
      <path d="M 63 178 L 58 192 L 66 190 Z" fill="#FF6B35" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 60 178 L 58 172 L 62 176 L 64 170 L 66 176 Z" fill="#4CAF50" />

      {/* Collar and accessories */}
      <ellipse cx="110" cy="195" rx="32" ry="14" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-30 110 195)" />
      <path d="M 105 195 L 100 200 L 105 205 L 110 200 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 120 195 L 115 200 L 120 205 L 125 200 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="112" cy="200" r="3" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Neck */}
      <rect x="105" y="180" width="18" height="12" fill="url(#skinGradientR)" transform="rotate(-30 114 186)" />

      {/* Head leaning forward */}
      <circle cx="105" cy="140" r="50" fill="url(#skinGradientR)" stroke="#1A1A1A" strokeWidth="2.5" transform="rotate(-15 105 140)" />

      {/* Hair streaming back horizontally */}
      <ellipse cx="150" cy="135" rx="45" ry="8" fill="url(#hairGradientR)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="155" cy="145" rx="42" ry="7" fill="url(#hairGradientR)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="160" cy="155" rx="38" ry="7" fill="url(#hairGradientR)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="158" cy="125" rx="40" ry="7" fill="url(#hairGradientR)" stroke="#1A1A1A" strokeWidth="2" />
      
      {/* Hair beads at ends */}
      <ellipse cx="195" cy="135" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="197" cy="145" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="198" cy="155" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="198" cy="125" rx="5" ry="7" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Eyes determined/focused */}
      <ellipse cx="92" cy="135" rx="11" ry="13" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="92" cy="137" r="7" fill="#29ABE2" />
      <circle cx="92" cy="137" r="3" fill="#1565C0" />
      <circle cx="94" cy="134" r="2" fill="#FFFFFF" />

      <ellipse cx="118" cy="135" rx="11" ry="13" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="118" cy="137" r="7" fill="#29ABE2" />
      <circle cx="118" cy="137" r="3" fill="#1565C0" />
      <circle cx="120" cy="134" r="2" fill="#FFFFFF" />

      {/* Eyebrows determined */}
      <path d="M 81 128 Q 92 126 102 128" stroke="#3D2000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 107 128 Q 118 126 128 128" stroke="#3D2000" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M 103 145 L 105 150 L 107 145" stroke="#6B4028" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Focused expression */}
      <path d="M 92 158 Q 105 162 118 158" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="78" cy="148" r="9" fill="#FF8C6B" opacity="0.4" />
      <circle cx="128" cy="148" r="9" fill="#FF8C6B" opacity="0.4" />

      {/* Earrings */}
      <circle cx="65" cy="143" r="3" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="145" cy="143" r="3" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Front braids */}
      <ellipse cx="90" cy="115" rx="6" ry="25" fill="url(#hairGradientR)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="110" cy="115" rx="6" ry="25" fill="url(#hairGradientR)" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="90" cy="140" rx="4" ry="6" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />
      <ellipse cx="110" cy="140" rx="4" ry="6" fill="#6DD5FA" stroke="#29ABE2" strokeWidth="1.5" />

      {/* Hair bows */}
      <path d="M 68 105 L 63 100 L 63 110 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 78 105 L 83 100 L 83 110 Z" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="73" cy="105" r="3" fill="#CDDC39" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 61 115 L 56 110 L 56 120 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 71 115 L 76 110 L 76 120 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="66" cy="115" r="3" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5" />
    </svg>
  );
}
