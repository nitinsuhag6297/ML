import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export type ModalThemeVariant = 'default' | 'lavender' | 'sky' | 'mint' | 'peach' | 'yellow' | 'coral';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  variant?: ModalThemeVariant;
  doodleIcon?: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '3xl',
  variant = 'default',
  doodleIcon,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  }[maxWidth as '3xl'] || 'max-w-3xl';

  const variantStyles: Record<ModalThemeVariant, { header: string; border: string; title: string }> = {
    default: {
      header: 'bg-slate-50/80 border-slate-100',
      border: 'border-slate-200',
      title: 'text-slate-900',
    },
    lavender: {
      header: 'bg-gradient-to-r from-[#EDE9FE] to-[#F5F3FF] border-[#DDD6FE]',
      border: 'border-[#DDD6FE]',
      title: 'text-[#4C1D95]',
    },
    sky: {
      header: 'bg-gradient-to-r from-[#E0F2FE] to-[#F0F9FF] border-[#BAE6FD]',
      border: 'border-[#BAE6FD]',
      title: 'text-[#0369A1]',
    },
    mint: {
      header: 'bg-gradient-to-r from-[#D1FAE5] to-[#ECFDF5] border-[#A7F3D0]',
      border: 'border-[#A7F3D0]',
      title: 'text-[#065F46]',
    },
    peach: {
      header: 'bg-gradient-to-r from-[#FFEDD5] to-[#FFF7ED] border-[#FED7AA]',
      border: 'border-[#FED7AA]',
      title: 'text-[#9A3412]',
    },
    yellow: {
      header: 'bg-gradient-to-r from-[#FEF9C3] to-[#FEFCE8] border-[#FEF08A]',
      border: 'border-[#FEF08A]',
      title: 'text-[#854D0E]',
    },
    coral: {
      header: 'bg-gradient-to-r from-[#FFE4E6] to-[#FFF1F2] border-[#FECDD3]',
      border: 'border-[#FECDD3]',
      title: 'text-[#9F1239]',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${maxWidthClass} max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border ${currentVariant.border} overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`flex items-start justify-between px-6 py-4.5 border-b ${currentVariant.header}`}>
          <div className="flex items-center gap-3">
            {doodleIcon && <div className="shrink-0">{doodleIcon}</div>}
            <div>
              <h3 className={`text-lg font-bold tracking-tight ${currentVariant.title}`}>{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
