import { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroAndAbout } from './components/HeroAndAbout';
import { UnitCatalogSection } from './components/UnitCatalogSection';
import { FacilityGallerySection } from './components/FacilityGallerySection';
import { LocationMapSection } from './components/LocationMapSection';
import { SpecsLegalRoiSection } from './components/SpecsLegalRoiSection';
import { SiteplanBookingSection } from './components/SiteplanBookingSection';
import { LightboxModal } from './components/LightboxModal';
import { PDF_GALLERY, PDF_HERO } from './data/pdfContent';
import {
  buildOfficialWhatsappUrl,
  OFFICIAL_WHATSAPP_NUMBER,
  type BlockId,
} from './utils/bookingLogic';
import { MessageCircle } from 'lucide-react';

interface LightboxState {
  isOpen: boolean;
  src: string;
  title: string;
  caption?: string;
  galleryIndex: number | null;
}

const SECTION_IDS = ['tentang', 'unit-denah', 'galeri', 'lokasi', 'legalitas', 'estimasi-roi', 'booking'];

export default function App() {
  const [selectedBlock, setSelectedBlock] = useState<BlockId>('A');
  const [activeSection, setActiveSection] = useState<string>('tentang');
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    src: '',
    title: '',
    caption: undefined,
    galleryIndex: null,
  });

  useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  // Scroll-spy for desktop navbar & smartphone bottom dock
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToBooking = useCallback((blockId?: BlockId) => {
    if (blockId) {
      setSelectedBlock(blockId);
    }
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const openLightbox = useCallback((src: string, title: string, caption?: string) => {
    setLightbox({ isOpen: true, src, title, caption, galleryIndex: null });
  }, []);

  const openGalleryLightbox = useCallback((index: number) => {
    const item = PDF_GALLERY[index];
    if (!item) return;
    setLightbox({
      isOpen: true,
      src: item.image,
      title: item.title,
      caption: `Halaman ${item.pageRef} · Resolusi Asli PDF (${item.width}×${item.height}px)`,
      galleryIndex: index,
    });
  }, []);

  const handleGalleryPrev =
    lightbox.galleryIndex !== null
      ? () => {
          const nextIdx =
            (lightbox.galleryIndex! - 1 + PDF_GALLERY.length) % PDF_GALLERY.length;
          openGalleryLightbox(nextIdx);
        }
      : undefined;

  const handleGalleryNext =
    lightbox.galleryIndex !== null
      ? () => {
          const nextIdx = (lightbox.galleryIndex! + 1) % PDF_GALLERY.length;
          openGalleryLightbox(nextIdx);
        }
      : undefined;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1C2A44] overflow-x-clip">
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <Navbar
          activeSection={activeSection}
          onBookingClick={() => scrollToBooking()}
        />

        <main className="flex-1">
          <HeroAndAbout onBookingClick={() => scrollToBooking()} />

          <UnitCatalogSection
            selectedBlock={selectedBlock}
            onSelectBlock={setSelectedBlock}
            onBookBlock={(blockId) => scrollToBooking(blockId)}
            onOpenLightbox={openLightbox}
          />

          <FacilityGallerySection onOpenLightboxByIndex={openGalleryLightbox} />

          <LocationMapSection onOpenLightbox={openLightbox} />

          <SpecsLegalRoiSection
            onOpenLightbox={openLightbox}
            onBookBlock={(blockId) => scrollToBooking(blockId)}
          />

          <SiteplanBookingSection
            selectedBlock={selectedBlock}
            onSelectBlock={setSelectedBlock}
            onOpenLightbox={openLightbox}
          />
        </main>

        <footer className="bg-[#1C2A44] text-white border-t border-white/10 pb-20 md:pb-0">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={PDF_HERO.logoDark}
                alt="Harmonia Student House Jatinangor"
                referrerPolicy="no-referrer"
                className="h-14 w-auto object-contain rounded-md"
              />
              <div className="text-xs sm:text-sm text-white/80 space-y-0.5">
                <p className="font-semibold text-white">
                  {PDF_HERO.producedBy} · {PDF_HERO.developedBy}
                </p>
                <p>Jl. Cikuda, Jatinangor · Ring 1 UNPAD &amp; ITB</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs sm:text-sm text-white/80">
              <a href="#tentang" className="hover:text-[#F2BA36] transition-colors">
                Tentang
              </a>
              <a href="#unit-denah" className="hover:text-[#F2BA36] transition-colors">
                Unit &amp; Denah
              </a>
              <a href="#galeri" className="hover:text-[#F2BA36] transition-colors">
                Galeri
              </a>
              <a href="#lokasi" className="hover:text-[#F2BA36] transition-colors">
                Lokasi
              </a>
              <a href="#estimasi-roi" className="hover:text-[#F2BA36] transition-colors">
                Estimasi ROI
              </a>
              <a href="#booking" className="hover:text-[#F2BA36] transition-colors font-semibold text-[#F2BA36]">
                Booking Unit
              </a>
              <a
                href={buildOfficialWhatsappUrl(
                  'Assalamualaikum Tim Harmonia Student House Jatinangor, saya ingin menanyakan ketersediaan unit Ekspansi Tahap 2.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp {OFFICIAL_WHATSAPP_NUMBER}</span>
              </a>
            </div>
          </div>
        </footer>

        <MobileBottomNav
          activeSection={activeSection}
          onBookingClick={() => scrollToBooking()}
        />

        <LightboxModal
          isOpen={lightbox.isOpen}
          imageSrc={lightbox.src}
          title={lightbox.title}
          caption={lightbox.caption}
          counterText={
            lightbox.galleryIndex !== null
              ? `${lightbox.galleryIndex + 1} / ${PDF_GALLERY.length}`
              : undefined
          }
          onClose={() => setLightbox((prev) => ({ ...prev, isOpen: false }))}
          onPrev={handleGalleryPrev}
          onNext={handleGalleryNext}
        />
      </div>
    </ErrorBoundary>
  );
}
