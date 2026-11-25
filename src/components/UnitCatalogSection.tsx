import { useState } from 'react';
import { PDF_UNITS, type UnitDetail } from '../data/pdfContent';
import { ROI_SPECS_BY_BLOCK, type BlockId } from '../utils/bookingLogic';
import { Maximize2, ArrowRight, BedDouble, Bath, Ruler, Building2, CheckSquare } from 'lucide-react';

interface UnitCatalogSectionProps {
  selectedBlock: BlockId;
  onSelectBlock: (blockId: BlockId) => void;
  onBookBlock: (blockId: BlockId) => void;
  onOpenLightbox: (src: string, title: string, caption?: string) => void;
}

export function UnitCatalogSection({
  selectedBlock,
  onSelectBlock,
  onBookBlock,
  onOpenLightbox,
}: UnitCatalogSectionProps) {
  const [viewMode, setViewMode] = useState<'foto' | 'denah'>('foto');

  const activeUnit: UnitDetail =
    PDF_UNITS.find((u) => u.id === selectedBlock) || PDF_UNITS[0];
  const roiSpec = ROI_SPECS_BY_BLOCK[activeUnit.blockLetter];

  return (
    <section id="unit-denah" className="py-14 lg:py-20 bg-white border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
              Pilihan Tipe Unit &amp; Denah Lantai
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              Blok A (Ayman) hingga Blok H (Harmonia) lengkap dengan gambar fasad, interior, spesifikasi unit, serta denah lantai asli.
            </p>
            <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />
          </div>

          <div
            role="tablist"
            aria-label="Mode tampilan unit"
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'foto'}
              onClick={() => setViewMode('foto')}
              className={`px-4 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'foto'
                  ? 'bg-white text-[#1C2A44] shadow-xs'
                  : 'text-slate-600 hover:text-[#1C2A44]'
              }`}
            >
              Foto Unit
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'denah'}
              onClick={() => setViewMode('denah')}
              className={`px-4 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'denah'
                  ? 'bg-white text-[#1C2A44] shadow-xs'
                  : 'text-slate-600 hover:text-[#1C2A44]'
              }`}
            >
              Denah Lantai
            </button>
          </div>
        </div>

        {/* Unit Selector Tabs (Scrollable on mobile, clean grid/wrap on desktop) */}
        <div
          role="tablist"
          aria-label="Pilih Blok Unit"
          className="flex items-center gap-2 overflow-x-auto pb-2 w-full max-w-full min-w-0 sm:flex-wrap"
        >
          {PDF_UNITS.map((unit) => {
            const isActive = unit.id === activeUnit.id;
            return (
              <button
                key={unit.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectBlock(unit.id)}
                className={`px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1C2A44] text-white border-[#1C2A44]'
                    : 'bg-[#FAFAFA] text-[#1C2A44] border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {unit.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Selected Unit Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left: Photos or Floorplan */}
          <div className="lg:col-span-7 space-y-4 min-w-0">
            {viewMode === 'foto' ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenLightbox(activeUnit.photos.main, activeUnit.title, activeUnit.subtitle)
                    }
                    className="group relative block w-full h-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 text-left cursor-pointer"
                  >
                    <img
                      src={activeUnit.photos.main}
                      alt={`${activeUnit.title} Tampak Eksterior`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full min-h-[300px] sm:min-h-[360px] object-cover"
                    />
                    <span className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/90 text-[#1C2A44] shadow-sm opacity-90 group-hover:opacity-100">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </button>
                </div>

                <div className="sm:col-span-6 flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenLightbox(activeUnit.photos.top, `${activeUnit.title} — Interior`, activeUnit.subtitle)
                    }
                    className="group relative block w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={activeUnit.photos.top}
                      alt={`${activeUnit.title} Interior Kamar`}
                      referrerPolicy="no-referrer"
                      className="w-full h-[172px] object-cover"
                    />
                    <span className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 text-[#1C2A44] shadow-sm">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenLightbox(activeUnit.photos.bottom, `${activeUnit.title} — Kamar Mandi`, activeUnit.subtitle)
                    }
                    className="group relative block w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={activeUnit.photos.bottom}
                      alt={`${activeUnit.title} Kamar Mandi`}
                      referrerPolicy="no-referrer"
                      className="w-full h-[172px] object-cover"
                    />
                    <span className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 text-[#1C2A44] shadow-sm">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAFAFA] border border-slate-200 rounded-xl p-4 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1C2A44]">
                      {activeUnit.denahTitle} — <span className="italic">{activeUnit.denahSubTitle}</span>
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{activeUnit.denahDescription}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenLightbox(
                        activeUnit.denahImage,
                        `${activeUnit.denahTitle} ${activeUnit.denahSubTitle}`,
                        activeUnit.denahDescription,
                      )
                    }
                    className="px-3 py-2 min-h-[40px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C2A44] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shrink-0 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Perbesar</span>
                  </button>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-3 flex justify-center">
                  <img
                    src={activeUnit.denahImage}
                    alt={`${activeUnit.denahTitle} ${activeUnit.denahSubTitle}`}
                    referrerPolicy="no-referrer"
                    className="max-h-[480px] w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Verbatim Specifications & ROI Snapshot */}
          <div className="lg:col-span-5 min-w-0 bg-[#FAFAFA] border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>{activeUnit.unitCount} Unit Tersedia di Siteplan</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{activeUnit.unitRange}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1C2A44]">
                {activeUnit.title}
              </h3>
              <p className="text-base font-medium text-[#1C2A44]/85">{activeUnit.subtitle}</p>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">{activeUnit.description}</p>

            {/* Spesifikasi Unit verbatim */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="text-sm font-bold text-[#1C2A44]">Spesifikasi Unit</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2.5 bg-white p-3 rounded-lg border border-slate-200">
                  <Ruler className="w-4 h-4 text-[#1C2A44] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] text-slate-500">Luas Tanah</p>
                    <p className="font-semibold text-[#1C2A44] font-mono tabular-nums">
                      {activeUnit.luasTanah}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white p-3 rounded-lg border border-slate-200">
                  <Building2 className="w-4 h-4 text-[#1C2A44] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] text-slate-500">Luas Bangunan</p>
                    <p className="font-semibold text-[#1C2A44] font-mono tabular-nums">
                      {activeUnit.luasBangunan}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white p-3 rounded-lg border border-slate-200">
                  <BedDouble className="w-4 h-4 text-[#1C2A44] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] text-slate-500">
                      {activeUnit.lantaiLabel ? 'Bangunan' : 'Kapasitas'}
                    </p>
                    <p className="font-semibold text-[#1C2A44]">
                      {activeUnit.lantaiLabel || activeUnit.kamarTidur}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white p-3 rounded-lg border border-slate-200">
                  <Bath className="w-4 h-4 text-[#1C2A44] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] text-slate-500">Sanitair</p>
                    <p className="font-semibold text-[#1C2A44]">{activeUnit.kamarMandi}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#1C2A44] pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#D9A024]" aria-hidden="true" />
                  Full Furnished
                </span>
                {activeUnit.extraFeature && (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-[#D9A024]" aria-hidden="true" />
                    {activeUnit.extraFeature}
                  </span>
                )}
              </div>
            </div>

            {/* Estimasi Nilai & ROI Ringkas */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[11px] text-slate-500">Nilai Investasi</p>
                <p className="text-sm font-bold text-[#1C2A44] font-mono tabular-nums mt-0.5">
                  {roiSpec.nilaiInvestasiLabel}
                </p>
              </div>
              <div className="border-x border-slate-200">
                <p className="text-[11px] text-slate-500">Net Profit / Bulan</p>
                <p className="text-sm font-bold text-[#1C2A44] font-mono tabular-nums mt-0.5">
                  {roiSpec.netProfitBulanLabel}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">ROI Total</p>
                <p className="text-sm font-bold text-[#1C2A44] font-mono tabular-nums mt-0.5">
                  {roiSpec.roiTotalLabel}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onBookBlock(activeUnit.id)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] bg-[#F2BA36] hover:bg-[#e5ad27] text-[#1C2A44] text-sm font-bold rounded-lg transition-colors cursor-pointer"
              >
                <span>Booking Unit {activeUnit.tabLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'foto' ? 'denah' : 'foto')}
                className="px-4 py-3 min-h-[44px] border border-slate-300 bg-white hover:bg-slate-50 text-[#1C2A44] text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {viewMode === 'foto' ? 'Lihat Denah' : 'Lihat Foto'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
