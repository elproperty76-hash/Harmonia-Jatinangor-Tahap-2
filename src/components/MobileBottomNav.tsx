import { Building2, Images, MapPin, TrendingUp, CalendarCheck } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  onBookingClick: () => void;
}

const ITEMS = [
  { href: '#unit-denah', id: 'unit-denah', label: 'Unit', Icon: Building2 },
  { href: '#galeri', id: 'galeri', label: 'Galeri', Icon: Images },
  { href: '#lokasi', id: 'lokasi', label: 'Lokasi', Icon: MapPin },
  { href: '#estimasi-roi', id: 'estimasi-roi', label: 'ROI', Icon: TrendingUp },
] as const;

export function MobileBottomNav({ activeSection, onBookingClick }: MobileBottomNavProps) {
  const isBookingActive = activeSection === 'booking';

  return (
    <nav
      aria-label="Navigasi Cepat Smartphone"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] px-2 py-1.5"
    >
      <div className="grid grid-cols-5 items-center gap-1 max-w-md mx-auto">
        {ITEMS.map(({ href, id, label, Icon }) => {
          const isActive = activeSection === id;
          return (
            <a
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center min-h-[48px] rounded-lg px-1 py-1 text-[11px] font-semibold transition-colors ${
                isActive
                  ? 'text-[#1C2A44] bg-[#F2BA36]/20'
                  : 'text-slate-600 hover:text-[#1C2A44]'
              }`}
            >
              <Icon
                className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#1C2A44]' : 'text-slate-500'}`}
                aria-hidden="true"
              />
              <span>{label}</span>
            </a>
          );
        })}

        <button
          type="button"
          onClick={onBookingClick}
          className={`flex flex-col items-center justify-center min-h-[48px] rounded-lg px-1 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
            isBookingActive
              ? 'bg-[#F2BA36] text-[#1C2A44]'
              : 'bg-[#1C2A44] text-white hover:bg-[#142035]'
          }`}
        >
          <CalendarCheck
            className={`w-4 h-4 mb-0.5 ${isBookingActive ? 'text-[#1C2A44]' : 'text-[#F2BA36]'}`}
            aria-hidden="true"
          />
          <span>Booking</span>
        </button>
      </div>
    </nav>
  );
}
