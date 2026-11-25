export type BlockId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G1' | 'G2' | 'H';

export type PaymentScheme = 'cash_keras' | 'cicilan_syariah';

export interface SiteplanUnit {
  unitCode: string;
  blockId: BlockId;
  blockLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  label: string;
  lt: string;
  lb: string;
}

export interface BookingInput {
  unitCode: string;
  blockId: BlockId;
  fullName: string;
  whatsapp: string;
  email: string;
  paymentScheme: PaymentScheme;
  notes: string;
  transferProofName: string;
  ktpPhotoName: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof BookingInput, string>>;
}

export interface RoiBlockSpec {
  blockLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  name: string;
  subtitle: string;
  totalKamarOrLantai: string;
  nilaiInvestasiJt: number;
  nilaiInvestasiLabel: string;
  netProfitBulanJt: number;
  netProfitBulanLabel: string;
  roiBisnisPct: number;
  roiBisnisLabel: string;
  estimasiBepThn: number;
  estimasiBepLabel: string;
  roiTotalPct: number;
  roiTotalLabel: string;
}

export const OFFICIAL_WHATSAPP_NUMBER = '6281533332611';
export const OFFICIAL_WHATSAPP_DISPLAY = '+62 815-3333-2611';
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

// Validation constants synced verbatim with firebase-blueprint.json
export const UNIT_CODE_REGEX = /^(A[12]|B1|C([1-9]|1[0-4])|D[1-3]|E([1-9]|1[0-9]|2[0-2])|F[1-8]|G([1-9]|[1-4][0-9]|5[0-2])|H[1-5])$/;
export const WHATSAPP_REGEX = /^(\+62|62|0)[0-9]{8,15}$/;
export const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const FULL_NAME_MAX = 100;
export const NOTES_MAX = 400;
export const PROOF_FILENAME_MAX = 140;

