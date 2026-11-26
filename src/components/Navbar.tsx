import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Building2,
  Images,
  MapPin,
  TrendingUp,
  Info,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';
import { buildOfficialWhatsappUrl } from '../utils/bookingLogic';
import { WhatsappIcon } from './WhatsappIcon';

interface NavbarProps {
  activeSection: string;
  onBookingClick: () => void;
}

const NAV_LINKS = [
  { href: '#tentang', id: 'tentang', label: 'Tentang', desc: 'Profil & Keunggulan Tahap 2', Icon: Info },
  { href: '#unit-denah', id: 'unit-denah', label: 'Unit & Denah', desc: 'Tipe Blok A–H & Denah Lantai', Icon: Building2 },
  { href: '#galeri', id: 'galeri', label: 'Galeri', desc: 'Fasilitas Kawasan & Interior', Icon: Images },
  { href: '#lokasi', id: 'lokasi', label: 'Lokasi', desc: 'Peta Interaktif & Akses Kampus', Icon: MapPin },
  { href: '#legalitas', id: 'legalitas', label: 'Legalitas', desc: 'Kepemilikan SHM & PBG', Icon: ShieldCheck },
  { href: '#estimasi-roi', id: 'estimasi-roi', label: 'Estimasi ROI', desc: 'Simulasi Keuntungan & BEP', Icon: TrendingUp },
];

const GENERAL_WA_URL = buildOfficialWhatsappUrl(
  'Assalamualaikum Tim Harmonia Student House Jatinangor, saya ingin konsultasi mengenai Ekspansi Tahap 2.',
);

export function Navbar({ activeSection, onBookingClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 md:gap-6">
        <a
          href="#top"
          className="text-sm sm:text-lg font-bold tracking-tight text-[#1C2A44] whitespace-nowrap min-w-0 truncate focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1C2A44]"
        >
          Harmonia Student House
        </a>

        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.filter((l) => l.id !== 'legalitas').map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`hover:text-[#1C2A44] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-[#1C2A44] font-semibold border-[#F2BA36]'
                    : 'border-transparent hover:border-[#F2BA36]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <a
            href={GENERAL_WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi WhatsApp"
            title="Hubungi via WhatsApp"
            className="inline-flex items-center justify-center w-10 h-10 min-h-[40px] min-w-[40px] text-[#15803D] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
          >
            <WhatsappIcon className="w-5 h-5" />
          </a>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onBookingClick();
            }}
            className="px-2.5 py-2 sm:px-4 sm:py-2.5 min-h-[40px] text-xs sm:text-sm font-semibold text-[#1C2A44] bg-[#F2BA36] hover:bg-[#e5ad27] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A44]"
          >
            Booking Unit
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1C2A44] rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Navigasi Mobile"
          className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1.5 shadow-lg max-h-[75vh] overflow-y-auto"
        >
          {NAV_LINKS.map(({ href, id, label, desc, Icon }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 min-h-[48px] rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#1C2A44]/5 border border-[#1C2A44]/15 text-[#1C2A44]'
                    : 'hover:bg-slate-50 text-[#1C2A44]'
                }`}
              >
                <span className="w-9 h-9 rounded-lg bg-[#FAFAFA] border border-slate-200 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#1C2A44]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-tight">{label}</span>
                  <span className="block text-xs text-slate-500 truncate mt-0.5">{desc}</span>
                </span>
              </a>
            );
          })}

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <a
              href={GENERAL_WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[46px] bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl"
            >
              <WhatsappIcon className="w-5 h-5" />
              <span>Chat WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onBookingClick();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[46px] bg-[#1C2A44] text-white text-sm font-bold rounded-xl cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-[#F2BA36]" aria-hidden="true" />
              <span>Cek Ketersediaan &amp; Booking Unit</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
