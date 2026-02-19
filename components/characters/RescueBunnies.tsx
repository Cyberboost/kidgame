import React from 'react';

export interface RescueBunnyProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  pose?: 'standing' | 'trapped' | 'rescued';
  className?: string;
}

const sizeMap = {
  small: 80,
  medium: 120,
  large: 180,
};

// Rosie - Pink bunny girl with carrot
export function RosieCharacter({ 
  size = 'medium', 
  animated = false, 
  pose = 'standing',
  className = '' 
}: RescueBunnyProps) {
  const dimensions = sizeMap[size];
  
  const animationClass = animated 
    ? pose === 'trapped' 
      ? 'animate-bunny-shiver' 
      : pose === 'rescued'
      ? 'animate-bunny-joy'
      : 'animate-bunny-sway'
    : '';

  // Adjust eye and mouth for different poses
  const eyeY = pose === 'trapped' ? 48 : 45;
  const mouthPath = pose === 'rescued' 
    ? 'M 50 62 Q 60 68 70 62' // Big smile
    : pose === 'trapped'
    ? 'M 50 64 Q 60 62 70 64' // Sad frown
    : 'M 50 63 Q 60 65 70 63'; // Neutral smile

  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 120 140"
      className={`${animationClass} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Drop shadow */}
      <ellipse cx="60" cy="135" rx="25" ry="5" fill="#00000020" />
      
      {/* Body - Pink fur */}
      <ellipse cx="60" cy="85" rx="28" ry="35" fill="#F4A0B0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="60" cy="85" rx="18" ry="25" fill="#F8C0CC" />
      
      {/* Head */}
      <circle cx="60" cy="50" r="24" fill="#F4A0B0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="60" cy="55" rx="16" ry="14" fill="#F8C0CC" />
      
      {/* Ears */}
      <ellipse cx="48" cy="28" rx="7" ry="18" fill="#F4A0B0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="48" cy="30" rx="4" ry="12" fill="#FFB5D0" />
      <ellipse cx="72" cy="28" rx="7" ry="18" fill="#F4A0B0" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="72" cy="30" rx="4" ry="12" fill="#FFB5D0" />
      
      {/* Yellow bow on left ear */}
      <path d="M 42 24 L 38 20 L 42 16 L 46 20 Z" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 54 24 L 50 20 L 54 16 L 58 20 Z" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="48" cy="20" r="3" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Eyes */}
      <circle cx="52" cy={eyeY} r="4" fill="#2D1B00" />
      <circle cx="68" cy={eyeY} r="4" fill="#2D1B00" />
      <circle cx="53" cy={eyeY - 1} r="1.5" fill="#FFF" />
      <circle cx="69" cy={eyeY - 1} r="1.5" fill="#FFF" />
      
      {/* Nose */}
      <ellipse cx="60" cy="58" rx="3" ry="2" fill="#FF8FA3" />
      
      {/* Mouth */}
      <path d={mouthPath} fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Rosy cheeks */}
      <circle cx="45" cy="54" r="5" fill="#FF8FA3" opacity="0.4" />
      <circle cx="75" cy="54" r="5" fill="#FF8FA3" opacity="0.4" />
      
      {/* Yellow dress */}
      <path d="M 40 85 L 35 115 L 85 115 L 80 85 Z" fill="#FFD700" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M 35 115 L 85 115 L 85 118 Q 60 122 35 118 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Bow tie at chest */}
      <path d="M 50 75 L 46 78 L 50 81 L 54 78 Z" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 70 75 L 66 78 L 70 81 L 74 78 Z" fill="#FFD700" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="60" cy="78" r="3" fill="#FFF" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Arms */}
      <ellipse cx="36" cy="92" rx="6" ry="16" fill="#F4A0B0" stroke="#1A1A1A" strokeWidth="1.5" />
      <ellipse cx="84" cy="92" rx="6" ry="16" fill="#F4A0B0" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Carrot in right hand */}
      <path d="M 88 95 L 92 105 L 90 106 L 86 96 Z" fill="#FF6B35" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 88 93 L 86 90 L 89 89 L 91 90 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1" />
      <path d="M 90 93 L 88 89 L 91 88 L 93 89 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1" />
      
      {/* Legs and feet */}
      <ellipse cx="50" cy="125" rx="6" ry="10" fill="#F4A0B0" stroke="#1A1A1A" strokeWidth="1.5" />
      <ellipse cx="70" cy="125" rx="6" ry="10" fill="#F4A0B0" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Trapped overlay - cage bars */}
      {pose === 'trapped' && (
        <g className="animate-trap-bars">
          <rect x="20" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="35" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="50" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="65" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="80" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="95" y="10" width="3" height="120" fill="#333" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

// Chester - Brown bunny boy with thumbs up
export function ChesterCharacter({ 
  size = 'medium', 
  animated = false, 
  pose = 'standing',
  className = '' 
}: RescueBunnyProps) {
  const dimensions = sizeMap[size];
  
  const animationClass = animated 
    ? pose === 'trapped' 
      ? 'animate-bunny-shiver' 
      : pose === 'rescued'
      ? 'animate-bunny-joy'
      : 'animate-bunny-sway'
    : '';

  const eyeY = pose === 'trapped' ? 48 : 45;
  const mouthPath = pose === 'rescued' 
    ? 'M 50 62 Q 60 68 70 62'
    : pose === 'trapped'
    ? 'M 50 64 Q 60 62 70 64'
    : 'M 50 63 Q 60 66 70 63';

  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 120 140"
      className={`${animationClass} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Drop shadow */}
      <ellipse cx="60" cy="135" rx="25" ry="5" fill="#00000020" />
      
      {/* Body - Brown/tan fur */}
      <ellipse cx="60" cy="85" rx="28" ry="35" fill="#C4956A" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="60" cy="85" rx="18" ry="25" fill="#E8C99A" />
      
      {/* Head */}
      <circle cx="60" cy="50" r="24" fill="#C4956A" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="60" cy="55" rx="16" ry="14" fill="#E8C99A" />
      
      {/* Ears - long floppy */}
      <ellipse cx="48" cy="28" rx="7" ry="20" fill="#C4956A" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="48" cy="32" rx="4" ry="14" fill="#FFB5B5" />
      <ellipse cx="72" cy="28" rx="7" ry="20" fill="#C4956A" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="72" cy="32" rx="4" ry="14" fill="#FFB5B5" />
      
      {/* Eyes */}
      <circle cx="52" cy={eyeY} r="4" fill="#2D1B00" />
      <circle cx="68" cy={eyeY} r="4" fill="#2D1B00" />
      <circle cx="53" cy={eyeY - 1} r="1.5" fill="#FFF" />
      <circle cx="69" cy={eyeY - 1} r="1.5" fill="#FFF" />
      
      {/* Nose */}
      <ellipse cx="60" cy="58" rx="3" ry="2" fill="#8B6F4A" />
      
      {/* Mouth */}
      <path d={mouthPath} fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Rosy cheeks */}
      <circle cx="45" cy="54" r="5" fill="#FFB5B5" opacity="0.5" />
      <circle cx="75" cy="54" r="5" fill="#FFB5B5" opacity="0.5" />
      
      {/* Teal/mint t-shirt */}
      <ellipse cx="60" cy="82" rx="24" ry="18" fill="#4DD0C4" stroke="#1A1A1A" strokeWidth="2" />
      
      {/* Blue denim overalls */}
      <path d="M 40 85 L 35 118 L 85 118 L 80 85 Z" fill="#2979B8" stroke="#1A1A1A" strokeWidth="2" />
      
      {/* Overall straps */}
      <rect x="48" y="70" width="5" height="20" fill="#2979B8" stroke="#1A1A1A" strokeWidth="1.5" />
      <rect x="67" y="70" width="5" height="20" fill="#2979B8" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* White button snaps */}
      <circle cx="50" cy="72" r="3" fill="#FFF" stroke="#1A1A1A" strokeWidth="1" />
      <circle cx="70" cy="72" r="3" fill="#FFF" stroke="#1A1A1A" strokeWidth="1" />
      <circle cx="45" cy="95" r="2.5" fill="#FFF" stroke="#1A1A1A" strokeWidth="1" />
      <circle cx="75" cy="95" r="2.5" fill="#FFF" stroke="#1A1A1A" strokeWidth="1" />
      
      {/* Arms */}
      <ellipse cx="36" cy="92" rx="6" ry="16" fill="#C4956A" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Right arm raised with thumbs up */}
      <ellipse cx="84" cy="68" rx="6" ry="18" fill="#C4956A" stroke="#1A1A1A" strokeWidth="1.5" transform="rotate(-25 84 68)" />
      
      {/* Thumbs up hand */}
      <ellipse cx="90" cy="48" rx="5" ry="8" fill="#C4956A" stroke="#1A1A1A" strokeWidth="1.5" />
      <rect x="88" y="36" width="4" height="10" rx="2" fill="#C4956A" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Legs and feet */}
      <ellipse cx="50" cy="125" rx="6" ry="10" fill="#C4956A" stroke="#1A1A1A" strokeWidth="1.5" />
      <ellipse cx="70" cy="125" rx="6" ry="10" fill="#C4956A" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Trapped overlay */}
      {pose === 'trapped' && (
        <g className="animate-trap-bars">
          <rect x="20" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="35" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="50" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="65" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="80" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="95" y="10" width="3" height="120" fill="#333" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

// Professor Pip - White bunny with glasses and book
export function PipCharacter({ 
  size = 'medium', 
  animated = false, 
  pose = 'standing',
  className = '' 
}: RescueBunnyProps) {
  const dimensions = sizeMap[size];
  
  const animationClass = animated 
    ? pose === 'trapped' 
      ? 'animate-bunny-shiver' 
      : pose === 'rescued'
      ? 'animate-bunny-joy'
      : 'animate-bunny-sway'
    : '';

  const eyeY = pose === 'trapped' ? 48 : 45;
  const mouthPath = pose === 'rescued' 
    ? 'M 50 62 Q 60 68 70 62'
    : pose === 'trapped'
    ? 'M 50 64 Q 60 62 70 64'
    : 'M 50 63 Q 60 64 70 63';

  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 120 140"
      className={`${animationClass} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Drop shadow */}
      <ellipse cx="60" cy="135" rx="25" ry="5" fill="#00000020" />
      
      {/* Body - White/cream fur, slightly chubby */}
      <ellipse cx="60" cy="85" rx="30" ry="36" fill="#F8F8F4" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="60" cy="85" rx="20" ry="26" fill="#FEFEFE" />
      
      {/* Head */}
      <circle cx="60" cy="50" r="25" fill="#F8F8F4" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="60" cy="55" rx="17" ry="15" fill="#FEFEFE" />
      
      {/* Ears - one slightly drooping */}
      <ellipse cx="47" cy="28" rx="7" ry="19" fill="#F8F8F4" stroke="#1A1A1A" strokeWidth="2" transform="rotate(-5 47 28)" />
      <ellipse cx="47" cy="31" rx="4" ry="13" fill="#FFB5B5" />
      <ellipse cx="73" cy="28" rx="7" ry="19" fill="#F8F8F4" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="73" cy="31" rx="4" ry="13" fill="#FFB5B5" />
      
      {/* Round black-rimmed glasses */}
      <circle cx="52" cy={eyeY} r="8" fill="none" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="68" cy={eyeY} r="8" fill="none" stroke="#1A1A1A" strokeWidth="2" />
      
      {/* Eyes behind glasses */}
      <circle cx="52" cy={eyeY} r="4" fill="#1A1A1A" />
      <circle cx="68" cy={eyeY} r="4" fill="#1A1A1A" />
      <circle cx="53" cy={eyeY - 1} r="1.5" fill="#FFF" />
      <circle cx="69" cy={eyeY - 1} r="1.5" fill="#FFF" />
      
      {/* Nose */}
      <ellipse cx="60" cy="58" rx="3" ry="2" fill="#E8E8E0" />
      
      {/* Mouth */}
      <path d={mouthPath} fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Rosy cheeks */}
      <circle cx="43" cy="54" r="5" fill="#FFB5B5" opacity="0.4" />
      <circle cx="77" cy="54" r="5" fill="#FFB5B5" opacity="0.4" />
      
      {/* Green and white striped polo shirt */}
      <ellipse cx="60" cy="82" rx="26" ry="20" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="2" />
      <rect x="34" y="75" width="52" height="4" fill="#FFF" />
      <rect x="34" y="83" width="52" height="4" fill="#FFF" />
      <rect x="34" y="91" width="52" height="4" fill="#FFF" />
      
      {/* Arms holding book */}
      <ellipse cx="38" cy="95" rx="6" ry="14" fill="#F8F8F4" stroke="#1A1A1A" strokeWidth="1.5" />
      <ellipse cx="82" cy="95" rx="6" ry="14" fill="#F8F8F4" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Blue book open in front */}
      <rect x="45" y="88" width="30" height="25" rx="2" fill="#2196F3" stroke="#1A1A1A" strokeWidth="2" />
      <rect x="48" y="91" width="11" height="19" fill="#FFF" stroke="#1A1A1A" strokeWidth="1" />
      <rect x="61" y="91" width="11" height="19" fill="#FFF" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="60" y1="88" x2="60" y2="113" stroke="#1A1A1A" strokeWidth="2" />
      
      {/* Legs and feet */}
      <ellipse cx="50" cy="125" rx="6" ry="10" fill="#F8F8F4" stroke="#1A1A1A" strokeWidth="1.5" />
      <ellipse cx="70" cy="125" rx="6" ry="10" fill="#F8F8F4" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Trapped overlay */}
      {pose === 'trapped' && (
        <g className="animate-trap-bars">
          <rect x="20" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="35" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="50" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="65" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="80" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="95" y="10" width="3" height="120" fill="#333" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

// Violet - Dark gray bunny girl
export function VioletCharacter({ 
  size = 'medium', 
  animated = false, 
  pose = 'standing',
  className = '' 
}: RescueBunnyProps) {
  const dimensions = sizeMap[size];
  
  const animationClass = animated 
    ? pose === 'trapped' 
      ? 'animate-bunny-shiver' 
      : pose === 'rescued'
      ? 'animate-bunny-joy'
      : 'animate-bunny-sway'
    : '';

  const eyeY = pose === 'trapped' ? 48 : 45;
  const mouthPath = pose === 'rescued' 
    ? 'M 50 62 Q 60 68 70 62'
    : pose === 'trapped'
    ? 'M 50 64 Q 60 62 70 64'
    : 'M 50 63 Q 60 65 70 63';

  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 120 140"
      className={`${animationClass} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Drop shadow */}
      <ellipse cx="60" cy="135" rx="25" ry="5" fill="#00000020" />
      
      {/* Body - Dark gray fur */}
      <ellipse cx="60" cy="85" rx="28" ry="35" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="60" cy="85" rx="18" ry="25" fill="#9A9A9A" />
      
      {/* Head */}
      <circle cx="60" cy="50" r="24" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="60" cy="55" rx="16" ry="14" fill="#9A9A9A" />
      
      {/* Ears */}
      <ellipse cx="48" cy="28" rx="7" ry="18" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="48" cy="30" rx="4" ry="12" fill="#FFB5B5" />
      <ellipse cx="72" cy="28" rx="7" ry="18" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="72" cy="30" rx="4" ry="12" fill="#FFB5B5" />
      
      {/* Purple bow on left ear */}
      <path d="M 42 24 L 38 20 L 42 16 L 46 20 Z" fill="#9C27B0" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 54 24 L 50 20 L 54 16 L 58 20 Z" fill="#9C27B0" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="48" cy="20" r="3" fill="#9C27B0" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Eyes - purple/blue sparkly */}
      <circle cx="52" cy={eyeY} r="4" fill="#7C4DFF" />
      <circle cx="68" cy={eyeY} r="4" fill="#7C4DFF" />
      <circle cx="53" cy={eyeY - 1} r="1.5" fill="#FFF" />
      <circle cx="69" cy={eyeY - 1} r="1.5" fill="#FFF" />
      <circle cx="51" cy={eyeY + 1} r="0.8" fill="#FFF" opacity="0.5" />
      <circle cx="67" cy={eyeY + 1} r="0.8" fill="#FFF" opacity="0.5" />
      
      {/* Nose */}
      <ellipse cx="60" cy="58" rx="3" ry="2" fill="#6A6A6A" />
      
      {/* Mouth */}
      <path d={mouthPath} fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Rosy cheeks - subtle */}
      <circle cx="45" cy="54" r="5" fill="#FF8FA3" opacity="0.3" />
      <circle cx="75" cy="54" r="5" fill="#FF8FA3" opacity="0.3" />
      
      {/* Purple dress */}
      <path d="M 40 85 L 35 115 L 85 115 L 80 85 Z" fill="#9C27B0" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M 35 115 L 85 115 L 85 118 Q 60 122 35 118 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* White buttons on dress */}
      <circle cx="60" cy="90" r="2" fill="#FFF" stroke="#1A1A1A" strokeWidth="1" />
      <circle cx="60" cy="100" r="2" fill="#FFF" stroke="#1A1A1A" strokeWidth="1" />
      
      {/* Purple bow tie at chest */}
      <path d="M 50 75 L 46 78 L 50 81 L 54 78 Z" fill="#9C27B0" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 70 75 L 66 78 L 70 81 L 74 78 Z" fill="#9C27B0" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="60" cy="78" r="3" fill="#FFF" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Arms */}
      <ellipse cx="36" cy="92" rx="6" ry="16" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="1.5" />
      <ellipse cx="84" cy="92" rx="6" ry="16" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Carrot in right hand */}
      <path d="M 88 95 L 92 105 L 90 106 L 86 96 Z" fill="#FF6B35" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M 88 93 L 86 90 L 89 89 L 91 90 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1" />
      <path d="M 90 93 L 88 89 L 91 88 L 93 89 Z" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1" />
      
      {/* Legs and feet */}
      <ellipse cx="50" cy="125" rx="6" ry="10" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="1.5" />
      <ellipse cx="70" cy="125" rx="6" ry="10" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="1.5" />
      
      {/* Trapped overlay */}
      {pose === 'trapped' && (
        <g className="animate-trap-bars">
          <rect x="20" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="35" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="50" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="65" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="80" y="10" width="3" height="120" fill="#333" opacity="0.7" />
          <rect x="95" y="10" width="3" height="120" fill="#333" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

// Generic rescue bunny selector by index (0-3)
export function RescueBunny({ 
  index, 
  ...props 
}: { index: number } & RescueBunnyProps) {
  const components = [RosieCharacter, ChesterCharacter, PipCharacter, VioletCharacter];
  const Component = components[index % 4];
  return <Component {...props} />;
}