export const ROI_SPECS_BY_BLOCK: Record<RoiBlockSpec['blockLetter'], RoiBlockSpec> = {
  A: {
    blockLetter: 'A',
    name: 'AYMAN',
    subtitle: 'RuKost Mezzanine (2 Lantai)',
    totalKamarOrLantai: '4 Kamar',
    nilaiInvestasiJt: 850,
    nilaiInvestasiLabel: 'Rp850 jt',
    netProfitBulanJt: 6,
    netProfitBulanLabel: 'Rp6 jt',
    roiBisnisPct: 8.47,
    roiBisnisLabel: '8,47%',
    estimasiBepThn: 11.81,
    estimasiBepLabel: '11,81 thn',
    roiTotalPct: 13.47,
    roiTotalLabel: '13,47%',
  },
  B: {
    blockLetter: 'B',
    name: 'BAJRA',
    subtitle: 'RuKost 4 Kamar (2 Lantai)',
    totalKamarOrLantai: '4 Kamar',
    nilaiInvestasiJt: 750,
    nilaiInvestasiLabel: 'Rp750 jt',
    netProfitBulanJt: 5.4,
    netProfitBulanLabel: 'Rp5,4 jt',
    roiBisnisPct: 8.64,
    roiBisnisLabel: '8,64%',
    estimasiBepThn: 11.57,
    estimasiBepLabel: '11,57 thn',
    roiTotalPct: 13.64,
    roiTotalLabel: '13,64%',
  },
  C: {
    blockLetter: 'C',
    name: 'CINDY',
    subtitle: 'ApartKost 4 Kamar (2 Lantai)',
    totalKamarOrLantai: '4 Kamar',
    nilaiInvestasiJt: 650,
    nilaiInvestasiLabel: 'Rp650 jt',
    netProfitBulanJt: 5.2,
    netProfitBulanLabel: 'Rp5,2 jt',
    roiBisnisPct: 9.6,
    roiBisnisLabel: '9,6%',
    estimasiBepThn: 10.42,
    estimasiBepLabel: '10,42 thn',
    roiTotalPct: 14.6,
    roiTotalLabel: '14,6%',
  },
  D: {
    blockLetter: 'D',
    name: 'DARA',
    subtitle: 'RuKost 6 Kamar (3 Lantai)',
    totalKamarOrLantai: '6 Kamar',
    nilaiInvestasiJt: 950,
    nilaiInvestasiLabel: 'Rp950 jt',
    netProfitBulanJt: 8.1,
    netProfitBulanLabel: 'Rp8,1 jt',
    roiBisnisPct: 10.23,
    roiBisnisLabel: '10,23%',
    estimasiBepThn: 9.7,
    estimasiBepLabel: '9,7 thn',
    roiTotalPct: 15.23,
    roiTotalLabel: '15,23%',
  },
  E: {
    blockLetter: 'E',
    name: 'EULIS',
    subtitle: 'RuKost 2 Kamar (1 Lantai)',
    totalKamarOrLantai: '2 Kamar',
    nilaiInvestasiJt: 333,
    nilaiInvestasiLabel: 'Rp333 jt',
    netProfitBulanJt: 2.3,
    netProfitBulanLabel: 'Rp2,3 jt',
    roiBisnisPct: 8.29,
    roiBisnisLabel: '8,29%',
    estimasiBepThn: 12.07,
    estimasiBepLabel: '12,07 thn',
    roiTotalPct: 13.29,
    roiTotalLabel: '13,29%',
  },
  F: {
    blockLetter: 'F',
    name: 'FATHYA',
    subtitle: 'RuKost 4 Kamar (2 Lantai)',
    totalKamarOrLantai: '4 Kamar',
    nilaiInvestasiJt: 575,
    nilaiInvestasiLabel: 'Rp575 jt',
    netProfitBulanJt: 5,
    netProfitBulanLabel: 'Rp5 jt',
    roiBisnisPct: 10.43,
    roiBisnisLabel: '10,43%',
    estimasiBepThn: 9.58,
    estimasiBepLabel: '9,58 thn',
    roiTotalPct: 15.43,
    roiTotalLabel: '15,43%',
  },
  G: {
    blockLetter: 'G',
    name: 'GEIBY',
    subtitle: 'Rukost Mezzanine (1 Lantai)',
    totalKamarOrLantai: '2 Kamar',
    nilaiInvestasiJt: 222,
    nilaiInvestasiLabel: 'Rp222 jt',
    netProfitBulanJt: 2.2,
    netProfitBulanLabel: 'Rp2,2 jt',
    roiBisnisPct: 11.89,
    roiBisnisLabel: '11,89%',
    estimasiBepThn: 8.41,
    estimasiBepLabel: '8,41 thn',
    roiTotalPct: 16.89,
    roiTotalLabel: '16,89%',
  },
  H: {
    blockLetter: 'H',
    name: 'HARMONIA',
    subtitle: 'Ruko 2 Lantai',
    totalKamarOrLantai: '2 Lantai',
    nilaiInvestasiJt: 999,
    nilaiInvestasiLabel: 'Rp999 jt',
    netProfitBulanJt: 4.25,
    netProfitBulanLabel: 'Rp4,25 jt',
    roiBisnisPct: 5.11,
    roiBisnisLabel: '5,11%',
    estimasiBepThn: 19.59,
    estimasiBepLabel: '19,59 thn',
    roiTotalPct: 10.11,
    roiTotalLabel: '10,11%',
  },
};

export function generateAllUnits(): SiteplanUnit[] {
  const units: SiteplanUnit[] = [];

  for (let i = 1; i <= 2; i++) {
    units.push({ unitCode: `A${i}`, blockId: 'A', blockLetter: 'A', label: 'Ayman', lt: '40.50 m²', lb: '90.20 m²' });
  }
  units.push({ unitCode: 'B1', blockId: 'B', blockLetter: 'B', label: 'Bajra', lt: '40.50 m²', lb: '77.78 m²' });
  for (let i = 1; i <= 14; i++) {
    units.push({ unitCode: `C${i}`, blockId: 'C', blockLetter: 'C', label: 'Cindy', lt: '31,86 m²', lb: '61,80 m²' });
  }
  for (let i = 1; i <= 3; i++) {
    units.push({ unitCode: `D${i}`, blockId: 'D', blockLetter: 'D', label: 'Dara', lt: '40.50 m²', lb: '116.86 m²' });
  }
  for (let i = 1; i <= 22; i++) {
    units.push({ unitCode: `E${i}`, blockId: 'E', blockLetter: 'E', label: 'Eulis', lt: '24,80 m²', lb: '22,00 m²' });
  }
  for (let i = 1; i <= 8; i++) {
    units.push({ unitCode: `F${i}`, blockId: 'F', blockLetter: 'F', label: 'Fathya', lt: '28,00 m²', lb: '52,00 m²' });
  }
  for (let i = 1; i <= 45; i++) {
    units.push({ unitCode: `G${i}`, blockId: 'G1', blockLetter: 'G', label: 'Geiby (G1 - G45)', lt: '14,00 m²', lb: '23,00 m²' });
  }
  for (let i = 46; i <= 52; i++) {
    units.push({ unitCode: `G${i}`, blockId: 'G2', blockLetter: 'G', label: 'Geiby (G46 - G52)', lt: '14,00 m²', lb: '23,00 m²' });
  }
  for (let i = 1; i <= 5; i++) {
    units.push({ unitCode: `H${i}`, blockId: 'H', blockLetter: 'H', label: 'Harmonia', lt: '32,00 m²', lb: '56,00 m²' });
  }

  return units;
}

