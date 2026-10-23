import React from 'react';

interface DoodleProps {
  className?: string;
  size?: number | string;
}

/**
 * Hand-drawn style cute Piggy Bank with a floating ₹ Rupee Coin
 */
export const DoodlePiggyBank: React.FC<DoodleProps> = ({ className = '', size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Shadow */}
    <ellipse cx="50" cy="88" rx="32" ry="5" fill="#E2E8F0" />
    
    {/* Floating Coin above slot */}
    <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
      <circle cx="50" cy="18" r="9" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" strokeDasharray="0.5 0.5" />
      <text x="50" y="22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#854D0E" fontFamily="sans-serif">₹</text>
    </g>

    {/* Piggy Body */}
    <path
      d="M30 38 C18 38 14 50 14 62 C14 74 24 82 40 82 L65 82 C82 82 88 72 88 60 C88 46 76 38 60 38 Z"
      fill="#FECDD3"
      stroke="#E11D48"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Coin Slot */}
    <rect x="42" y="36" width="16" height="3.5" rx="1.75" fill="#9F1239" />

    {/* Snout */}
    <ellipse cx="86" cy="60" rx="6" ry="9" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" />
    <circle cx="85" cy="58" r="1.5" fill="#9F1239" />
    <circle cx="85" cy="63" r="1.5" fill="#9F1239" />

    {/* Eye */}
    <circle cx="70" cy="50" r="3" fill="#881337" />
    <circle cx="71" cy="49" r="1" fill="#FFFFFF" />

    {/* Rosy Cheek */}
    <circle cx="70" cy="62" r="4.5" fill="#FB7185" opacity="0.6" />

    {/* Ear */}
    <path
      d="M56 38 C56 26 66 26 68 36 Z"
      fill="#FDA4AF"
      stroke="#E11D48"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Legs */}
    <rect x="28" y="78" width="8" height="9" rx="3" fill="#FECDD3" stroke="#E11D48" strokeWidth="2" />
    <rect x="62" y="78" width="8" height="9" rx="3" fill="#FECDD3" stroke="#E11D48" strokeWidth="2" />

    {/* Little curly tail */}
    <path
      d="M14 62 C10 60 8 64 10 67 C11 69 13 67 12 65"
      stroke="#E11D48"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/**
 * Hand-drawn Cute Bank Building with Columns and ₹ Emblem
 */
export const DoodleBankBuilding: React.FC<DoodleProps> = ({ className = '', size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Ground Shadow */}
    <ellipse cx="50" cy="90" rx="42" ry="4" fill="#CBD5E1" opacity="0.6" />

    {/* Base Steps */}
    <rect x="10" y="80" width="80" height="7" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="2.2" />
    <rect x="14" y="74" width="72" height="6" rx="2" fill="#F1F5F9" stroke="#475569" strokeWidth="2" />

    {/* Triangular Pediment / Roof */}
    <path
      d="M12 36 L50 14 L88 36 Z"
      fill="#E0E7FF"
      stroke="#4338CA"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Center Rupee Coin on Pediment */}
    <circle cx="50" cy="27" r="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.8" />
    <text x="50" y="30.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#854D0E" fontFamily="sans-serif">₹</text>

    {/* Roof Trim */}
    <rect x="10" y="36" width="80" height="5" rx="1.5" fill="#C7D2FE" stroke="#4338CA" strokeWidth="2" />

    {/* 4 Pillars */}
    <rect x="19" y="41" width="9" height="33" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
    <rect x="36" y="41" width="9" height="33" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
    <rect x="55" y="41" width="9" height="33" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
    <rect x="72" y="41" width="9" height="33" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />

    {/* Little Bank Door in Center */}
    <path d="M47 54 C47 50 53 50 53 54 L53 74 L47 74 Z" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="1.5" />
  </svg>
);

/**
 * Hand-drawn Golden Rupee Coin with Sparkles
 */
