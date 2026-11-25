import { useState } from 'react';
import {
  PDF_OWNERSHIP,
  PDF_LEGAL,
  PDF_SPEC_BANGUNAN,
  PDF_SPEC_INTERIOR,
  PDF_ROI,
  PDF_OKUPANSI,
} from '../data/pdfContent';
import {
  ROI_SPECS_BY_BLOCK,
  calculateInvestmentProjection,
  type BlockId,
} from '../utils/bookingLogic';
import { FileText, Handshake, Scale, Maximize2, Check, Globe, Share2, Sparkles } from 'lucide-react';

interface SpecsLegalRoiSectionProps {
  onOpenLightbox: (src: string, title: string, caption?: string) => void;
  onBookBlock: (blockId: BlockId) => void;
}

const PILLAR_ICONS = [FileText, Handshake, Scale];
const OKUPANSI_ICONS = [Globe, Share2, Sparkles];

export function SpecsLegalRoiSection({
  onOpenLightbox,
  onBookBlock,
}: SpecsLegalRoiSectionProps) {
  const [specTab, setSpecTab] = useState<'bangunan' | 'interior'>('bangunan');
  const [simBlock, setSimBlock] = useState<BlockId>('G1');
  const [simCount, setSimCount] = useState<number>(1);

  const simProjection = calculateInvestmentProjection(simBlock, simCount);
  const allRoiBlocks = Object.values(ROI_SPECS_BY_BLOCK);

  return (
    <>
      {/* Sistem Kepemilikan Mudah & Legalitas (Pages 5, 6, 7 verbatim) */}
      <section id="legalitas" className="py-14 lg:py-20 bg-[#FAFAFA] border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
                {PDF_OWNERSHIP.title}
              </h2>
              <p className="text-slate-600 text-[15px] leading-relaxed">
                {PDF_OWNERSHIP.description}
              </p>
              <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />
            </div>

            <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-200 bg-white">
              <img
                src={PDF_OWNERSHIP.image}
                alt="Sistem Kepemilikan Mudah Harmonia Student House"
                referrerPolicy="no-referrer"
                className="w-full max-h-[300px] object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PDF_OWNERSHIP.pillars.map((pillar, idx) => {
              const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];
              return (
                <div
                  key={pillar.title}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-3"
                >
                  <div className="w-11 h-11 rounded-full border border-[#1C2A44]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1C2A44]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2A44]">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{pillar.body}</p>
                </div>
              );
            })}
          </div>

          {/* Legalitas SHM & PBG */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1C2A44]">{PDF_LEGAL.shmTitle}</h3>
                <div className="h-[3px] w-16 bg-[#F2BA36]" aria-hidden="true" />
              </div>
              <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
                {PDF_LEGAL.shmParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenLightbox(
                    PDF_LEGAL.shmImage,
                    PDF_LEGAL.shmTitle,
                    'Bukti legalitas tanah SHM Harmonia Student House Jatinangor',
                  )
                }
                className="group relative block w-full rounded-lg overflow-hidden border border-slate-200 cursor-pointer"
              >
                <img
                  src={PDF_LEGAL.shmImage}
                  alt="Dokumen Sertifikat Hak Milik (SHM) Harmonia Student House"
                  referrerPolicy="no-referrer"
                  className="w-full h-[260px] object-cover"
                />
                <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/95 text-[#1C2A44] text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                  Perbesar Dokumen SHM
                </span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1C2A44]">{PDF_LEGAL.pbgTitle}</h3>
                <div className="h-[3px] w-16 bg-[#F2BA36]" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {PDF_LEGAL.pbgDescription}
              </p>
              <button
                type="button"
                onClick={() =>
                  onOpenLightbox(
                    PDF_LEGAL.pbgImage,
                    PDF_LEGAL.pbgTitle,
                    'Resi Penerimaan Berkas Rekomendasi PBG Kabupaten Sumedang',
                  )
                }
                className="group relative block w-full rounded-lg overflow-hidden border border-slate-200 bg-[#1C2A44]/5 cursor-pointer"
              >
                <img
                  src={PDF_LEGAL.pbgImage}
                  alt="Dokumen Penerimaan Berkas PBG Pemerintah Kabupaten Sumedang"
                  referrerPolicy="no-referrer"
                  className="w-full h-[260px] object-contain p-2 bg-slate-100"
                />
                <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/95 text-[#1C2A44] text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                  Perbesar Dokumen PBG
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spesifikasi Bangunan & Interior (Pages 28 & 29 verbatim) */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
                {specTab === 'bangunan' ? PDF_SPEC_BANGUNAN.title : PDF_SPEC_INTERIOR.title}
              </h2>
              <p className="text-slate-600 text-[15px] leading-relaxed">
                {specTab === 'bangunan'
                  ? PDF_SPEC_BANGUNAN.description
                  : PDF_SPEC_INTERIOR.description}
              </p>
              <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />
            </div>

            <div
              role="tablist"
              aria-label="Pilih tab spesifikasi"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg self-start max-w-full overflow-x-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={specTab === 'bangunan'}
                onClick={() => setSpecTab('bangunan')}
                className={`px-4 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  specTab === 'bangunan'
                    ? 'bg-white text-[#1C2A44] shadow-xs'
                    : 'text-slate-600 hover:text-[#1C2A44]'
                }`}
              >
                Spesifikasi Bangunan
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={specTab === 'interior'}
                onClick={() => setSpecTab('interior')}
                className={`px-4 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  specTab === 'interior'
                    ? 'bg-white text-[#1C2A44] shadow-xs'
                    : 'text-slate-600 hover:text-[#1C2A44]'
                }`}
              >
                Spesifikasi Interior
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200">
            <img
              src={
                specTab === 'bangunan'
                  ? PDF_SPEC_BANGUNAN.bannerImage
                  : PDF_SPEC_INTERIOR.bannerImage
              }
              alt={specTab === 'bangunan' ? PDF_SPEC_BANGUNAN.title : PDF_SPEC_INTERIOR.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[200px] object-cover"
            />
          </div>

          {specTab === 'bangunan' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PDF_SPEC_BANGUNAN.categories.map((cat) => (
                <div
                  key={cat.name}
                  className="bg-[#FAFAFA] border border-slate-200 rounded-xl p-6 space-y-3"
                >
                  <h3 className="text-base font-bold text-[#1C2A44]">{cat.name}</h3>
                  <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed">
                    {cat.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-slate-200 text-[#1C2A44]">
                    <th className="py-3.5 px-4 font-bold">Item</th>
                    <th className="py-3.5 px-4 font-bold">Dimensi</th>
                    <th className="py-3.5 px-4 font-bold">Spesifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PDF_SPEC_INTERIOR.rows.map((row) => (
                    <tr key={row.no} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-medium text-[#1C2A44]">
                        <span className="font-mono tabular-nums text-slate-500 mr-2">
                          {row.no}
                        </span>
                        {row.item}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                        {row.dimensi || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {row.spesifikasi || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Estimasi BEP & ROI (Page 31 verbatim + interactive simulator) */}
      <section id="estimasi-roi" className="py-14 lg:py-20 bg-[#FAFAFA] border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5 space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C2A44] tracking-tight">
                {PDF_ROI.title}
              </h2>
              <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />
            </div>
            <div className="lg:col-span-7">
              <p className="text-slate-600 text-[15px] leading-relaxed">
                {PDF_ROI.description}
              </p>
            </div>
          </div>

          {/* Interactive Simulator matching PDF copy */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-[#1C2A44]">
                  Simulasi Potensi Keuntungan Investasi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih tipe blok dan jumlah unit untuk melihat proyeksi berdasarkan angka resmi PDF.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs font-semibold text-slate-600 max-w-full">
                  Tipe Blok:
                  <select
                    value={simBlock}
                    onChange={(e) => setSimBlock(e.target.value as BlockId)}
                    className="ml-2 px-3 py-2 min-h-[40px] max-w-full border border-slate-300 rounded-lg bg-white text-[#1C2A44] font-semibold text-xs sm:text-sm"
                  >
                    <option value="A">A · AYMAN (Rp850 jt)</option>
                    <option value="B">B · BAJRA (Rp750 jt)</option>
                    <option value="C">C · CINDY (Rp650 jt)</option>
                    <option value="D">D · DARA (Rp950 jt)</option>
                    <option value="E">E · EULIS (Rp333 jt)</option>
                    <option value="F">F · FATHYA (Rp575 jt)</option>
                    <option value="G1">G · GEIBY (Rp222 jt)</option>
                    <option value="H">H · HARMONIA (Rp999 jt)</option>
                  </select>
                </label>

                <label className="text-xs font-semibold text-slate-600 max-w-full">
                  Jumlah Unit:
                  <select
                    value={simCount}
                    onChange={(e) => setSimCount(Number(e.target.value))}
                    className="ml-2 px-3 py-2 min-h-[40px] max-w-full border border-slate-300 rounded-lg bg-white text-[#1C2A44] font-semibold text-xs sm:text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Unit
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FAFAFA] border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500">Nilai Investasi ({simProjection.unitCount} Unit)</p>
                <p className="text-xl font-extrabold text-[#1C2A44] font-mono tabular-nums mt-1">
                  Rp{simProjection.totalInvestasiJt} jt
                </p>
              </div>
              <div className="bg-[#FAFAFA] border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500">Net Profit / Bulan</p>
                <p className="text-xl font-extrabold text-[#1C2A44] font-mono tabular-nums mt-1">
                  Rp{String(simProjection.netProfitBulanJt).replace('.', ',')} jt
                </p>
              </div>
              <div className="bg-[#FAFAFA] border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500">Net Profit / Tahun</p>
                <p className="text-xl font-extrabold text-[#1C2A44] font-mono tabular-nums mt-1">
                  Rp{String(simProjection.netProfitTahunJt).replace('.', ',')} jt
                </p>
              </div>
              <div className="bg-[#1C2A44] text-white rounded-lg p-4">
                <p className="text-xs text-white/75">ROI Total (Bisnis + Cap. Gain*)</p>
                <p className="text-xl font-extrabold text-[#F2BA36] font-mono tabular-nums mt-1">
                  {simProjection.spec.roiTotalLabel}
                </p>
                <p className="text-[11px] text-white/75 font-mono tabular-nums mt-0.5">
                  Estimasi BEP {simProjection.spec.estimasiBepLabel}
                </p>
              </div>
            </div>
          </div>

          {/* All 8 Blocks ROI Cards (Page 31 verbatim) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allRoiBlocks.map((block) => (
              <div
                key={block.blockLetter}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div className="bg-[#1C2A44] text-white px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-[#F2BA36] text-[#1C2A44] text-xs font-extrabold rounded-xs mr-2">
                      {block.blockLetter}
                    </span>
                    <span className="font-bold tracking-wide">{block.name}</span>
                    <p className="text-xs text-white/80 mt-1">{block.subtitle}</p>
                  </div>
                </div>

                <div className="p-5 space-y-2.5 text-sm flex-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">
                      {block.blockLetter === 'H' ? 'Total Lantai' : 'Total Kamar'}
                    </span>
                    <span className="font-bold text-[#1C2A44]">{block.totalKamarOrLantai}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Nilai Investasi</span>
                    <span className="font-bold text-[#1C2A44] font-mono tabular-nums">
                      {block.nilaiInvestasiLabel}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Net Profit / Bulan</span>
                    <span className="font-bold text-[#1C2A44] font-mono tabular-nums">
                      {block.netProfitBulanLabel}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">ROI Bisnis Kostan</span>
                    <span className="font-bold text-[#1C2A44] font-mono tabular-nums">
                      {block.roiBisnisLabel}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Estimasi BEP</span>
                    <span className="font-bold text-[#1C2A44] font-mono tabular-nums">
                      {block.estimasiBepLabel}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-3 bg-[#FAFAFA] border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    ROI Total: <strong className="text-[#1C2A44] font-mono tabular-nums">{block.roiTotalLabel}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => onBookBlock(block.blockLetter === 'G' ? 'G1' : block.blockLetter)}
                    className="text-xs font-bold text-[#1C2A44] hover:underline cursor-pointer"
                  >
                    Booking Blok {block.blockLetter} →
                  </button>
                </div>
              </div>
            ))}

            {/* Biaya Ijaroh Box (Page 31 verbatim) */}
            <div className="bg-[#1C2A44] text-white rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#F2BA36] text-[#1C2A44] px-5 py-3.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold">{PDF_ROI.biayaIjarohTitle}</p>
                </div>
                <p className="text-sm font-extrabold font-mono tabular-nums text-right">
                  {PDF_ROI.biayaIjarohValue}
                </p>
              </div>
              <div className="p-5 space-y-3 flex-1">
                <p className="text-xs font-semibold text-white/80">Include Biaya:</p>
                <ul className="space-y-2 text-sm">
                  {PDF_ROI.includeBiaya.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#F2BA36] shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Estimasi ROI Total Banner & Keterangan (Page 31 verbatim) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#1C2A44] text-white px-5 py-3 flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm sm:text-base">Estimasi ROI Total</span>
              <span className="text-xs sm:text-sm italic text-[#F2BA36]">
                ROI Bisnis + Capital Gain*
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 divide-x divide-y sm:divide-y-0 divide-slate-200 text-center">
              {allRoiBlocks.map((b) => (
                <div key={b.blockLetter} className="p-3.5">
                  <p className="text-sm font-bold text-[#1C2A44]">{b.blockLetter}</p>
                  <p className="text-sm sm:text-base font-extrabold text-[#1C2A44] font-mono tabular-nums mt-0.5">
                    {b.roiTotalLabel}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1C2A44] text-white rounded-xl p-5 sm:p-6 flex flex-col md:flex-row gap-4 items-start">
            <span className="inline-block px-3.5 py-1.5 bg-[#F2BA36] text-[#1C2A44] text-xs font-extrabold rounded-md shrink-0">
              Keterangan
            </span>
            <ul className="space-y-1 text-xs sm:text-sm text-white/90 leading-relaxed">
              {PDF_ROI.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Jaminan Okupansi (Page 32 verbatim) */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
                  {PDF_OKUPANSI.title}
                </h2>
                <p className="text-lg font-bold text-[#1C2A44]">
                  {PDF_OKUPANSI.subtitle}
                </p>
              </div>

              <div className="space-y-4 text-[15px] text-slate-700 leading-relaxed">
                {PDF_OKUPANSI.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#1C2A44]">
                  {PDF_OKUPANSI.upayaTitle}
                </h3>
                <div className="space-y-3">
                  {PDF_OKUPANSI.upayaItems.map((item, idx) => {
                    const Icon = OKUPANSI_ICONS[idx % OKUPANSI_ICONS.length];
                    return (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#1C2A44]" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C2A44]">{item.title}</p>
                          <p className="text-xs sm:text-sm text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={PDF_OKUPANSI.sideImage}
                alt="Ruang Kerja dan Kamar Tidur Mahasiswa Harmonia"
                referrerPolicy="no-referrer"
                className="w-full h-full min-h-[320px] max-h-[620px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
