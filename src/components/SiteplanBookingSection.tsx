import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocFromServer,
  onSnapshot,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import {
  db,
  auth,
  ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
  signInWithGoogle,
  signOutUser,
  testConnection,
} from '../firebase';
import { PDF_SITEPLAN, PDF_UNITS } from '../data/pdfContent';
import {
  generateAllUnits,
  validateBookingInput,
  validateAttachmentFile,
  normalizeWhatsapp,
  createBookingReference,
  ROI_SPECS_BY_BLOCK,
  getBlockLetterFromId,
  summarizeAvailabilityByBlock,
  buildOfficialWhatsappUrl,
  buildUnitInquiryWhatsappMessage,
  buildBookingConfirmationWhatsappMessage,
  OFFICIAL_WHATSAPP_DISPLAY,
  OFFICIAL_WHATSAPP_NUMBER,
  type BlockId,
  type PaymentScheme,
} from '../utils/bookingLogic';
import {
  Maximize2,
  CheckCircle2,
  LogIn,
  LogOut,
  MessageCircle,
  ClipboardCheck,
  ShieldAlert,
  Database,
  RefreshCw,
  ArrowDown,
  Copy,
  Check,
  UploadCloud,
  Upload,
  FileImage,
  Trash2,
  ZoomIn,
  Share2,
} from 'lucide-react';

interface UnitReservationRecord {
  unitCode: string;
  blockId: BlockId;
  status: 'booked' | 'confirmed';
  bookedByUid: string;
  bookingId: string;
}

interface AttachmentState {
  file: File;
  name: string;
  sizeLabel: string;
  previewUrl: string;
}

export interface BookingRecord {
  id: string;
  bookingCode: string;
  userId: string;
  unitCode: string;
  blockId: BlockId;
  blockName: string;
  fullName: string;
  whatsapp: string;
  email: string;
  paymentScheme: PaymentScheme;
  notes: string;
  transferProofName: string;
  ktpPhotoName: string;
  transferProofPreviewUrl?: string;
  ktpPhotoPreviewUrl?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  investmentValueLabel: string;
  source: 'cloud' | 'local';
}

interface SiteplanBookingSectionProps {
  selectedBlock: BlockId;
  onSelectBlock: (blockId: BlockId) => void;
  onOpenLightbox: (src: string, title: string, caption?: string) => void;
}