export const DoodleRupeeCoin: React.FC<DoodleProps> = ({ className = '', size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Glow / Sparkle lines */}
    <path d="M50 8 L50 14" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M82 22 L77 27" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M92 50 L86 50" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 22 L23 27" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M8 50 L14 50" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

    {/* Coin Outer Ring */}
    <circle cx="50" cy="54" r="34" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
    <circle cx="50" cy="54" r="28" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="3 3" />

    {/* Rupee Symbol */}
    <text
      x="50"
      y="67"
      textAnchor="middle"
      fontSize="36"
      fontWeight="800"
      fill="#854D0E"
      fontFamily="sans-serif"
    >
      ₹
    </text>

    {/* Cute shine mark */}
    <path
      d="M32 38 C36 32 44 28 52 28"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

/**
 * Hand-drawn Cute Wallet with Cards & Notes
 */
export const DoodleWallet: React.FC<DoodleProps> = ({ className = '', size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Currency Note peeking out */}
    <rect x="24" y="20" width="46" height="26" rx="3" fill="#A7F3D0" stroke="#059669" strokeWidth="2" transform="rotate(-6 24 20)" />
    <circle cx="48" cy="30" r="4" fill="#6EE7B7" stroke="#059669" strokeWidth="1" />

    {/* Card peeking out */}
    <rect x="36" y="22" width="42" height="24" rx="3" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" transform="rotate(4 36 22)" />
    <rect x="42" y="27" width="12" height="4" rx="1" fill="#38BDF8" transform="rotate(4 36 22)" />

    {/* Main Wallet Body */}
    <rect x="14" y="38" width="72" height="48" rx="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="2.5" />
    <path d="M14 48 L86 48" stroke="#FDBA74" strokeWidth="2" strokeDasharray="2 2" />

    {/* Wallet Flap & Clasp */}
    <path
      d="M62 52 H86 C88 52 90 54 90 56 V68 C90 70 88 72 86 72 H62 C58 72 56 70 56 68 V56 C56 54 58 52 62 52 Z"
      fill="#FB923C"
      stroke="#EA580C"
      strokeWidth="2"
    />
    <circle cx="68" cy="62" r="3.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />

    {/* Stitching */}
    <path d="M18 42 L82 42" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
  </svg>
);

/**
 * Hand-drawn Cute Calculator with smiling pastel screen
 */
export const DoodleCalculator: React.FC<DoodleProps> = ({ className = '', size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Body */}
    <rect x="20" y="12" width="60" height="76" rx="12" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2.5" />

    {/* Screen */}
    <rect x="28" y="22" width="44" height="20" rx="5" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
    <text x="66" y="36" textAnchor="end" fontSize="12" fontWeight="bold" fill="#065F46" fontFamily="monospace">
      % 8.65
    </text>

    {/* Cute smile on screen */}
    <circle cx="34" cy="30" r="1.5" fill="#047857" />
    <circle cx="40" cy="30" r="1.5" fill="#047857" />
    <path d="M35 34 Q37 36 39 34" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" fill="none" />

    {/* Keypad Buttons */}
    {/* Row 1 */}
    <rect x="28" y="48" width="10" height="8" rx="2" fill="#FECDD3" stroke="#E11D48" strokeWidth="1.5" />
    <rect x="42" y="48" width="10" height="8" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
    <rect x="56" y="48" width="16" height="8" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />

    {/* Row 2 */}
    <rect x="28" y="60" width="10" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
    <rect x="42" y="60" width="10" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
    <rect x="56" y="60" width="10" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />

    {/* Row 3 */}
    <rect x="28" y="72" width="10" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
    <rect x="42" y="72" width="10" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
    <rect x="56" y="72" width="16" height="8" rx="2" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
  </svg>
);

/**
 * Hand-drawn Approval Stamp with Ribbon
 */
export const DoodleApprovalBadge: React.FC<DoodleProps> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Ribbons */}
    <path d="M38 68 L28 92 L46 84 L52 92 L46 68 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2" strokeLinejoin="round" />
    <path d="M62 68 L72 92 L54 84 L48 92 L54 68 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2" strokeLinejoin="round" />

    {/* Rosette Body */}
    <circle cx="50" cy="46" r="32" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
    <circle cx="50" cy="46" r="26" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="3 3" />

    {/* Checkmark */}
    <path
      d="M38 46 L46 54 L62 36"
      stroke="#047857"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Hand-drawn Bank Handshake Artwork featuring trusted borrower and lender agreement
 * with bank columns, rupee sparkles, and pastel tones
 */
