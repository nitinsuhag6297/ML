import React from 'react';

interface BankLogoProps {
  bankId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BankLogo: React.FC<BankLogoProps> = ({ bankId, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  }[size];

  const normalized = bankId.toLowerCase();

  if (normalized.includes('sbi') || normalized.includes('state bank')) {
    // State Bank of India - iconic royal blue circle with keyhole cutout
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#280071] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="State Bank of India"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#0082c6" />
          <circle cx="50" cy="50" r="18" fill="#280071" />
          <rect x="44" y="50" width="12" height="42" fill="#280071" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('hdfc')) {
    // HDFC Bank - Navy blue square with central grid and red corner brackets
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#004c8f] p-1.5 shadow-xs shrink-0 ${sizeClasses} ${className}`}
        title="HDFC Bank"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="6" y="6" width="88" height="88" rx="10" fill="#004c8f" />
          <rect x="18" y="18" width="28" height="28" fill="#ed232a" />
          <rect x="54" y="18" width="28" height="28" fill="#ffffff" />
          <rect x="18" y="54" width="28" height="28" fill="#ffffff" />
          <rect x="54" y="54" width="28" height="28" fill="#ed232a" />
          <rect x="38" y="38" width="24" height="24" fill="#004c8f" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('icici')) {
    // ICICI Bank - Maroon badge with the signature flame in orange and white
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#b3282d] p-1.5 shadow-xs shrink-0 ${sizeClasses} ${className}`}
        title="ICICI Bank"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect width="100" height="100" rx="14" fill="#b3282d" />
          <path
            d="M50 14 C68 14 82 28 82 46 C82 66 62 82 50 88 C38 82 18 66 18 46 C18 28 32 14 50 14 Z"
            fill="#f58220"
          />
          <path
            d="M50 24 C62 24 72 34 72 46 C72 60 58 72 50 78 C42 72 28 60 28 46 C28 34 38 24 50 24 Z"
            fill="#ffffff"
          />
          <circle cx="50" cy="38" r="6" fill="#b3282d" />
          <rect x="46" y="48" width="8" height="20" rx="4" fill="#b3282d" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('axis')) {
    // Axis Bank - Burgundy with inverted pyramid mark
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#97144d] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="Axis Bank"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#97144d" />
          <path d="M50 18 L82 78 L64 78 L50 50 L36 78 L18 78 Z" fill="#ffffff" />
          <polygon points="50,32 68,68 32,68" fill="#97144d" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('kotak')) {
    // Kotak Mahindra Bank - Red badge with the infinity ribbon symbol
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#da251d] p-1.5 shadow-xs shrink-0 ${sizeClasses} ${className}`}
        title="Kotak Mahindra Bank"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect width="100" height="100" rx="14" fill="#da251d" />
          <path
            d="M32 50 C22 50 16 42 16 34 C16 26 24 20 34 20 C46 20 52 32 58 40 C64 48 70 60 82 60 C90 60 96 54 96 46 C96 38 90 32 82 32 C74 32 68 40 64 46"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="34" cy="34" r="5" fill="#003366" />
          <circle cx="82" cy="46" r="5" fill="#003366" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('baroda') || normalized.includes('bob')) {
    // Bank of Baroda - Vermilion orange with rising sun symbol
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#f26522] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="Bank of Baroda"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#f26522" />
          <circle cx="50" cy="50" r="30" stroke="#ffffff" strokeWidth="6" />
          <path d="M50 20 L50 34 M50 66 L50 80 M20 50 L34 50 M66 50 L80 50" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="14" fill="#ffffff" />
          <circle cx="50" cy="50" r="8" fill="#f26522" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('punjab') || normalized.includes('pnb')) {
    // Punjab National Bank - PNB Maroon and Gold circle emblem
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#800000] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="Punjab National Bank"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#800000" />
          <circle cx="50" cy="50" r="36" stroke="#fdb913" strokeWidth="7" />
          <rect x="42" y="30" width="16" height="40" rx="3" fill="#ffffff" />
          <circle cx="50" cy="40" r="10" stroke="#800000" strokeWidth="4" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('canara')) {
    // Canara Bank - Intertwined blue & yellow triangles
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#005a9c] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="Canara Bank"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect width="100" height="100" rx="14" fill="#005a9c" />
          <polygon points="30,72 50,28 70,72" fill="#ffd100" />
          <polygon points="50,42 62,68 38,68" fill="#005a9c" />
          <polygon points="45,78 65,34 85,78" fill="none" stroke="#ffffff" strokeWidth="4" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('union')) {
    // Union Bank of India - Interlocking red and blue ribbons
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#00478f] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="Union Bank of India"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#ffffff" stroke="#00478f" strokeWidth="4" />
          <path d="M30 25 L30 55 C30 68 42 78 50 78 C58 78 70 68 70 55 L70 25" stroke="#ed1c24" strokeWidth="8" strokeLinecap="round" />
          <path d="M42 25 L42 55 C42 62 46 66 50 66 C54 66 58 62 58 55 L58 25" stroke="#00478f" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('au small') || normalized.includes('au ')) {
    // AU Small Finance Bank - Deep Violet and Warm Orange
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#582c83] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="AU Small Finance Bank"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#582c83" />
          <circle cx="50" cy="50" r="32" stroke="#f58220" strokeWidth="6" />
          <text x="50" y="58" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="24" fontFamily="sans-serif">AU</text>
        </svg>
      </div>
    );
  }

