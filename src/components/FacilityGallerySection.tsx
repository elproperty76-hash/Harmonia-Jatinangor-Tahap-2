import { PDF_GALLERY } from '../data/pdfContent';
import { Bus, Trees, Camera, Shield, Maximize2 } from 'lucide-react';
import { PDF_SITEPLAN } from '../data/pdfContent';
import { useState } from 'react';

interface FacilityGallerySectionProps {
  onOpenLightboxByIndex: (index: number) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Semua Galeri' },
  { id: 'kawasan', label: 'Kawasan & Gerbang' },
  { id: 'ruko', label: 'Ruko & Area Masjid' },
  { id: 'interior', label: 'Interior & Kamar' },
] as const;

const FACILITY_ICONS = [Bus, Trees, Camera, Shield];

export function FacilityGallerySection({
  onOpenLightboxByIndex,
}: FacilityGallerySectionProps) {
  const [filter, setFilter] = useState<'all' | 'kawasan' | 'ruko' | 'interior'>('all');

  const filteredItems =
    filter === 'all'
      ? PDF_GALLERY
      : PDF_GALLERY.filter((item) => item.category === filter);

  const categoryCounts = {
    all: PDF_GALLERY.length,
    kawasan: PDF_GALLERY.filter((i) => i.category === 'kawasan').length,
    ruko: PDF_GALLERY.filter((i) => i.category === 'ruko').length,
    interior: PDF_GALLERY.filter((i) => i.category === 'interior').length,
  };

  return (
    <section id="galeri" className="py-12 lg:py-20 bg-[#FAFAFA] border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
              Galeri Fasilitas Kawasan &amp; Interior Unit
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              Visualisasi asli kawasan Harmonia Student House Jatinangor dalam resolusi dan proporsi asli PDF: gerbang One Gate System, shuttle bus, ruko komersial, taman terbuka, serta kamar siap huni.
            </p>
            <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />
          </div>

          <div
            role="tablist"
            aria-label="Filter kategori galeri"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-slate-200/70 rounded-lg self-start w-full sm:w-auto max-w-full min-w-0"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={filter === cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === cat.id
                    ? 'bg-white text-[#1C2A44] shadow-xs'
                    : 'text-slate-600 hover:text-[#1C2A44]'
                }`}
              >
                {cat.label}{' '}
                <span className="font-mono text-[11px] opacity-75">
                  ({categoryCounts[cat.id]})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Fasilitas Kawasan Strip (Page 30 verbatim) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {PDF_SITEPLAN.facilities.map((facility, idx) => {
            const Icon = FACILITY_ICONS[idx % FACILITY_ICONS.length];
            return (
              <div
                key={facility}
                className="bg-white border border-slate-200 rounded-xl px-3.5 sm:px-4 py-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1C2A44]/5 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#1C2A44]" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1C2A44]">{facility}</span>
              </div>
            );
          })}
        </div>

        {/* Uncropped Natural-Aspect Responsive Masonry Gallery preserving exact PDF image proportions & resolution */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
          {filteredItems.map((item) => {
            const globalIndex = PDF_GALLERY.findIndex((g) => g.id === item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenLightboxByIndex(globalIndex)}
                className="group break-inside-avoid w-full block rounded-xl overflow-hidden border border-slate-200 bg-white text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A44] shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="relative w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.015]"
                  />
                  <span className="sm:hidden absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/90 text-[#1C2A44] text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs">
                    <Maximize2 className="w-3 h-3" aria-hidden="true" />
                    <span>Perbesar</span>
                  </span>
                </div>
                <div className="p-3.5 flex items-center justify-between gap-3 bg-white">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1C2A44] leading-snug">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                      Halaman {item.pageRef} · {item.width}×{item.height}px Asli PDF
                    </p>
                  </div>
                  <Maximize2
                    className="hidden sm:block w-4 h-4 text-slate-400 group-hover:text-[#1C2A44] shrink-0"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
