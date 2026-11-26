import { useState, useCallback } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  HARMONIA_COORDS,
  PDF_LOCATION,
  type LocationLandmark,
} from '../data/pdfContent';
import {
  MapPin,
  GraduationCap,
  Utensils,
  ShoppingBag,
  Route,
  TrainFront,
  ExternalLink,
  Maximize2,
  Compass,
} from 'lucide-react';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

function LandmarkIcon({ id }: { id: string }) {
  switch (id) {
    case 'unpad':
    case 'itb':
    case 'ikopin':
      return <GraduationCap className="w-4 h-4" aria-hidden="true" />;
    case 'kuliner':
      return <Utensils className="w-4 h-4" aria-hidden="true" />;
    case 'belanja':
      return <ShoppingBag className="w-4 h-4" aria-hidden="true" />;
    case 'tol':
      return <Route className="w-4 h-4" aria-hidden="true" />;
    default:
      return <TrainFront className="w-4 h-4" aria-hidden="true" />;
  }
}

function HarmoniaMarker({
  isSelected,
  onSelect,
}: {
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: HARMONIA_COORDS.lat, lng: HARMONIA_COORDS.lng }}
        onClick={onSelect}
        title="Harmonia Student House Jatinangor"
      >
        <Pin background="#1C2A44" borderColor="#F2BA36" glyphColor="#F2BA36" scale={1.25} />
      </AdvancedMarker>
      {isSelected && marker && (
        <InfoWindow anchor={marker} onCloseClick={onSelect}>
          <div className="p-1 max-w-[220px] space-y-1">
            <p className="font-bold text-xs text-[#1C2A44]">
              Harmonia Student House Jatinangor
            </p>
            <p className="text-[11px] text-slate-600">{HARMONIA_COORDS.address}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function LandmarkMarker({
  landmark,
  isSelected,
  onSelect,
}: {
  landmark: LocationLandmark;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: landmark.lat, lng: landmark.lng }}
        onClick={onSelect}
        title={landmark.name}
      >
        <Pin
          background={isSelected ? '#F2BA36' : '#FFFFFF'}
          borderColor="#1C2A44"
          glyphColor="#1C2A44"
        />
      </AdvancedMarker>
      {isSelected && marker && (
        <InfoWindow anchor={marker} onCloseClick={onSelect}>
          <div className="p-1 max-w-[220px] space-y-1">
            <p className="font-bold text-xs text-[#1C2A44]">{landmark.name}</p>
            <p className="text-[11px] font-semibold text-[#D9A024]">{landmark.duration}</p>
            <p className="text-[11px] text-slate-600">{landmark.note}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MapCameraSync({ target }: { target: { lat: number; lng: number } }) {
  const map = useMap();
  if (map) {
    map.panTo(target);
  }
  return null;
}

export function LocationMapSection({
  onOpenLightbox,
}: {
  onOpenLightbox: (src: string, title: string, caption?: string) => void;
}) {
  const [mapView, setMapView] = useState<'google' | 'denah'>('google');
  const [selectedId, setSelectedId] = useState<string>('harmonia');

  const activeLandmark = PDF_LOCATION.landmarks.find((l) => l.id === selectedId);
  const focusCoords = activeLandmark
    ? { lat: activeLandmark.lat, lng: activeLandmark.lng }
    : { lat: HARMONIA_COORDS.lat, lng: HARMONIA_COORDS.lng };

  const handleSelectLandmark = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? 'harmonia' : id));
    setMapView('google');
  }, []);

  const embedQuery = activeLandmark
    ? encodeURIComponent(`${activeLandmark.name}, Jatinangor`)
    : encodeURIComponent('Jl. Cikuda, Jatinangor, Sumedang');

  const directionsUrl = activeLandmark
    ? `https://www.google.com/maps/dir/?api=1&origin=${HARMONIA_COORDS.lat},${HARMONIA_COORDS.lng}&destination=${activeLandmark.lat},${activeLandmark.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${HARMONIA_COORDS.lat},${HARMONIA_COORDS.lng}`;

  return (
    <section id="lokasi" className="py-12 lg:py-20 bg-white border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
        {/* Top Copy + Stats (Page 4 verbatim) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4 min-w-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C2A44] tracking-tight">
              {PDF_LOCATION.title}
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              {PDF_LOCATION.description}
            </p>
            <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />

            <div className="pt-2 space-y-3">
              <p className="text-sm font-semibold text-[#1C2A44]">
                {PDF_LOCATION.marketHeadline}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {PDF_LOCATION.stats.map((st) => (
                  <div
                    key={st.value}
                    className="bg-[#FAFAFA] border border-slate-200 rounded-xl p-4"
                  >
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#1C2A44] font-mono tabular-nums">
                      {st.value}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">{st.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {PDF_LOCATION.marketFootnote}
              </p>
            </div>
          </div>

          {/* Interactive Google Maps + PDF Sketch */}
          <div className="lg:col-span-7 space-y-4 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label="Mode peta lokasi"
                className="inline-flex items-center p-1 bg-slate-100 rounded-lg max-w-full overflow-x-auto"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mapView === 'google'}
                  onClick={() => setMapView('google')}
                  className={`px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    mapView === 'google'
                      ? 'bg-white text-[#1C2A44] shadow-xs'
                      : 'text-slate-600 hover:text-[#1C2A44]'
                  }`}
                >
                  Peta Lokasi Interaktif
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mapView === 'denah'}
                  onClick={() => setMapView('denah')}
                  className={`px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    mapView === 'denah'
                      ? 'bg-white text-[#1C2A44] shadow-xs'
                      : 'text-slate-600 hover:text-[#1C2A44]'
                  }`}
                >
                  Denah Lokasi PDF
                </button>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-semibold text-[#1C2A44] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#D9A024]" aria-hidden="true" />
                <span>Petunjuk Arah Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </a>
            </div>

            {mapView === 'google' ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-[320px] sm:h-[420px] w-full relative">
                {MAPS_API_KEY ? (
                  <APIProvider apiKey={MAPS_API_KEY} language="id" region="ID">
                    <GoogleMap
                      defaultCenter={{ lat: HARMONIA_COORDS.lat, lng: HARMONIA_COORDS.lng }}
                      defaultZoom={15}
                      mapId="DEMO_MAP_ID"
                      gestureHandling="cooperative"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <MapCameraSync target={focusCoords} />
                      <HarmoniaMarker
                        isSelected={selectedId === 'harmonia'}
                        onSelect={() => setSelectedId('harmonia')}
                      />
                      {PDF_LOCATION.landmarks.map((lm) => (
                        <LandmarkMarker
                          key={lm.id}
                          landmark={lm}
                          isSelected={selectedId === lm.id}
                          onSelect={() => handleSelectLandmark(lm.id)}
                        />
                      ))}
                    </GoogleMap>
                  </APIProvider>
                ) : (
                  <iframe
                    title="Peta Lokasi Harmonia Student House Jatinangor"
                    src={`https://maps.google.com/maps?q=${embedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>
            ) : (
              /* Preserve 100% original PDF dimensions & zero cropping for Location Sketch & Student Photo */
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#FAFAFA] border border-slate-200 rounded-xl p-4 items-center">
                <button
                  type="button"
                  onClick={() =>
                    onOpenLightbox(
                      PDF_LOCATION.sketchImage,
                      'Peta Lokasi Jl. Cikuda — Harmonia Student House Jatinangor',
                    )
                  }
                  className="group relative sm:col-span-7 bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer"
                >
                  <img
                    src={PDF_LOCATION.sketchImage}
                    alt="Peta Lokasi Jl. Cikuda Harmonia Student House Jatinangor"
                    width={620}
                    height={355}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block"
                  />
                  <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/95 text-[#1C2A44] text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs">
                    <Maximize2 className="w-3 h-3" aria-hidden="true" />
                    <span>Perbesar</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenLightbox(
                      PDF_LOCATION.studentImage,
                      'Kawasan Pendidikan Jatinangor — Harmonia Student House',
                    )
                  }
                  className="group relative sm:col-span-5 bg-white rounded-lg overflow-hidden border border-slate-200 cursor-pointer"
                >
                  <img
                    src={PDF_LOCATION.studentImage}
                    alt="Mahasiswa di Kawasan Pendidikan Jatinangor"
                    width={555}
                    height={880}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[340px] object-contain mx-auto block"
                  />
                  <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/95 text-[#1C2A44] text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs">
                    <Maximize2 className="w-3 h-3" aria-hidden="true" />
                    <span>Perbesar</span>
                  </span>
                </button>
              </div>
            )}

            {/* Selected Location Focus Strip for intuitive mobile clarity */}
            <div className="bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <Compass className="w-4 h-4 text-[#D9A024] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <p className="text-[#1C2A44]">
                  {activeLandmark ? (
                    <>
                      <strong className="font-bold">{activeLandmark.name}</strong>{' '}
                      <span className="font-mono font-semibold text-[#D9A024]">
                        ({activeLandmark.duration})
                      </span>{' '}
                      <span className="text-slate-600">— {activeLandmark.note}</span>
                    </>
                  ) : (
                    <>
                      <strong className="font-bold">Harmonia Student House Jatinangor</strong>{' '}
                      <span className="text-slate-600">— {HARMONIA_COORDS.address}</span>
                    </>
                  )}
                </p>
              </div>
              {activeLandmark && (
                <button
                  type="button"
                  onClick={() => setSelectedId('harmonia')}
                  className="text-xs font-semibold text-[#1C2A44] underline self-start sm:self-center shrink-0 cursor-pointer"
                >
                  Pusatkan ke Harmonia
                </button>
              )}
            </div>

            {/* Symmetric 2x4 (mobile) / 4x2 (desktop) Landmark Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedId('harmonia');
                  setMapView('google');
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] ${
                  selectedId === 'harmonia'
                    ? 'bg-[#1C2A44] text-white border-[#1C2A44]'
                    : 'bg-[#FAFAFA] text-[#1C2A44] border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={selectedId === 'harmonia' ? 'text-[#F2BA36]' : 'text-[#1C2A44]'}>
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold truncate">Harmonia Lokasi</span>
                </div>
                <p
                  className={`text-xs font-mono tabular-nums mt-1 ${
                    selectedId === 'harmonia' ? 'text-[#F2BA36]' : 'text-slate-600'
                  }`}
                >
                  Jl. Cikuda
                </p>
              </button>

              {PDF_LOCATION.landmarks.map((lm) => {
                const isSelected = selectedId === lm.id;
                return (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => handleSelectLandmark(lm.id)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-[#1C2A44] text-white border-[#1C2A44]'
                        : 'bg-[#FAFAFA] text-[#1C2A44] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={isSelected ? 'text-[#F2BA36]' : 'text-[#1C2A44]'}>
                        <LandmarkIcon id={lm.id} />
                      </span>
                      <span className="text-xs font-bold truncate">{lm.name}</span>
                    </div>
                    <p
                      className={`text-xs font-mono tabular-nums mt-1 ${
                        isSelected ? 'text-[#F2BA36]' : 'text-slate-600'
                      }`}
                    >
                      {lm.duration}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
