import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  imageSrc: string;
  title: string;
  caption?: string;
  counterText?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function LightboxModal({
  isOpen,
  imageSrc,
  title,
  caption,
  counterText,
  onClose,
  onPrev,
  onNext,
}: LightboxModalProps) {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-[#0F172A]/90 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
          const diff = touchStartX.current - endX;
          if (diff > 45 && onNext) onNext();
          if (diff < -45 && onPrev) onPrev();
          touchStartX.current = null;
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-[#1C2A44] truncate">
                {title}
              </h3>
              {counterText && (
                <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-md bg-slate-100 text-[#1C2A44] shrink-0">
                  {counterText}
                </span>
              )}
            </div>
            {caption && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{caption}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau gambar"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative bg-slate-100 flex items-center justify-center max-h-[82vh] overflow-auto">
          <img
            src={imageSrc}
            alt={title}
            referrerPolicy="no-referrer"
            className="max-h-[80vh] max-w-full w-auto object-contain mx-auto"
          />

          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="Gambar sebelumnya"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 text-[#1C2A44] shadow-md hover:bg-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label="Gambar berikutnya"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 text-[#1C2A44] shadow-md hover:bg-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