export function normalizeWhatsapp(raw: string): string {
  return raw.replace(/[\s\-()]/g, '');
}

export function validateAttachmentFile(
  file: { name: string; type: string; size: number },
  label: string,
): string | null {
  const lowerName = file.name.trim().toLowerCase();
  const hasAllowedExtension = /\.(jpe?g|png|webp)$/i.test(lowerName);
  const hasAllowedMime =
    file.type === '' ||
    ALLOWED_IMAGE_MIME_TYPES.includes(
      file.type.toLowerCase() as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
    );

  if (!hasAllowedMime && !hasAllowedExtension) {
    return `${label} harus berupa file gambar (JPG, PNG, atau WEBP).`;
  }

  if (file.size <= 0) {
    return `${label} tidak valid atau kosong.`;
  }

  if (file.size > MAX_ATTACHMENT_BYTES) {
    return `${label} maksimal 10 MB.`;
  }

  const trimmedName = file.name.trim();
  if (trimmedName.length < 3 || trimmedName.length > PROOF_FILENAME_MAX) {
    return `Nama file ${label.toLowerCase()} harus 3–${PROOF_FILENAME_MAX} karakter.`;
  }

  return null;
}

export function validateBookingInput(input: BookingInput): ValidationResult {
  const errors: Partial<Record<keyof BookingInput, string>> = {};
  const trimmedName = input.fullName.trim();
  const normalizedWa = normalizeWhatsapp(input.whatsapp.trim());
  const trimmedEmail = input.email.trim();
  const trimmedNotes = input.notes.trim();
  const trimmedTransfer = input.transferProofName.trim();
  const trimmedKtp = input.ktpPhotoName.trim();

  if (!UNIT_CODE_REGEX.test(input.unitCode)) {
    errors.unitCode = 'Kode unit tidak valid. Pilih unit yang tersedia pada siteplan.';
  }

  if (trimmedName.length < 2 || trimmedName.length > FULL_NAME_MAX) {
    errors.fullName = 'Nama lengkap wajib diisi (2–100 karakter).';
  }

  if (!WHATSAPP_REGEX.test(normalizedWa)) {
    errors.whatsapp = 'Nomor WhatsApp harus diawali 08, 62, atau +62 (9–16 digit).';
  }

  if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 120) {
    errors.email = 'Format alamat email tidak valid.';
  }

  if (input.paymentScheme !== 'cash_keras' && input.paymentScheme !== 'cicilan_syariah') {
    errors.paymentScheme = 'Pilih skema pembayaran yang tersedia.';
  }

  if (trimmedTransfer.length < 3 || trimmedTransfer.length > PROOF_FILENAME_MAX) {
    errors.transferProofName = 'Foto bukti transfer wajib dilampirkan.';
  }

  if (trimmedKtp.length < 3 || trimmedKtp.length > PROOF_FILENAME_MAX) {
    errors.ktpPhotoName = 'Foto KTP wajib dilampirkan.';
  }

  if (trimmedNotes.length > NOTES_MAX) {
    errors.notes = `Catatan maksimal ${NOTES_MAX} karakter.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildOfficialWhatsappUrl(message?: string): string {
  if (!message || !message.trim()) {
    return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}`;
  }
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildUnitInquiryWhatsappMessage(params: {
  unitCode: string;
  blockName: string;
  investmentValueLabel: string;
  lt: string;
  lb: string;
}): string {
  return [
    'Assalamualaikum Tim Harmonia Student House Jatinangor,',
    `Saya tertarik memilih dan memesan unit Ekspansi Tahap 2:`,
    `- Kode Unit: ${params.unitCode}`,
    `- Blok/Tipe: ${params.blockName}`,
    `- LT / LB: ${params.lt} / ${params.lb}`,
    `- Nilai Investasi: ${params.investmentValueLabel}`,
    '',
    'Mohon informasi ketersediaan dan langkah booking selanjutnya. Terima kasih.',
  ].join('\n');
}