const LOCAL_BOOKINGS_KEY = 'harmonia_local_bookings_v1';

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SiteplanBookingSection({
  selectedBlock,
  onSelectBlock,
  onOpenLightbox,
}: SiteplanBookingSectionProps) {
  const allUnits = useMemo(() => generateAllUnits(), []);

  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [dbSyncStatus, setDbSyncStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');

  const [cloudReservations, setCloudReservations] = useState<Record<string, UnitReservationRecord>>({});
  const [cloudBookings, setCloudBookings] = useState<BookingRecord[]>([]);
  const [localBookings, setLocalBookings] = useState<BookingRecord[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
      return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
    } catch {
      return [];
    }
  });

  const [selectedUnitCode, setSelectedUnitCode] = useState<string>('A1');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [paymentScheme, setPaymentScheme] = useState<PaymentScheme>('cicilan_syariah');
  const [notes, setNotes] = useState('');
  const [transferProof, setTransferProof] = useState<AttachmentState | null>(null);
  const [ktpPhoto, setKtpPhoto] = useState<AttachmentState | null>(null);

  const transferInputRef = useRef<HTMLInputElement | null>(null);
  const ktpInputRef = useRef<HTMLInputElement | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [availabilityCheckMsg, setAvailabilityCheckMsg] = useState<{
    unitCode: string;
    available: boolean;
    text: string;
  } | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [latestReceipt, setLatestReceipt] = useState<BookingRecord | null>(null);
  const [latestFiles, setLatestFiles] = useState<{
    transferFile: File;
    ktpFile: File;
  } | null>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const isAdmin = Boolean(user?.emailVerified && user?.email === ADMIN_EMAIL);

  // Sync auth state
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (currentUser) {
        setAuthNotice(null);
        setFullName((prev) => prev || currentUser.displayName || '');
        setEmail((prev) => prev || currentUser.email || '');
      }
    });
    return () => unsub();
  }, []);

  // Verify Firestore connection
  useEffect(() => {
    let active = true;
    void testConnection().then((ok) => {
      if (active) {
        setDbSyncStatus((prev) => (prev === 'live' ? 'live' : ok ? 'live' : 'offline'));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist local fallback bookings
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(localBookings));
    } catch {
      // Ignore storage quota errors
    }
  }, [localBookings]);

  // Listen to public non-PII unit_reservations in Firestore
  useEffect(() => {
    const colRef = collection(db, 'unit_reservations');
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const map: Record<string, UnitReservationRecord> = {};
        snap.forEach((d) => {
          const data = d.data() as UnitReservationRecord;
          map[d.id] = data;
        });
        setCloudReservations(map);
        setDbSyncStatus('live');
      },
      (err) => {
        console.warn('Unit reservations listener warning:', err.message);
        setDbSyncStatus('offline');
      },
    );
    return () => unsub();
  }, []);

  // Listen to private bookings ONLY when auth is ready and user is authenticated
  useEffect(() => {
    if (!authReady || !user) {
      setCloudBookings([]);
      return;
    }

    const bookingsRef = collection(db, 'bookings');
    const q = isAdmin
      ? query(bookingsRef)
      : query(bookingsRef, where('userId', '==', user.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: BookingRecord[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            bookingCode: data.bookingCode,
            userId: data.userId,
            unitCode: data.unitCode,
            blockId: data.blockId,
            blockName: data.blockName,
            fullName: data.fullName,
            whatsapp: data.whatsapp,
            email: data.email,
            paymentScheme: data.paymentScheme,
            notes: data.notes,
            transferProofName: data.transferProofName || 'bukti-transfer.jpg',
            ktpPhotoName: data.ktpPhotoName || 'ktp-pemohon.jpg',
            status: data.status,
            investmentValueLabel: data.investmentValueLabel,
            source: 'cloud',
          });
        });
        setCloudBookings(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      },
    );

    return () => unsub();
  }, [authReady, user, isAdmin]);

  // Taken unit codes from both cloud reservations and non-cancelled local bookings
  const takenUnitCodes = useMemo(() => {
    const set = new Set<string>(Object.keys(cloudReservations));
    for (const lb of localBookings) {
      if (lb.status !== 'cancelled') {
        set.add(lb.unitCode);
      }
    }
    return set;
  }, [cloudReservations, localBookings]);

  const availabilitySummary = useMemo(
    () => summarizeAvailabilityByBlock(allUnits, takenUnitCodes),
    [allUnits, takenUnitCodes],
  );

  // Keep selected unit aligned when block tab changes
  useEffect(() => {
    const unitsInBlock = allUnits.filter((u) => u.blockId === selectedBlock);
    if (unitsInBlock.length > 0 && !unitsInBlock.some((u) => u.unitCode === selectedUnitCode)) {
      const firstAvailable = unitsInBlock.find((u) => !takenUnitCodes.has(u.unitCode));
      setSelectedUnitCode((firstAvailable || unitsInBlock[0]).unitCode);
      setAvailabilityCheckMsg(null);
    }
  }, [selectedBlock, allUnits, selectedUnitCode, takenUnitCodes]);

  const filteredUnits = useMemo(
    () => allUnits.filter((u) => u.blockId === selectedBlock),
    [allUnits, selectedBlock],
  );

  const getUnitStatus = useCallback(
    (unitCode: string): 'available' | 'booked' | 'confirmed' => {
      const cloud = cloudReservations[unitCode];
      if (cloud) return cloud.status;
      const local = localBookings.find(
        (b) => b.unitCode === unitCode && b.status !== 'cancelled',
      );
      if (local) return local.status === 'confirmed' ? 'confirmed' : 'booked';
      return 'available';
    },
    [cloudReservations, localBookings],
  );

  const activeUnitDetail =
    PDF_UNITS.find((u) => u.id === selectedBlock) || PDF_UNITS[0];
  const roiSpec = ROI_SPECS_BY_BLOCK[getBlockLetterFromId(selectedBlock)];
  const selectedUnitStatus = getUnitStatus(selectedUnitCode);

  const visibleBookings = useMemo(() => {
    const merged = [...cloudBookings];
    for (const lb of localBookings) {
      if (!merged.some((cb) => cb.bookingCode === lb.bookingCode)) {
        merged.push(lb);
      }
    }
    return merged;
  }, [cloudBookings, localBookings]);

  const unsyncedPendingLocals = useMemo(
    () =>
      localBookings.filter(
        (lb) =>
          lb.status !== 'cancelled' &&
          !cloudReservations[lb.unitCode] &&
          !cloudBookings.some((cb) => cb.bookingCode === lb.bookingCode),
      ),
    [localBookings, cloudReservations, cloudBookings],
  );

  async function handleGoogleSignIn() {
    setAuthNotice(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('popup-closed-by-user')) {
        setAuthNotice('Gagal masuk dengan Google. Pastikan pop-up diizinkan di browser Anda.');
      }
    }
  }

  async function handleCheckDatabaseAvailability(unitCode: string) {
    setIsCheckingDb(true);
    setSubmitError(null);
    try {
      const localTaken = localBookings.some(
        (b) => b.unitCode === unitCode && b.status !== 'cancelled',
      );
      if (localTaken) {
        setAvailabilityCheckMsg({
          unitCode,
          available: false,
          text: `Unit ${unitCode} sudah tercatat terbooking pada sesi ini.`,
        });
        return;
      }

      const snap = await getDocFromServer(doc(db, 'unit_reservations', unitCode));
      if (snap.exists()) {
        const resData = snap.data() as UnitReservationRecord;
        setCloudReservations((prev) => ({ ...prev, [unitCode]: resData }));
        setAvailabilityCheckMsg({
          unitCode,
          available: false,
          text: `Unit ${unitCode} sudah terbooking di database Tahap 2.`,
        });
      } else {
        setDbSyncStatus('live');
        setAvailabilityCheckMsg({
          unitCode,
          available: true,
          text: `Terverifikasi di database: Unit ${unitCode} tersedia untuk dibooking.`,
        });
      }
    } catch {
      const fallbackAvailable = getUnitStatus(unitCode) === 'available';
      setAvailabilityCheckMsg({
        unitCode,
        available: fallbackAvailable,
        text: fallbackAvailable
          ? `Unit ${unitCode} berstatus tersedia berdasarkan sinkronisasi terakhir.`
          : `Unit ${unitCode} sudah terbooking.`,
      });
    } finally {
      setIsCheckingDb(false);
    }
  }

  function handleAttachmentChange(
    kind: 'transfer' | 'ktp',
    file: File | null,
  ) {
    const label = kind === 'transfer' ? 'Foto Bukti Transfer' : 'Foto KTP';
    const errorKey = kind === 'transfer' ? 'transferProofName' : 'ktpPhotoName';

    if (!file) {
      if (kind === 'transfer') {
        setTransferProof(null);
      } else {
        setKtpPhoto(null);
      }
      return;
    }

    const validationError = validateAttachmentFile(
      { name: file.name, type: file.type, size: file.size },
      label,
    );
    if (validationError) {
      setFieldErrors((prev) => ({ ...prev, [errorKey]: validationError }));
      return;
    }

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });

    const previewUrl = URL.createObjectURL(file);
    const nextAttachment: AttachmentState = {
      file,
      name: file.name.trim(),
      sizeLabel: formatFileSize(file.size),
      previewUrl,
    };

    if (kind === 'transfer') {
      setTransferProof(nextAttachment);
    } else {
      setKtpPhoto(nextAttachment);
    }
  }

  function handleClearAttachment(kind: 'transfer' | 'ktp') {
    if (kind === 'transfer') {
      setTransferProof(null);
      if (transferInputRef.current) transferInputRef.current.value = '';
    } else {
      setKtpPhoto(null);
      if (ktpInputRef.current) ktpInputRef.current.value = '';
    }
  }

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setShareNotice(null);

    if (selectedUnitStatus !== 'available') {
      setSubmitError(
        `Unit ${selectedUnitCode} sudah terbooking. Silakan pilih unit lain yang masih tersedia.`,
      );
      return;
    }

    const transferName = transferProof?.name || '';
    const ktpName = ktpPhoto?.name || '';

    const validation = validateBookingInput({
      unitCode: selectedUnitCode,
      blockId: selectedBlock,
      fullName,
      whatsapp,
      email,
      paymentScheme,
      notes,
      transferProofName: transferName,
      ktpPhotoName: ktpName,
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors as Record<string, string>);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const bookingCode = createBookingReference(selectedUnitCode);
    const normalizedWa = normalizeWhatsapp(whatsapp.trim());
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanNotes = notes.trim();
    const submittedTransfer = transferProof!;
    const submittedKtp = ktpPhoto!;

    try {
      if (user && user.emailVerified) {
        // Real-time pre-commit check against Firestore database
        try {
          const serverCheck = await getDocFromServer(
            doc(db, 'unit_reservations', selectedUnitCode),
          );
          if (serverCheck.exists()) {
            const existingRes = serverCheck.data() as UnitReservationRecord;
            setCloudReservations((prev) => ({ ...prev, [selectedUnitCode]: existingRes }));
            setSubmitError(
              `Maaf, Unit ${selectedUnitCode} baru saja dibooking di database Tahap 2. Silakan pilih unit lain yang masih tersedia.`,
            );
            return;
          }
        } catch {
          // Continue with atomic writeBatch which is also protected by Firestore Rules
        }

        const bookingDocRef = doc(collection(db, 'bookings'));
        const reservationDocRef = doc(db, 'unit_reservations', selectedUnitCode);

        const batch = writeBatch(db);
        batch.set(bookingDocRef, {
          bookingCode,
          userId: user.uid,
          unitCode: selectedUnitCode,
          blockId: selectedBlock,
          blockName: activeUnitDetail.title,
          fullName: cleanName,
          whatsapp: normalizedWa,
          email: cleanEmail,
          paymentScheme,
          notes: cleanNotes,
          transferProofName: submittedTransfer.name,
          ktpPhotoName: submittedKtp.name,
          status: 'pending',
          investmentValueLabel: roiSpec.nilaiInvestasiLabel,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        batch.set(reservationDocRef, {
          unitCode: selectedUnitCode,
          blockId: selectedBlock,
          status: 'booked',
          bookedByUid: user.uid,
          bookingId: bookingDocRef.id,
          updatedAt: serverTimestamp(),
        });

        try {
          await batch.commit();
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `bookings/${bookingDocRef.id}`);
        }

        const record: BookingRecord = {
          id: bookingDocRef.id,
          bookingCode,
          userId: user.uid,
          unitCode: selectedUnitCode,
          blockId: selectedBlock,
          blockName: activeUnitDetail.title,
          fullName: cleanName,
          whatsapp: normalizedWa,
          email: cleanEmail,
          paymentScheme,
          notes: cleanNotes,
          transferProofName: submittedTransfer.name,
          ktpPhotoName: submittedKtp.name,
          transferProofPreviewUrl: submittedTransfer.previewUrl,
          ktpPhotoPreviewUrl: submittedKtp.previewUrl,
          status: 'pending',
          investmentValueLabel: roiSpec.nilaiInvestasiLabel,
          source: 'cloud',
        };
        setLatestReceipt(record);
      } else {
        // Seamless guest booking persisted locally with option to sync via Google Sign-In
        const localRecord: BookingRecord = {
          id: `local-${Date.now()}`,
          bookingCode,
          userId: 'guest',
          unitCode: selectedUnitCode,
          blockId: selectedBlock,
          blockName: activeUnitDetail.title,
          fullName: cleanName,
          whatsapp: normalizedWa,
          email: cleanEmail,
          paymentScheme,
          notes: cleanNotes,
          transferProofName: submittedTransfer.name,
          ktpPhotoName: submittedKtp.name,
          transferProofPreviewUrl: submittedTransfer.previewUrl,
          ktpPhotoPreviewUrl: submittedKtp.previewUrl,
          status: 'pending',
          investmentValueLabel: roiSpec.nilaiInvestasiLabel,
          source: 'local',
        };
        setLocalBookings((prev) => [localRecord, ...prev]);
        setLatestReceipt(localRecord);
      }

      setLatestFiles({
        transferFile: submittedTransfer.file,
        ktpFile: submittedKtp.file,
      });
      setNotes('');
      setTransferProof(null);
      setKtpPhoto(null);
      if (transferInputRef.current) transferInputRef.current.value = '';
      if (ktpInputRef.current) ktpInputRef.current.value = '';
      setAvailabilityCheckMsg(null);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? 'Gagal menyimpan booking ke database. Silakan coba lagi atau periksa koneksi Anda.'
          : 'Terjadi kesalahan saat memproses booking.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSyncLocalToCloud() {
    if (!user || !user.emailVerified || unsyncedPendingLocals.length === 0) return;
    setIsSyncingCloud(true);
    setSubmitError(null);
    try {
      for (const localBk of unsyncedPendingLocals) {
        const checkSnap = await getDocFromServer(doc(db, 'unit_reservations', localBk.unitCode));
        if (checkSnap.exists()) {
          setSubmitError(
            `Unit ${localBk.unitCode} pada booking lokal sudah terlebih dahulu dibooking di database.`,
          );
          continue;
        }
        const bookingDocRef = doc(collection(db, 'bookings'));
        const reservationDocRef = doc(db, 'unit_reservations', localBk.unitCode);
        const batch = writeBatch(db);
        batch.set(bookingDocRef, {
          bookingCode: localBk.bookingCode,
          userId: user.uid,
          unitCode: localBk.unitCode,
          blockId: localBk.blockId,
          blockName: localBk.blockName,
          fullName: localBk.fullName,
          whatsapp: localBk.whatsapp,
          email: localBk.email,
          paymentScheme: localBk.paymentScheme,
          notes: localBk.notes,
          transferProofName: localBk.transferProofName || 'bukti-transfer.jpg',
          ktpPhotoName: localBk.ktpPhotoName || 'ktp-pemohon.jpg',
          status: 'pending',
          investmentValueLabel: localBk.investmentValueLabel,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        batch.set(reservationDocRef, {
          unitCode: localBk.unitCode,
          blockId: localBk.blockId,
          status: 'booked',
          bookedByUid: user.uid,
          bookingId: bookingDocRef.id,
          updatedAt: serverTimestamp(),
        });
        await batch.commit();
        setLocalBookings((prev) => prev.filter((item) => item.id !== localBk.id));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'bookings');
    } finally {
      setIsSyncingCloud(false);
    }
  }

  async function handleAdminAction(booking: BookingRecord, action: 'confirm' | 'cancel') {
    if (booking.source === 'local') {
      setLocalBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, status: action === 'confirm' ? 'confirmed' : 'cancelled' }
            : b,
        ),
      );
      return;
    }

    if (!user) return;
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      const resRef = doc(db, 'unit_reservations', booking.unitCode);
      const batch = writeBatch(db);
      if (action === 'confirm') {
        batch.update(bookingRef, { status: 'confirmed', updatedAt: serverTimestamp() });
        batch.update(resRef, { status: 'confirmed', updatedAt: serverTimestamp() });
      } else {
        batch.update(bookingRef, { status: 'cancelled', updatedAt: serverTimestamp() });
        batch.delete(resRef);
      }
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${booking.id}`);
    }
  }

  async function handleCopyBookingCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  }

  async function handleShareProofFiles(messageText: string) {
    if (!latestFiles) return;
    setShareNotice(null);
    const files = [latestFiles.transferFile, latestFiles.ktpFile];
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files })
    ) {
      try {
        await navigator.share({
          title: `Booking Unit ${latestReceipt?.unitCode ?? ''} Harmonia Jatinangor`,
          text: messageText,
          files,
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }
    setShareNotice(
      `Browser ini belum mendukung lampiran file otomatis. Klik tombol "Kirim ke WhatsApp ${OFFICIAL_WHATSAPP_NUMBER}" lalu lampirkan 2 foto secara manual di chat WhatsApp.`,
    );
  }

  const currentStep = latestReceipt ? 3 : selectedUnitStatus === 'available' ? 2 : 1;

  return (
    <section id="booking" className="py-12 lg:py-20 bg-[#FAFAFA] scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Siteplan Harmonia Jatinangor (Page 30 verbatim) */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
                {PDF_SITEPLAN.title}
              </h2>
              <p className="text-slate-600 text-[15px] leading-relaxed">
                {PDF_SITEPLAN.description}
              </p>
              <div className="h-[3px] w-20 bg-[#F2BA36]" aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenLightbox(
                  PDF_SITEPLAN.image,
                  PDF_SITEPLAN.title,
                  'Siteplan Lengkap Blok A–H (Total 107 Unit · Resolusi Asli PDF)',
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-white border border-slate-300 text-[#1C2A44] text-xs sm:text-sm font-semibold rounded-lg hover:bg-slate-50 self-start cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Perbesar Siteplan</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenLightbox(
                PDF_SITEPLAN.image,
                PDF_SITEPLAN.title,
                'Siteplan Lengkap Blok A–H (Total 107 Unit · Resolusi Asli PDF)',
              )
            }
            className="block w-full bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer"
          >
            <img
              src={PDF_SITEPLAN.image}
              alt="Siteplan Harmonia Student House Jatinangor"
              width={1240}
              height={695}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[540px] object-contain bg-white"
            />
          </button>

          {/* Pilihan Unit Counts (Page 30 verbatim) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#1C2A44]">Pilihan Unit</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PDF_SITEPLAN.unitLegend.map((item) => (
                <div
                  key={item.name}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3"
                >
                  <div
                    className="w-11 h-11 rounded-full flex flex-col items-center justify-center text-white shrink-0 font-bold leading-none"
                    style={{ backgroundColor: item.color }}
                  >
                    <span className="text-sm font-mono tabular-nums text-[#1C2A44]">
                      {item.count}
                    </span>
                    <span className="text-[9px] text-[#1C2A44]/90">UNIT</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1C2A44] truncate">{item.name}</p>
                    <p className="text-xs italic text-slate-600 truncate">{item.type}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.spec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Unit Online Workspace */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2A44] tracking-tight">
                  Booking Unit Online
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-[#1C2A44]">
                  <Database className="w-3.5 h-3.5 text-[#D9A024]" aria-hidden="true" />
                  <span className="font-mono tabular-nums">
                    {availabilitySummary.totalAvailable}/{availabilitySummary.totalUnits} Unit Tahap 2 Tersedia
                  </span>
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Cek ketersediaan unit tahap 2 secara langsung dari database, pilih kode unit siteplan, lalu lengkapi formulir pemesanan syariah.
              </p>
              <p className="text-xs text-slate-500">
                Status sinkronisasi database:{' '}
                <strong className="text-[#1C2A44]">
                  {dbSyncStatus === 'live'
                    ? 'Terhubung Real-Time (Firestore Tahap 2)'
                    : dbSyncStatus === 'connecting'
                      ? 'Menghubungkan ke Database...'
                      : 'Mode Penyimpanan Lokal Aktif'}
                </strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start md:items-end gap-2 self-start md:self-center">
              <a
                href={buildOfficialWhatsappUrl(
                  'Assalamualaikum Tim Harmonia Student House Jatinangor, saya ingin konsultasi Booking Unit Tahap 2.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>WhatsApp {OFFICIAL_WHATSAPP_DISPLAY}</span>
              </a>

              {user ? (
                <div className="flex items-center gap-3 bg-[#FAFAFA] border border-slate-200 rounded-lg px-3.5 py-2">
                  <div className="text-xs">
                    <p className="font-bold text-[#1C2A44] truncate max-w-[160px]">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-slate-500">
                      {isAdmin ? 'Admin Harmonia' : 'Akun Investor Terhubung'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void signOutUser()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-white cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleGoogleSignIn()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#FAFAFA] hover:bg-slate-100 border border-slate-300 text-[#1C2A44] text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk dengan Google (Simpan Cloud)</span>
                </button>
              )}
              {authNotice && <p className="text-xs text-red-600">{authNotice}</p>}
            </div>
          </div>

          {/* 3-Step Guided Flow Progress */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
            {[
              { step: 1, title: '1. Pilih Blok & Unit' },
              { step: 2, title: '2. Isi Data Pemesanan' },
              { step: 3, title: '3. Konfirmasi & Referensi' },
            ].map((item) => {
              const reached = currentStep >= item.step;
              return (
                <div
                  key={item.step}
                  className={`px-3 py-2.5 rounded-lg border text-center sm:text-left font-semibold transition-colors ${
                    reached
                      ? 'bg-[#1C2A44] text-white border-[#1C2A44]'
                      : 'bg-[#FAFAFA] text-slate-500 border-slate-200'
                  }`}
                >
                  <span className={reached ? 'text-[#F2BA36]' : 'text-slate-400'}>● </span>
                  {item.title}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step 1: Interactive Unit Picker */}
            <div id="unit-picker" className="lg:col-span-6 space-y-5 min-w-0 scroll-mt-20">
              <div className="space-y-2 min-w-0">
                <p className="text-sm font-bold text-[#1C2A44]">
                  1. Pilih Blok &amp; Kode Unit Siteplan
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 w-full max-w-full min-w-0 sm:flex-wrap">
                  {PDF_UNITS.map((u) => {
                    const stats = availabilitySummary.byBlock[u.id];
                    const isActive = selectedBlock === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => onSelectBlock(u.id)}
                        className={`px-3 py-2 min-h-[42px] text-xs font-semibold rounded-lg border whitespace-nowrap shrink-0 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#1C2A44] text-white border-[#1C2A44]'
                            : 'bg-[#FAFAFA] text-[#1C2A44] border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span>{u.tabLabel}</span>
                        <span
                          className={`font-mono tabular-nums text-[11px] ${
                            isActive ? 'text-[#F2BA36]' : 'text-slate-500'
                          }`}
                        >
                          ({stats.available}/{stats.total})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-white border border-slate-300 inline-block" />
                  Tersedia
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#F2BA36] inline-block" />
                  Dipilih
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-200 inline-block" />
                  Terbooking / Terkonfirmasi
                </span>
              </div>

              {/* Unit Grid */}
              <div className="bg-[#FAFAFA] border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 gap-2">
                  <span className="font-semibold text-[#1C2A44] truncate">
                    {activeUnitDetail.title}
                  </span>
                  <span className="font-mono tabular-nums shrink-0">
                    {filteredUnits.filter((u) => getUnitStatus(u.unitCode) === 'available').length}/
                    {filteredUnits.length} Tersedia
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {filteredUnits.map((unit) => {
                    const status = getUnitStatus(unit.unitCode);
                    const isSelected = selectedUnitCode === unit.unitCode;
                    const isTaken = status !== 'available';

                    return (
                      <button
                        key={unit.unitCode}
                        type="button"
                        disabled={isTaken}
                        onClick={() => {
                          setSelectedUnitCode(unit.unitCode);
                          setAvailabilityCheckMsg(null);
                        }}
                        aria-label={`Unit ${unit.unitCode} ${isTaken ? 'sudah terbooking' : 'tersedia'}`}
                        className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-mono font-semibold tabular-nums border transition-colors ${
                          isTaken
                            ? 'bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-[#F2BA36] text-[#1C2A44] border-[#D9A024] ring-2 ring-[#1C2A44]/20 cursor-pointer'
                              : 'bg-white text-[#1C2A44] border-slate-200 hover:border-[#1C2A44] cursor-pointer'
                        }`}
                      >
                        {unit.unitCode}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Unit Summary + Live DB Availability Check */}
              <div className="bg-[#1C2A44] text-white rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-white/70">Unit Dipilih</p>
                    <p className="text-base font-bold font-mono tabular-nums text-[#F2BA36] mt-0.5">
                      {selectedUnitCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70">Nilai Investasi</p>
                    <p className="text-sm font-bold font-mono tabular-nums mt-0.5">
                      {roiSpec.nilaiInvestasiLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70">LT / LB</p>
                    <p className="text-sm font-semibold font-mono tabular-nums mt-0.5">
                      {activeUnitDetail.luasTanah} / {activeUnitDetail.luasBangunan}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70">Estimasi ROI Total</p>
                    <p className="text-sm font-bold font-mono tabular-nums text-[#F2BA36] mt-0.5">
                      {roiSpec.roiTotalLabel}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                    <button
                      type="button"
                      disabled={isCheckingDb}
                      onClick={() => void handleCheckDatabaseAvailability(selectedUnitCode)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/20 cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-[#F2BA36] ${isCheckingDb ? 'animate-spin' : ''}`}
                        aria-hidden="true"
                      />
                      <span>
                        {isCheckingDb
                          ? 'Memeriksa Database...'
                          : `Cek Ketersediaan Unit ${selectedUnitCode}`}
                      </span>
                    </button>

                    <a
                      href={buildOfficialWhatsappUrl(
                        buildUnitInquiryWhatsappMessage({
                          unitCode: selectedUnitCode,
                          blockName: activeUnitDetail.title,
                          investmentValueLabel: roiSpec.nilaiInvestasiLabel,
                          lt: activeUnitDetail.luasTanah,
                          lb: activeUnitDetail.luasBangunan,
                        }),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Tanya Unit {selectedUnitCode} via WhatsApp</span>
                    </a>
                  </div>

                  <a
                    href="#booking-form"
                    className="lg:hidden inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-[#F2BA36] text-[#1C2A44] text-xs font-bold"
                  >
                    <span>Lanjut Isi Form &amp; Upload Bukti</span>
                    <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>

                {availabilityCheckMsg && (
                  <p
                    role="status"
                    className={`text-xs px-3 py-2 rounded-lg border ${
                      availabilityCheckMsg.available
                        ? 'bg-emerald-950/50 border-emerald-400/40 text-emerald-100'
                        : 'bg-red-950/50 border-red-400/40 text-red-100'
                    }`}
                  >
                    {availabilityCheckMsg.text}
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: Online Booking Form */}
            <div id="booking-form" className="lg:col-span-6 min-w-0 scroll-mt-20">
              <form
                onSubmit={handleBookingSubmit}
                noValidate
                className="bg-[#FAFAFA] border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#1C2A44]">
                    2. Data Pemesanan Unit ({selectedUnitCode})
                  </p>
                  <a
                    href="#unit-picker"
                    className="lg:hidden text-xs font-semibold text-[#1C2A44] underline"
                  >
                    Ganti Unit
                  </a>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong className="text-[#1C2A44]">{activeUnitDetail.title}</strong> ·{' '}
                    {activeUnitDetail.subtitle}
                  </span>
                  <span className="font-mono font-bold text-[#1C2A44]">
                    Net Profit {roiSpec.netProfitBulanLabel}/bln
                  </span>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="booking-fullname" className="block text-xs font-semibold text-[#1C2A44]">
                    Nama Lengkap *
                  </label>
                  <input
                    id="booking-fullname"
                    type="text"
                    required
                    maxLength={100}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 min-h-[44px] text-sm bg-white border border-slate-300 rounded-lg text-[#1C2A44] focus:outline-2 focus:outline-[#1C2A44]"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-xs text-red-600">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="booking-whatsapp" className="block text-xs font-semibold text-[#1C2A44]">
                      Nomor WhatsApp *
                    </label>
                    <input
                      id="booking-whatsapp"
                      type="tel"
                      required
                      maxLength={20}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2.5 min-h-[44px] text-sm bg-white border border-slate-300 rounded-lg text-[#1C2A44] font-mono focus:outline-2 focus:outline-[#1C2A44]"
                    />
                    {fieldErrors.whatsapp && (
                      <p className="text-xs text-red-600">{fieldErrors.whatsapp}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="booking-email" className="block text-xs font-semibold text-[#1C2A44]">
                      Alamat Email *
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      maxLength={120}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-3.5 py-2.5 min-h-[44px] text-sm bg-white border border-slate-300 rounded-lg text-[#1C2A44] focus:outline-2 focus:outline-[#1C2A44]"
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-600">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="booking-scheme" className="block text-xs font-semibold text-[#1C2A44]">
                    Pilihan Pembayaran (Sesuai Prinsip Syariah) *
                  </label>
                  <select
                    id="booking-scheme"
                    value={paymentScheme}
                    onChange={(e) => setPaymentScheme(e.target.value as PaymentScheme)}
                    className="w-full max-w-full min-w-0 px-3.5 py-2.5 min-h-[44px] text-sm bg-white border border-slate-300 rounded-lg text-[#1C2A44] focus:outline-2 focus:outline-[#1C2A44]"
                  >
                    <option value="cash_keras">Cash Keras</option>
                    <option value="cicilan_syariah">Cicilan Syariah (Tanpa Riba, Tanpa KPR Bank, Tanpa Gharar)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="booking-notes" className="block text-xs font-semibold text-[#1C2A44]">
                    Catatan / Permintaan Jadwal Survei (Opsional)
                  </label>
                  <textarea
                    id="booking-notes"
                    rows={2}
                    maxLength={400}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Mohon info jadwal survei lokasi akhir pekan."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-[#1C2A44] focus:outline-2 focus:outline-[#1C2A44]"
                  />
                  {fieldErrors.notes && (
                    <p className="text-xs text-red-600">{fieldErrors.notes}</p>
                  )}
                </div>

                {/* Required Photo Attachments: Transfer Proof + KTP */}
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-[#1C2A44]">
                      Lampiran Foto Wajib untuk Booking &amp; Kirim WhatsApp *
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Format JPG, PNG, atau WEBP (maks. 10 MB per foto).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Transfer Proof Upload */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                      <label
                        htmlFor="booking-transfer-proof"
                        className="block text-xs font-semibold text-[#1C2A44]"
                      >
                        Foto Bukti Transfer *
                      </label>
                      <input
                        ref={transferInputRef}
                        id="booking-transfer-proof"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/*"
                        onChange={(e) =>
                          handleAttachmentChange('transfer', e.target.files?.[0] || null)
                        }
                        className="sr-only"
                      />

                      {transferProof ? (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenLightbox(
                                transferProof.previewUrl,
                                `Foto Bukti Transfer · Unit ${selectedUnitCode}`,
                                transferProof.name,
                              )
                            }
                            className="relative w-full h-28 rounded-md overflow-hidden border border-slate-200 bg-slate-50 block cursor-pointer group"
                          >
                            <img
                              src={transferProof.previewUrl}
                              alt="Preview Foto Bukti Transfer"
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1C2A44]/85 text-white text-[10px] font-semibold">
                              <ZoomIn className="w-3 h-3" />
                              Perbesar
                            </span>
                          </button>
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="truncate font-medium text-[#1C2A44]">
                              {transferProof.name} ({transferProof.sizeLabel})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleClearAttachment('transfer')}
                              aria-label="Hapus Foto Bukti Transfer"
                              className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="booking-transfer-proof"
                          className="flex flex-col items-center justify-center gap-1.5 min-h-[104px] px-3 py-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#1C2A44] bg-[#FAFAFA] text-center cursor-pointer transition-colors"
                        >
                          <Upload className="w-5 h-5 text-[#1C2A44]" aria-hidden="true" />
                          <span className="text-xs font-semibold text-[#1C2A44]">
                            Unggah Foto Bukti Transfer
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Klik / pilih dari galeri
                          </span>
                        </label>
                      )}

                      {fieldErrors.transferProofName && (
                        <p className="text-xs text-red-600">{fieldErrors.transferProofName}</p>
                      )}
                    </div>

                    {/* KTP Photo Upload */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                      <label
                        htmlFor="booking-ktp-photo"
                        className="block text-xs font-semibold text-[#1C2A44]"
                      >
                        Foto KTP Pemohon *
                      </label>
                      <input
                        ref={ktpInputRef}
                        id="booking-ktp-photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/*"
                        onChange={(e) =>
                          handleAttachmentChange('ktp', e.target.files?.[0] || null)
                        }
                        className="sr-only"
                      />

                      {ktpPhoto ? (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenLightbox(
                                ktpPhoto.previewUrl,
                                `Foto KTP · Unit ${selectedUnitCode}`,
                                ktpPhoto.name,
                              )
                            }
                            className="relative w-full h-28 rounded-md overflow-hidden border border-slate-200 bg-slate-50 block cursor-pointer group"
                          >
                            <img
                              src={ktpPhoto.previewUrl}
                              alt="Preview Foto KTP"
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1C2A44]/85 text-white text-[10px] font-semibold">
                              <ZoomIn className="w-3 h-3" />
                              Perbesar
                            </span>
                          </button>
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="truncate font-medium text-[#1C2A44]">
                              {ktpPhoto.name} ({ktpPhoto.sizeLabel})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleClearAttachment('ktp')}
                              aria-label="Hapus Foto KTP"
                              className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="booking-ktp-photo"
                          className="flex flex-col items-center justify-center gap-1.5 min-h-[104px] px-3 py-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#1C2A44] bg-[#FAFAFA] text-center cursor-pointer transition-colors"
                        >
                          <FileImage className="w-5 h-5 text-[#1C2A44]" aria-hidden="true" />
                          <span className="text-xs font-semibold text-[#1C2A44]">
                            Unggah Foto KTP
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Klik / pilih dari galeri
                          </span>
                        </label>
                      )}

                      {fieldErrors.ktpPhotoName && (
                        <p className="text-xs text-red-600">{fieldErrors.ktpPhotoName}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || selectedUnitStatus !== 'available'}
                  className="w-full py-3.5 px-5 min-h-[48px] bg-[#1C2A44] hover:bg-[#142035] disabled:bg-slate-300 disabled:text-slate-500 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {isSubmitting
                    ? 'Memverifikasi & Menyimpan Booking...'
                    : `Konfirmasi Booking Unit ${selectedUnitCode} & Siapkan WhatsApp`}
                </button>
              </form>
            </div>
          </div>

          {/* Step 3: Booking Confirmation Receipt + WhatsApp Connect */}
          {latestReceipt && (() => {
            const whatsappMessage = buildBookingConfirmationWhatsappMessage({
              bookingCode: latestReceipt.bookingCode,
              unitCode: latestReceipt.unitCode,
              blockName: latestReceipt.blockName,
              investmentValueLabel: latestReceipt.investmentValueLabel,
              fullName: latestReceipt.fullName,
              whatsapp: latestReceipt.whatsapp,
              email: latestReceipt.email,
              paymentScheme: latestReceipt.paymentScheme,
              transferProofName: latestReceipt.transferProofName,
              ktpPhotoName: latestReceipt.ktpPhotoName,
              notes: latestReceipt.notes,
            });
            const whatsappUrl = buildOfficialWhatsappUrl(whatsappMessage);

            return (
              <div
                role="status"
                className="bg-[#1C2A44] text-white rounded-xl p-5 sm:p-6 space-y-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#F2BA36] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold">
                        Booking Unit {latestReceipt.unitCode} Siap Dikirim ke WhatsApp ({OFFICIAL_WHATSAPP_NUMBER})
                      </h3>
                      <p className="text-xs sm:text-sm text-white/85">
                        Kode Referensi:{' '}
                        <strong className="font-mono text-[#F2BA36]">
                          {latestReceipt.bookingCode}
                        </strong>{' '}
                        · {latestReceipt.blockName} ({latestReceipt.investmentValueLabel})
                      </p>
                      <p className="text-xs text-white/75">
                        Atas nama {latestReceipt.fullName} ·{' '}
                        {latestReceipt.paymentScheme === 'cash_keras'
                          ? 'Cash Keras'
                          : 'Cicilan Syariah'}{' '}
                        · Status:{' '}
                        <strong className="text-[#F2BA36]">
                          {latestReceipt.source === 'cloud'
                            ? 'Tersimpan di Database Cloud'
                            : 'Tersimpan di Perangkat (Klik Masuk Google untuk sinkron ke Cloud)'}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleCopyBookingCode(latestReceipt.bookingCode)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4 text-[#F2BA36]" />
                          <span>Kode Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Salin Kode</span>
                        </>
                      )}
                    </button>

                    {latestFiles && (
                      <button
                        type="button"
                        onClick={() => void handleShareProofFiles(whatsappMessage)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-[#F2BA36]" />
                        <span>Bagikan Foto Lampiran</span>
                      </button>
                    )}

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Kirim ke WhatsApp {OFFICIAL_WHATSAPP_NUMBER}</span>
                    </a>
                  </div>
                </div>

                {/* Attached Proof Photos Preview + Message Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4 border-t border-white/15">
                  <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                    <div className="bg-white/10 border border-white/15 rounded-lg p-2.5 space-y-1.5">
                      <p className="text-[11px] font-semibold text-[#F2BA36]">
                        Foto Bukti Transfer
                      </p>
                      {latestReceipt.transferProofPreviewUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenLightbox(
                              latestReceipt.transferProofPreviewUrl!,
                              `Bukti Transfer · ${latestReceipt.bookingCode}`,
                              latestReceipt.transferProofName,
                            )
                          }
                          className="w-full h-24 rounded overflow-hidden bg-white block cursor-pointer"
                        >
                          <img
                            src={latestReceipt.transferProofPreviewUrl}
                            alt="Foto Bukti Transfer Terlampir"
                            className="w-full h-full object-contain"
                          />
                        </button>
                      )}
                      <p className="text-[11px] text-white/80 truncate">
                        {latestReceipt.transferProofName}
                      </p>
                    </div>

                    <div className="bg-white/10 border border-white/15 rounded-lg p-2.5 space-y-1.5">
                      <p className="text-[11px] font-semibold text-[#F2BA36]">
                        Foto KTP Pemohon
                      </p>
                      {latestReceipt.ktpPhotoPreviewUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenLightbox(
                              latestReceipt.ktpPhotoPreviewUrl!,
                              `Foto KTP · ${latestReceipt.bookingCode}`,
                              latestReceipt.ktpPhotoName,
                            )
                          }
                          className="w-full h-24 rounded overflow-hidden bg-white block cursor-pointer"
                        >
                          <img
                            src={latestReceipt.ktpPhotoPreviewUrl}
                            alt="Foto KTP Terlampir"
                            className="w-full h-full object-contain"
                          />
                        </button>
                      )}
                      <p className="text-[11px] text-white/80 truncate">
                        {latestReceipt.ktpPhotoName}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-white/10 border border-white/15 rounded-lg p-3 space-y-1.5">
                    <p className="text-[11px] font-semibold text-[#F2BA36]">
                      Ringkasan Pesan WhatsApp ke {OFFICIAL_WHATSAPP_DISPLAY}
                    </p>
                    <p className="text-xs text-white/85 whitespace-pre-line leading-relaxed">
                      {whatsappMessage}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-white/80">
                  Klik tombol hijau <strong className="text-white">Kirim ke WhatsApp {OFFICIAL_WHATSAPP_NUMBER}</strong> di atas untuk membuka chat WhatsApp dengan format booking otomatis, lalu sertakan kedua foto (Bukti Transfer &amp; KTP) pada chat WhatsApp tersebut.
                </p>

                {shareNotice && (
                  <p className="text-xs bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[#F2BA36]">
                    {shareNotice}
                  </p>
                )}
              </div>
            );
          })()}

          {/* User's Bookings / Admin Management List */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#1C2A44]" aria-hidden="true" />
                <h3 className="text-base font-bold text-[#1C2A44]">
                  {isAdmin ? 'Daftar Semua Booking Unit (Admin)' : 'Riwayat Booking Unit Saya'}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {user?.emailVerified && unsyncedPendingLocals.length > 0 && (
                  <button
                    type="button"
                    disabled={isSyncingCloud}
                    onClick={() => void handleSyncLocalToCloud()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#1C2A44] text-white text-xs font-semibold cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#F2BA36]" />
                    <span>
                      {isSyncingCloud
                        ? 'Menyinkronkan...'
                        : `Sinkronkan ${unsyncedPendingLocals.length} Booking ke Cloud`}
                    </span>
                  </button>
                )}
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  {visibleBookings.length} Data
                </span>
              </div>
            </div>

            {visibleBookings.length === 0 ? (
              <div className="bg-[#FAFAFA] border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
                Belum ada unit yang dibooking pada sesi ini. Pilih unit di atas untuk memulai pemesanan online.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleBookings.map((bk) => {
                  const historyWaUrl = buildOfficialWhatsappUrl(
                    buildBookingConfirmationWhatsappMessage({
                      bookingCode: bk.bookingCode,
                      unitCode: bk.unitCode,
                      blockName: bk.blockName,
                      investmentValueLabel: bk.investmentValueLabel,
                      fullName: bk.fullName,
                      whatsapp: bk.whatsapp,
                      email: bk.email,
                      paymentScheme: bk.paymentScheme,
                      transferProofName: bk.transferProofName || 'bukti-transfer.jpg',
                      ktpPhotoName: bk.ktpPhotoName || 'ktp-pemohon.jpg',
                      notes: bk.notes,
                    }),
                  );
                  return (
                    <div
                      key={bk.id}
                      className="bg-[#FAFAFA] border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-bold text-[#1C2A44]">
                            Unit {bk.unitCode} · {bk.bookingCode}
                          </span>
                          <span className="text-xs font-semibold text-[#1C2A44]">
                            {bk.status === 'confirmed'
                              ? 'Terkonfirmasi'
                              : bk.status === 'cancelled'
                                ? 'Dibatalkan'
                                : 'Menunggu Konfirmasi'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{bk.blockName}</p>
                        <p className="text-xs text-slate-700">
                          {bk.fullName} · {bk.whatsapp} ·{' '}
                          {bk.paymentScheme === 'cash_keras' ? 'Cash Keras' : 'Cicilan Syariah'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          Bukti Transfer: {bk.transferProofName || '-'} · KTP:{' '}
                          {bk.ktpPhotoName || '-'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                        <a
                          href={historyWaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md"
                        >
                          <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Kirim WhatsApp</span>
                        </a>

                        {bk.status === 'pending' && isAdmin && (
                          <button
                            type="button"
                            onClick={() => void handleAdminAction(bk, 'confirm')}
                            className="px-3 py-1.5 min-h-[36px] bg-[#1C2A44] text-white text-xs font-semibold rounded-md cursor-pointer"
                          >
                            Konfirmasi Unit
                          </button>
                        )}
                        {bk.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => void handleAdminAction(bk, 'cancel')}
                            className="px-3 py-1.5 min-h-[36px] bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 cursor-pointer"
                          >
                            Batalkan Booking
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