export const DoodleBankHandshake: React.FC<DoodleProps> = ({ className = '', size = 320 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 400 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block max-w-full h-auto ${className}`}
  >
    {/* Soft ambient background glow aura */}
    <rect x="20" y="20" width="360" height="280" rx="28" fill="#F0FDF4" opacity="0.6" />
    <circle cx="200" cy="160" r="120" fill="#E0F2FE" opacity="0.5" />
    <circle cx="320" cy="80" r="40" fill="#FEF08A" opacity="0.4" />

    {/* Background Bank Building Silhouette */}
    <g opacity="0.45">
      <path d="M140 70 L200 40 L260 70 Z" fill="#C7D2FE" stroke="#4338CA" strokeWidth="2" />
      <rect x="145" y="70" width="110" height="6" rx="2" fill="#A5B4FC" />
      <rect x="156" y="76" width="10" height="34" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
      <rect x="180" y="76" width="10" height="34" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
      <rect x="208" y="76" width="10" height="34" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
      <rect x="232" y="76" width="10" height="34" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
      <rect x="142" y="110" width="116" height="6" rx="2" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
    </g>

    {/* Floating Rupee Coins and Sparkles */}
    <g>
      {/* Top Left Coin */}
      <circle cx="90" cy="75" r="18" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
      <circle cx="90" cy="75" r="14" fill="#FDE047" stroke="#EAB308" strokeWidth="1" strokeDasharray="2 2" />
      <text x="90" y="82" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#854D0E" fontFamily="sans-serif">₹</text>

      {/* Top Right Coin */}
      <circle cx="315" cy="95" r="15" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
      <text x="315" y="101" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#854D0E" fontFamily="sans-serif">₹</text>

      {/* Sparkles */}
      <path d="M85 40 L88 48 L96 51 L88 54 L85 62 L82 54 L74 51 L82 48 Z" fill="#F59E0B" />
      <path d="M330 50 L332 56 L338 58 L332 60 L330 66 L328 60 L322 58 L328 56 Z" fill="#14B8A6" />
    </g>

    {/* Center Trusted Handshake Graphic */}
    <g transform="translate(45, 75)">
      {/* Left Arm / Sleeve (Borrower - Teal Pastel Cuff) */}
      <path
        d="M20 120 L75 90 C85 85 95 88 102 96 L120 114 L95 145 L35 155 Z"
        fill="#0D9488"
        stroke="#115E59"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="65" y="82" width="12" height="42" rx="3" fill="#99F6E4" stroke="#0D9488" strokeWidth="2" transform="rotate(-30 65 82)" />
      {/* Left Hand & Fingers */}
      <path
        d="M102 96 L140 115 C146 118 148 126 144 132 L138 140 C134 146 126 148 120 144 L95 130 Z"
        fill="#FED7AA"
        stroke="#EA580C"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Right Arm / Sleeve (Bank Underwriter - Navy / Slate Cuff) */}
      <path
        d="M290 120 L235 90 C225 85 215 88 208 96 L190 114 L215 145 L275 155 Z"
        fill="#1E3E62"
        stroke="#0B192C"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="235" y="76" width="12" height="42" rx="3" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" transform="rotate(30 235 76)" />
      {/* Right Hand Clasp */}
      <path
        d="M208 96 L170 115 C164 118 162 126 166 132 L172 140 C176 146 184 148 190 144 L215 130 Z"
        fill="#FDBA74"
        stroke="#EA580C"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Interlocked Fingers */}
      <path
        d="M135 112 C145 106 160 106 170 112 C178 118 178 130 170 136 C160 144 145 144 135 136 C128 130 128 118 135 112 Z"
        fill="#FFEDD5"
        stroke="#EA580C"
        strokeWidth="3"
      />
      <path d="M142 120 L163 120" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M140 127 L165 127" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />

      {/* Mutual Trust Heart & Shield Accent above handshake */}
      <circle cx="155" cy="78" r="22" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
      <path
        d="M155 70 C151 66 145 67 145 73 C145 80 155 86 155 86 C155 86 165 80 165 73 C165 67 159 66 155 70 Z"
        fill="#10B981"
      />
    </g>
  </svg>
);