export function buildBookingConfirmationWhatsappMessage(params: {
  bookingCode: string;
  unitCode: string;
  blockName: string;
  investmentValueLabel: string;
  fullName: string;
  whatsapp: string;
  email: string;
  paymentScheme: PaymentScheme;
  transferProofName: string;
  ktpPhotoName: string;
  notes?: string;
}): string {
  const schemeLabel =
    params.paymentScheme === 'cash_keras' ? 'Cash Keras' : 'Cicilan Syariah';
  const lines = [
    'Assalamualaikum Tim Harmonia Student House Jatinangor,',
    `Saya telah melakukan Booking Online Ekspansi Tahap 2 dengan rincian berikut:`,
    `- Kode Booking: ${params.bookingCode}`,
    `- Kode Unit: ${params.unitCode}`,
    `- Blok/Tipe: ${params.blockName} (${params.investmentValueLabel})`,
    `- Nama Pemesan: ${params.fullName}`,
    `- No. WhatsApp: ${params.whatsapp}`,
    `- Email: ${params.email}`,
    `- Skema Pembayaran: ${schemeLabel}`,
    `- Lampiran Foto Bukti Transfer: ${params.transferProofName}`,
    `- Lampiran Foto KTP: ${params.ktpPhotoName}`,
  ];

  if (params.notes && params.notes.trim()) {
    lines.push(`- Catatan: ${params.notes.trim()}`);
  }

  lines.push(
    '',
    'Berikut saya lampirkan foto bukti transfer dan foto KTP bersama pesan WhatsApp ini untuk verifikasi unit.',
  );
  return lines.join('\n');
}

export function getBlockLetterFromId(blockId: BlockId): RoiBlockSpec['blockLetter'] {
  if (blockId === 'G1' || blockId === 'G2') return 'G';
  return blockId;
}

export function calculateInvestmentProjection(blockId: BlockId, unitCount: number) {
  const safeCount = Math.max(1, Math.min(20, Math.floor(unitCount || 1)));
  const spec = ROI_SPECS_BY_BLOCK[getBlockLetterFromId(blockId)];
  const totalInvestasiJt = Number((spec.nilaiInvestasiJt * safeCount).toFixed(2));
  const netProfitBulanJt = Number((spec.netProfitBulanJt * safeCount).toFixed(2));
  const netProfitTahunJt = Number((netProfitBulanJt * 12).toFixed(2));
  const estimasiCapitalGain5ThnJt = Number((totalInvestasiJt * 0.05 * 5).toFixed(2));

  return {
    spec,
    unitCount: safeCount,
    totalInvestasiJt,
    netProfitBulanJt,
    netProfitTahunJt,
    estimasiCapitalGain5ThnJt,
  };
}

export function createBookingReference(unitCode: string, timestampMs = Date.now()): string {
  const suffix = (timestampMs % 1000000).toString(36).toUpperCase().padStart(4, '0');
  return `HSHJ-${unitCode}-${suffix}`;
}

export interface BlockAvailabilitySummary {
  total: number;
  available: number;
  booked: number;
}

export interface Phase2AvailabilitySummary {
  totalUnits: number;
  totalAvailable: number;
  totalBooked: number;
  byBlock: Record<BlockId, BlockAvailabilitySummary>;
}

export function summarizeAvailabilityByBlock(
  units: SiteplanUnit[],
  takenCodes: Set<string>,
): Phase2AvailabilitySummary {
  const byBlock: Record<BlockId, BlockAvailabilitySummary> = {
    A: { total: 0, available: 0, booked: 0 },
    B: { total: 0, available: 0, booked: 0 },
    C: { total: 0, available: 0, booked: 0 },
    D: { total: 0, available: 0, booked: 0 },
    E: { total: 0, available: 0, booked: 0 },
    F: { total: 0, available: 0, booked: 0 },
    G1: { total: 0, available: 0, booked: 0 },
    G2: { total: 0, available: 0, booked: 0 },
    H: { total: 0, available: 0, booked: 0 },
  };

  let totalAvailable = 0;
  let totalBooked = 0;

  for (const unit of units) {
    const entry = byBlock[unit.blockId];
    entry.total += 1;
    if (takenCodes.has(unit.unitCode)) {
      entry.booked += 1;
      totalBooked += 1;
    } else {
      entry.available += 1;
      totalAvailable += 1;
    }
  }

  return {
    totalUnits: units.length,
    totalAvailable,
    totalBooked,
    byBlock,
  };
}

