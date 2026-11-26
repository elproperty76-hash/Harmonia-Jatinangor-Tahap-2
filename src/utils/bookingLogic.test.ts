import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateAllUnits,
  validateBookingInput,
  validateAttachmentFile,
  calculateInvestmentProjection,
  createBookingReference,
  normalizeWhatsapp,
  summarizeAvailabilityByBlock,
  buildOfficialWhatsappUrl,
  buildUnitInquiryWhatsappMessage,
  buildBookingConfirmationWhatsappMessage,
  OFFICIAL_WHATSAPP_NUMBER,
} from './bookingLogic';

test('generateAllUnits produces exactly 107 siteplan units matching PDF totals', () => {
  const units = generateAllUnits();
  assert.equal(units.length, 107);

  const countByBlock = units.reduce<Record<string, number>>((acc, u) => {
    acc[u.blockLetter] = (acc[u.blockLetter] || 0) + 1;
    return acc;
  }, {});

  assert.deepEqual(countByBlock, {
    A: 2,
    B: 1,
    C: 14,
    D: 3,
    E: 22,
    F: 8,
    G: 52,
    H: 5,
  });
});

test('validateBookingInput accepts valid Indonesian WhatsApp, email, and proof attachments', () => {
  const result = validateBookingInput({
    unitCode: 'G12',
    blockId: 'G1',
    fullName: 'Ahmad Fauzan',
    whatsapp: '0812-3456-7890',
    email: 'fauzan@example.com',
    paymentScheme: 'cicilan_syariah',
    notes: 'Mohon jadwalkan survei lokasi pekan ini.',
    transferProofName: 'bukti-transfer-g12.jpg',
    ktpPhotoName: 'ktp-ahmad.png',
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(normalizeWhatsapp('0812-3456-7890'), '081234567890');
});

test('validateBookingInput rejects invalid unit code, missing proof photos, bad phone, and bad email', () => {
  const result = validateBookingInput({
    unitCode: 'Z99',
    blockId: 'A',
    fullName: 'A',
    whatsapp: '12345',
    email: 'invalid-email',
    paymentScheme: 'cash_keras',
    notes: '',
    transferProofName: '',
    ktpPhotoName: '',
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.unitCode);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.whatsapp);
  assert.ok(result.errors.email);
  assert.ok(result.errors.transferProofName);
  assert.ok(result.errors.ktpPhotoName);
});

test('validateAttachmentFile enforces image type and 10MB limit', () => {
  assert.equal(
    validateAttachmentFile({ name: 'bukti.jpg', type: 'image/jpeg', size: 102400 }, 'Foto Bukti Transfer'),
    null,
  );
  assert.ok(
    validateAttachmentFile({ name: 'dokumen.pdf', type: 'application/pdf', size: 1024 }, 'Foto KTP'),
  );
  assert.ok(
    validateAttachmentFile({ name: 'oversize.png', type: 'image/png', size: 12 * 1024 * 1024 }, 'Foto Bukti Transfer'),
  );
});

test('official WhatsApp URL and booking confirmation text target 6281319378485 with attachment info', () => {
  assert.equal(OFFICIAL_WHATSAPP_NUMBER, '6281319378485');
  assert.equal(buildOfficialWhatsappUrl(), 'https://wa.me/6281319378485');

  const inquiry = buildUnitInquiryWhatsappMessage({
    unitCode: 'E12',
    blockName: 'Unit Rumah Kost Blok E (Eulis)',
    investmentValueLabel: 'Rp333 jt',
    lt: '24,80 m²',
    lb: '22,00 m²',
  });
  assert.match(inquiry, /E12/);
  assert.match(inquiry, /Rp333 jt/);

  const confirmText = buildBookingConfirmationWhatsappMessage({
    bookingCode: 'HSHJ-E12-ABCD',
    unitCode: 'E12',
    blockName: 'Unit Rumah Kost Blok E (Eulis)',
    investmentValueLabel: 'Rp333 jt',
    fullName: 'Siti Rahma',
    whatsapp: '081234567890',
    email: 'siti@example.com',
    paymentScheme: 'cicilan_syariah',
    transferProofName: 'transfer-dp.jpg',
    ktpPhotoName: 'ktp-siti.jpg',
  });
  assert.match(confirmText, /HSHJ-E12-ABCD/);
  assert.match(confirmText, /transfer-dp\.jpg/);
  assert.match(confirmText, /ktp-siti\.jpg/);
  assert.match(buildOfficialWhatsappUrl(confirmText), /^https:\/\/wa\.me\/6281319378485\?text=/);
});

test('calculateInvestmentProjection computes exact PDF totals for multiple units', () => {
  const proj = calculateInvestmentProjection('G1', 2);
  assert.equal(proj.totalInvestasiJt, 444);
  assert.equal(proj.netProfitBulanJt, 4.4);
  assert.equal(proj.netProfitTahunJt, 52.8);
  assert.equal(proj.spec.roiTotalLabel, '16,89%');
});

test('createBookingReference formats deterministic uppercase reference code', () => {
  const ref = createBookingReference('A1', 1732500000000);
  assert.match(ref, /^HSHJ-A1-[A-Z0-9]+$/);
});

test('summarizeAvailabilityByBlock tracks total and per-block Phase 2 unit availability', () => {
  const units = generateAllUnits();
  const taken = new Set(['A1', 'G12', 'G48', 'H2']);
  const summary = summarizeAvailabilityByBlock(units, taken);
  assert.equal(summary.totalUnits, 107);
  assert.equal(summary.totalBooked, 4);
  assert.equal(summary.totalAvailable, 103);
  assert.deepEqual(summary.byBlock.A, { total: 2, available: 1, booked: 1 });
  assert.deepEqual(summary.byBlock.G1, { total: 45, available: 44, booked: 1 });
  assert.deepEqual(summary.byBlock.G2, { total: 7, available: 6, booked: 1 });
  assert.deepEqual(summary.byBlock.H, { total: 5, available: 4, booked: 1 });
});


