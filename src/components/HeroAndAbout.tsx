import {
  PDF_HERO,
  PDF_ABOUT,
  PDF_KEUNGGULAN,
  PDF_KONSEP_DESAIN,
} from '../data/pdfContent';
import { buildOfficialWhatsappUrl } from '../utils/bookingLogic';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WhatsappIcon } from './WhatsappIcon';

interface HeroAndAboutProps {
  onBookingClick: () => void;
}

export function HeroAndAbout({ onBookingClick }: HeroAndAboutProps) {
  const heroWhatsappUrl = buildOfficialWhatsappUrl(
    'Assalamualaikum Tim Harmonia Student House Jatinangor, saya tertarik dengan Ekspansi Tahap 2.',
  );

  return (
    <>
      {/* Hero Section (Page 1 verbatim) */}
      <section id="top" className="bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <img
                  src={PDF_HERO.logoLight}
                  alt="Logo Harmonia Student House Jatinangor"
                  referrerPolicy="no-referrer"
                  className="h-12 w-auto object-contain"
                />

                <div className="space-y-3">
                  <p className="text-lg sm:text-xl font-medium text-[#1C2A44]">
                    {PDF_HERO.kicker}
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-[#1C2A44] leading-[1.1] text-balance">
                    {PDF_HERO.title}
                  </h1>
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <span className="inline-block bg-[#1C2A44] text-white text-xs sm:text-sm font-bold tracking-wide px-3.5 py-1.5 rounded-md">
                      {PDF_HERO.badge}
                    </span>
                    <span className="text-sm font-medium text-slate-600">
                      {PDF_HERO.subtitle}
                    </span>
                  </div>
                </div>

                <div className="h-[3px] w-24 bg-[#F2BA36]" aria-hidden="true" />
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onBookingClick}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[44px] bg-[#1C2A44] hover:bg-[#142035] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Booking Unit Online</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href={heroWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Hubungi WhatsApp"
                    title="Hubungi via WhatsApp"
                    className="inline-flex items-center justify-center w-12 h-12 min-w-[44px] min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors"
                  >
                    <WhatsappIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="#unit-denah"
                    className="inline-flex items-center justify-center px-5 py-3.5 min-h-[44px] border border-slate-300 text-[#1C2A44] hover:bg-slate-50 text-sm font-semibold rounded-lg transition-colors"
                  >
                    Lihat Unit & Denah
                  </a>
                </div>

                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-slate-500">{PDF_HERO.producedByLabel}</p>
                    <p className="font-bold text-[#1C2A44] mt-0.5">{PDF_HERO.producedBy}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{PDF_HERO.developedByLabel}</p>
                    <p className="font-bold text-[#1C2A44] mt-0.5">{PDF_HERO.developedBy}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex">
              <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={PDF_HERO.heroImage}
                  alt="Fasad Ekspansi Tahap 2 Harmonia Student House Jatinangor"
                  referrerPolicy="no-referrer"
                  className="w-full h-full min-h-[280px] lg:min-h-[460px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Ekspansi Tahap 2 (Page 2 verbatim) */}
      <section id="tentang" className="py-14 lg:py-20 bg-[#FAFAFA] border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
            <img
              src={PDF_ABOUT.transitionImage}
              alt="Harmonia Student House Jatinangor Ekspansi Tahap 2"
              referrerPolicy="no-referrer"
              className="w-full max-h-[440px] object-cover"
            />
          </div>

          <div className="space-y-4 max-w-3xl">
            <p className="text-sm font-medium text-slate-600">{PDF_ABOUT.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C2A44] tracking-tight text-balance">
              {PDF_ABOUT.title}
            </h2>
            <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />
            <p className="text-base sm:text-lg font-semibold text-[#1C2A44] pt-2">
              {PDF_ABOUT.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-slate-700 text-[15px] leading-relaxed">
            <div className="space-y-4">
              {PDF_ABOUT.paragraphsLeft.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-[#1C2A44]">{PDF_ABOUT.blockIntroTitle}</p>
              <p>{PDF_ABOUT.blockIntroBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Harmonia (Page 8 verbatim) */}
      <section className="py-14 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={PDF_KEUNGGULAN.sideImage}
                alt="Interior Kamar Siap Huni Harmonia Student House"
                referrerPolicy="no-referrer"
                className="w-full h-full min-h-[320px] max-h-[680px] object-cover"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
                  {PDF_KEUNGGULAN.title}
                </h2>
                <p className="text-slate-600 text-[15px] leading-relaxed max-w-xl">
                  {PDF_KEUNGGULAN.subtitle}
                </p>
                <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 pt-2">
                {PDF_KEUNGGULAN.items.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 pb-4 border-b border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-[#1C2A44] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#1C2A44]">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Konsep Desain Bangunan Ekspansi Tahap 2 (Page 9 verbatim) */}
      <section className="py-14 lg:py-20 bg-[#FAFAFA] border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
                {PDF_KONSEP_DESAIN.title}
              </h2>
              <p className="text-lg italic font-medium text-[#1C2A44]/80">
                {PDF_KONSEP_DESAIN.subtitle}
              </p>
              <div className="h-[3px] w-20 bg-[#F2BA36] pt-1" aria-hidden="true" />
            </div>
            <div className="lg:col-span-7 space-y-3 text-slate-700 text-[15px] leading-relaxed">
              {PDF_KONSEP_DESAIN.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
            <img
              src={PDF_KONSEP_DESAIN.image}
              alt="Konsep Desain Bangunan Modern Contemporary Tropical Minimalist Harmonia Tahap 2"
              referrerPolicy="no-referrer"
              className="w-full max-h-[520px] object-cover"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#1C2A44]" aria-hidden="true" />
            <span>Modern Contemporary · Tropical Minimalist · Harmonia Student House Jatinangor</span>
          </div>
        </div>
      </section>
    </>
  );
}