  if (normalized.includes('lic')) {
    // LIC Housing Finance - Deep ochre/gold & navy
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#003366] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="LIC Housing Finance"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#003366" />
          <circle cx="50" cy="50" r="34" fill="#FBBF24" />
          <path d="M50 25 L65 42 L35 42 Z" fill="#003366" />
          <text x="50" y="66" textAnchor="middle" fill="#003366" fontWeight="900" fontSize="18" fontFamily="sans-serif">LIC</text>
        </svg>
      </div>
    );
  }

  if (normalized.includes('bajaj')) {
    // Bajaj Housing Finance - Royal blue & white
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#004B87] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="Bajaj Housing Finance"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#004B87" />
          <circle cx="50" cy="50" r="36" stroke="#FFFFFF" strokeWidth="6" />
          <text x="50" y="62" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontSize="26" fontFamily="sans-serif">B</text>
        </svg>
      </div>
    );
  }

  if (normalized.includes('tata')) {
    // Tata Capital Housing - Classic Tata cyan & navy
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#002244] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="Tata Capital"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#002244" />
          <text x="50" y="58" textAnchor="middle" fill="#00B4D8" fontWeight="900" fontSize="22" fontFamily="sans-serif">TATA</text>
        </svg>
      </div>
    );
  }

  if (normalized.includes('pm awas') || normalized.includes('clss')) {
    // PM Awas Yojana CLSS - Tricolor Govt scheme badge
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#1E3A8A] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="PMAY CLSS"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#1E3A8A" />
          <path d="M50 20 L80 46 L20 46 Z" fill="#F97316" />
          <rect x="32" y="46" width="36" height="34" fill="#FFFFFF" />
          <rect x="44" y="58" width="12" height="22" fill="#15803D" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('national housing') || normalized.includes('nhb')) {
    // National Housing Bank - Apex regulator badge
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#0F766E] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="National Housing Bank"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#0F766E" />
          <circle cx="50" cy="50" r="32" stroke="#FEF08A" strokeWidth="5" />
          <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontSize="20" fontFamily="sans-serif">NHB</text>
        </svg>
      </div>
    );
  }

  if (normalized.includes('navi')) {
    // Navi Housing - Modern mint & black digital fintech mark
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#052E16] p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
        title="Navi Housing"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect width="100" height="100" rx="14" fill="#052E16" />
          <circle cx="50" cy="50" r="34" fill="#22C55E" />
          <text x="50" y="60" textAnchor="middle" fill="#052E16" fontWeight="900" fontSize="24" fontFamily="sans-serif">N</text>
        </svg>
      </div>
    );
  }

  if (normalized.includes('loanlens')) {
    // LoanLens Custom Emblem
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#0D9488] p-1.5 shadow-md text-white shrink-0 ${sizeClasses} ${className}`}
        title="LoanLens"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="42" stroke="#2DD4BF" strokeWidth="5" strokeDasharray="18 4" opacity="0.9" />
          <circle cx="50" cy="50" r="32" fill="#0E7490" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="2.5" />
          <path d="M50 24 L68 44 L56 44 L56 70 L44 70 L44 44 L32 44 Z" fill="#2DD4BF" />
          <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
          <line x1="16" y1="50" x2="26" y2="50" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <line x1="74" y1="50" x2="84" y2="50" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="16" x2="50" y2="26" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="74" x2="50" y2="84" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Dynamic Institution Monogram Fallback for any other institution
  const initials = bankId
    .split(/[\s\-_()]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(w => w[0].toUpperCase())
    .join('') || 'BK';

  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-1.5 shadow-xs text-white shrink-0 ${sizeClasses} ${className}`}
      title={bankId}
    >
      <span className="font-black tracking-wider text-[11px] font-mono text-teal-300">
        {initials}
      </span>
    </div>
  );
};
