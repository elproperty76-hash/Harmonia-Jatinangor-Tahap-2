import type { BlockId } from '../utils/bookingLogic';

export interface UnitDetail {
  id: BlockId;
  blockLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  tabLabel: string;
  title: string;
  subtitle: string;
  description: string;
  unitCount: number;
  unitRange: string;
  luasTanah: string;
  luasBangunan: string;
  kamarTidur?: string;
  kamarMandi: string;
  lantaiLabel?: string;
  extraFeature?: string;
  fullFurnished: boolean;
  photos: {
    main: string;
    top: string;
    bottom: string;
    extraBanner?: string;
  };
  denahTitle: string;
  denahSubTitle: string;
  denahDescription: string;
  denahImage: string;
}

export interface GalleryItem {
  id: string;
  category: 'kawasan' | 'ruko' | 'interior';
  title: string;
  image: string;
  pageRef: number;
  width: number;
  height: number;
}

export const PDF_HERO = {
  kicker: 'Peluang Investasi',
  title: 'ASET PRODUKTIF DI JATINANGOR',
  badge: 'EKSPANSI TAHAP 2',
  subtitle: 'Rukost Modern • Ring 1 UNPAD & ITB',
  producedByLabel: 'Diproduksi Oleh',
  producedBy: 'Harmonia Student House',
  developedByLabel: 'Dikembangkan Oleh',
  developedBy: 'Isykariman Property Syariah',
  heroImage: '/pdf_assets/hero_main.png',
  logoLight: '/pdf_assets/logo_light.png',
  logoDark: '/pdf_assets/logo_dark.png',
};

export const PDF_ABOUT = {
  eyebrow: 'Tentang Ekspansi Tahap 2',
  title: 'Harmonia Student House Jatinangor',
  subtitle: 'Mengembangkan Hunian, Menghadirkan Peluang Aset Produktif',
  paragraphsLeft: [
    'Harmonia Student House Tahap 2 bukan sekadar deretan tempat tinggal, melainkan sebuah lingkungan yang memberi ruang untuk belajar, beristirahat, bertemu, dan membangun kenangan.',
    'Di dalam kawasan, jalur akses, area parkir, taman, serta area masjid menjadi bagian dari rutinitas penghuni tempat perjalanan sehari-hari bermula dan kembali berlabuh.',
  ],
  blockIntroTitle: 'Setiap blok diberi nama:',
  blockIntroBody:
    'Ayman, Bajra, Cindy, Dara, Eulis, Fathya, Geiby, hingga Harmonia. Nama-nama itu mengisyaratkan kesan sebagai tokoh-tokoh dari suatu kisah yang hidup berdampingan. Semangat Mojang Priangan menjadi benang merahnya: Keanggunan, keramahan, dan kebanggaan pada tanah Pasundan. Identitas Sunda di sini bukan hanya hiasan, tetapi suasana yang ingin terasa akrab seperti kisah tentang Cekungan Bandung dan sekitarnya yang terus dikenang karena orang-orang, pertemuan, dan pengalaman di dalamnya.',
  transitionImage: '/pdf_assets/about_transition.png',
  residentsImage: '/pdf_assets/about_residents.png',
};

export interface LocationLandmark {
  id: string;
  name: string;
  duration: string;
  category: 'kampus' | 'fasilitas';
  lat: number;
  lng: number;
  note: string;
}

export const HARMONIA_COORDS = {
  lat: -6.9296,
  lng: 107.7774,
  address: 'Jl. Cikuda, Jatinangor, Kab. Sumedang, Jawa Barat',
};

export const PDF_LOCATION = {
  title: 'Lokasi Strategis',
  description:
    'Berada di pusat kawasan pendidikan Jatinangor, dengan akses mudah ke berbagai fasilitas penting',
  marketHeadline: 'Kawasan Pendidikan dengan Potensi Pasar yang kuat.',
  stats: [
    { value: '7.000+', label: 'Mahasiwa Baru setiap tahunnya' },
    { value: '55.000+', label: 'Mahasiwa Aktif di Jatinangor' },
  ],
  marketFootnote:
    'Permintaan hunian mahasiswa terus meningkat setiap tahun, menjadikan Harmonia pilihan tepat untuk investasi jangka panjang.',
  sketchImage: '/pdf_assets/location_sketch.png',
  studentImage: '/pdf_assets/location_student.png',
  landmarks: [
    {
      id: 'unpad',
      name: 'UNPAD Jatinangor',
      duration: '± 5 Menit',
      category: 'kampus',
      lat: -6.9261,
      lng: 107.7747,
      note: 'Kampus Universitas Padjadjaran Jatinangor',
    },
    {
      id: 'itb',
      name: 'ITB Jatinangor',
      duration: '± 6 Menit',
      category: 'kampus',
      lat: -6.9287,
      lng: 107.7694,
      note: 'Kampus Institut Teknologi Bandung Jatinangor',
    },
    {
      id: 'ikopin',
      name: 'IKOPIN Jatinangor',
      duration: '± 7 Menit',
      category: 'kampus',
      lat: -6.9355,
      lng: 107.7712,
      note: 'Institut Manajemen Koperasi Indonesia',
    },
    {
      id: 'kuliner',
      name: 'Area Kuliner',
      duration: '± 1 Menit',
      category: 'fasilitas',
      lat: -6.9312,
      lng: 107.7782,
      note: 'Pusat kuliner & tenant mahasiswa Jl. Cikuda',
    },
    {
      id: 'belanja',
      name: 'Pusat Perbelanjaan',
      duration: '± 3 Menit',
      category: 'fasilitas',
      lat: -6.9358,
      lng: 107.7698,
      note: 'Jatos / pusat perbelanjaan kawasan Jatinangor',
    },
    {
      id: 'tol',
      name: 'Gerbang Tol',
      duration: '± 10 Menit',
      category: 'fasilitas',
      lat: -6.9422,
      lng: 107.7565,
      note: 'Akses Gerbang Tol Cileunyi / Cisumdawu',
    },
    {
      id: 'stasiun',
      name: 'Stasiun Kereta',
      duration: '± 18 Menit',
      category: 'fasilitas',
      lat: -6.9685,
      lng: 107.7582,
      note: 'Akses Stasiun Kereta Api Cicalengka / Rancaekek / Tegalluar',
    },
  ] as LocationLandmark[],
};

export const PDF_OWNERSHIP = {
  title: 'Sistem Kepemilikan Mudah',
  description:
    'Sistem kepemilikan Harmonia dirancang untuk memberikan kemudahan, kejelasan, dan fleksibilitas bagi calon pemilik. Kemudahan tersebut tercermin dari bentuk kepemilikan, pilihan pembayaran, serta aspek legalitas yang menjadi bagian dari setiap unit.',
  image: '/pdf_assets/ownership_handshake.png',
  pillars: [
    {
      title: 'Sertifikat',
      body: 'Kepemilikian terhadap unit kost adalah sertifikat hak milik (SHM) atas sebidang tanah dan bangunan dengan beberapa opsi yaitu: 2 kamar (Rukost), 4 kamar (Apartkost), 4 kamar (Rukost), 4 kamar mezzaninne (Rukost), 6 kamar (Rukost) dan Ruko 2 Lantai.',
    },
    {
      title: 'Pembayaran',
      body: 'Harmonia Student House menyediakan pilihan pembayaran secara cash keras maupun cicilan, dengan skema yang dirancang sesuai prinsip syariah, tanpa riba, tanpa KPR bank, dan tanpa gharar.',
    },
    {
      title: 'Legalitas',
      body: 'Harmonia Student House Jatinangor Insya Allah dikembangkan dan dikelola dengan mengacu pada prinsip-prinsip syariah serta ketentuan hukum yang berlaku di Indonesia.',
    },
  ],
};

export const PDF_LEGAL = {
  shmTitle: 'Legalitas Sudah SHM',
  shmParagraphs: [
    'Dokumen kepemilikan tanah menjadi bagian penting dalam memastikan bahwa aset yang Anda investasikan memiliki dasar legalitas yang jelas dan dapat dipertanggungjawabkan.',
    'Bukti legalitas tanah kami tampilkan secara transparan sebagai bagian dari komitmen Harmonia terhadap keterbukaan kepada calon investor.',
  ],
  shmImage: '/pdf_assets/legal/shm_grid.png',
  pbgTitle: 'Proses Legalitas Bangunan',
  pbgDescription:
    'Harmonia Student House terus melengkapi tahapan legalitas pembangunan. Saat ini, Persetujuan Bangunan Gedung (PBG) sedang dalam proses pengurusan sesuai dengan ketentuan administratif dan teknis yang berlaku.',
  pbgImage: '/pdf_assets/legal/pbg_doc.png',
};

export const PDF_KEUNGGULAN = {
  title: 'Keunggulan Harmonia',
  subtitle:
    'Harmonia Student House Jatinangor membrikan nilai lebih bagi investor dengan berbagai keunggulan:',
  sideImage: '/pdf_assets/keunggulan_interior.png',
  items: [
    {
      title: 'Garansi Okupansi 4+2 Tahun',
      description: 'Memberikan kepastian perlindungan terhadap risiko unit kosong.',
    },
    {
      title: 'Full Furnished',
      description: 'Harmonia menyediakan unit dengan kamar yang sudah siap huni',
    },
    {
      title: 'Target Market Luas',
      description: 'Dekat dengan UNPAD, ITB, dan IKOPIN membuka pasar hunian yang tinggi',
    },
    {
      title: 'ROI Tinggi',
      description: 'Investasi menguntungkan dengan potensi tinggi dan berkelanjutan.',
    },
    {
      title: 'Fasilitas Shuttle Bus',
      description: 'Mendukung mobilitas yang lebih ramah lingkungan, praktis, dan berkelanjutan.',
    },
    {
      title: 'Desain Modern',
      description: 'Dirancang dengan desain modern yang menunjang kenyamanan hunian',
    },
    {
      title: 'CCTV Kawasan',
      description: 'Kawasan yang terpantau CCTV 24 jam untuk keamanan dan kenyamanan.',
    },
    {
      title: 'Security',
      description: 'Petugas keamanan siaga untuk menjaga keamanan kawasan 24 jam.',
    },
  ],
};

export const PDF_KONSEP_DESAIN = {
  title: 'Konsep Desain Bangunan',
  subtitle: 'Ekspansi Tahap 2',
  paragraphs: [
    'Mengusung konsep Modern Contemporary dengan sentuhan Tropical Minimalist, Harmonia Tahap 2 menghadirkan karakter arsitektur yang lebih modern, ekspresif, dan beridentitas. Perpaduan bentuk geometris, komposisi warna yang kontras, aksen kayu, serta elemen alami menciptakan tampilan bangunan yang khas dan berdaya tarik.',
    'Konsep desain ini memberikan identitas visual yang lebih kuat sekaligus meningkatkan daya tarik dan nilai investasi aset.',
  ],
  image: '/pdf_assets/konsep_desain.png',
};

export const PDF_UNITS: UnitDetail[] = [
  {
    id: 'A',
    blockLetter: 'A',
    tabLabel: 'Blok A · Ayman',
    title: 'Unit Rumah Kost Blok-A (Ayman)',
    subtitle: '4 Kamar Mezzanine | 2 Lantai',
    description:
      'Menghadirkan konsep rumah kost dengan kamar mezzanine yang memanfaatkan ruang secara lebih optimal. Setiap unit dirancang fungsional dan nyaman, dengan akses serta area yang tetap dikelola secara mandiri oleh pemilik.',
    unitCount: 2,
    unitRange: 'A1 – A2',
    luasTanah: '40.50 m²',
    luasBangunan: '90.20 m²',
    kamarTidur: '4 Kamar Tidur',
    kamarMandi: '4 Kamar Mandi',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p10_main.png',
      top: '/pdf_assets/units/p10_top.png',
      bottom: '/pdf_assets/units/p10_bottom.png',
    },
    denahTitle: 'Denah Rumah Kost',
    denahSubTitle: 'Mezzanine - Ayman',
    denahDescription:
      'Denah mezzanine yang dirancang untuk memaksimalkan ruang secara vertikal, tetap nyaman dan fungsional.',
    denahImage: '/pdf_assets/denah/ayman_denah.png',
  },
  {
    id: 'B',
    blockLetter: 'B',
    tabLabel: 'Blok B · Bajra',
    title: 'Unit Rumah Kost Blok-B (Bajra)',
    subtitle: '4 Kamar | 2 Lantai',
    description:
      'Setiap unit rumah kost memiliki akses masuk dan tangga pribadi, dengan seluruh kamar berada dalam satu kepemilikan. Konsep ini memberikan privasi, keleluasaan pengelolaan, serta ruang yang lebih mandiri bagi setiap pemilik.',
    unitCount: 1,
    unitRange: 'B1',
    luasTanah: '40.50 m²',
    luasBangunan: '77.78 m²',
    kamarTidur: '4 Kamar Tidur',
    kamarMandi: '4 Kamar Mandi',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p12_main.png',
      top: '/pdf_assets/units/p12_top.png',
      bottom: '/pdf_assets/units/p12_bottom.png',
    },
    denahTitle: 'Denah Rumah Kost',
    denahSubTitle: 'Bajra',
    denahDescription:
      'Tata ruang yang efisien untuk memaksimalkan kenyamanan, fungsi, dan potensi setiap unit rumah kost.',
    denahImage: '/pdf_assets/denah/bajra_denah.png',
  },
  {
    id: 'C',
    blockLetter: 'C',
    tabLabel: 'Blok C · Cindy',
    title: 'Unit Apart Kost Blok C (Cindy)',
    subtitle: '4 Kamar | 2 Lantai',
    description:
      'Konsep dua unit dalam satu bangunan menghadirkan pilihan kepemilikan yang lebih fleksibel. Dengan satu tangga bersama di tengah, setiap unit memiliki pembagian ruang yang jelas dan dapat dimanfaatkan sesuai kebutuhan pemilik.',
    unitCount: 14,
    unitRange: 'C1 – C14',
    luasTanah: '31,86 m²',
    luasBangunan: '61,80 m²',
    kamarTidur: '4 Kamar Tidur',
    kamarMandi: '4 Kamar Mandi',
    extraFeature: 'Dapur Bersama',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p14_main.png',
      top: '/pdf_assets/units/p14_top.png',
      bottom: '/pdf_assets/units/p14_bottom.png',
    },
    denahTitle: 'Denah Apart Kost',
    denahSubTitle: 'Cindy',
    denahDescription:
      'Tata ruang yang efisien untuk memaksimalkan kenyamanan, fungsi, dan potensi setiap unit apartkost.',
    denahImage: '/pdf_assets/denah/cindy_denah.png',
  },
  {
    id: 'D',
    blockLetter: 'D',
    tabLabel: 'Blok D · Dara',
    title: 'Unit Rumah Kost Blok D (Dara)',
    subtitle: '6 Kamar | 3 Lantai',
    description:
      'Menghadirkan konsep rumah kost dengan 3 lantai, bertujuan untuk memanfaatkan ruang vertikal secara lebih optimal. Setiap unit dirancang fungsional dan nyaman, dengan akses serta area yang tetap dikelola secara mandiri oleh pemilik.',
    unitCount: 3,
    unitRange: 'D1 – D3',
    luasTanah: '40.50 m²',
    luasBangunan: '116.86 m²',
    kamarTidur: '6 Kamar Tidur',
    kamarMandi: '6 Kamar Mandi',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p16_main.png',
      top: '/pdf_assets/units/p16_top.png',
      bottom: '/pdf_assets/units/p16_bottom.png',
      extraBanner: '/pdf_assets/units/dara_banner.png',
    },
    denahTitle: 'Denah Rumah Kost',
    denahSubTitle: 'Dara',
    denahDescription:
      'Denah yang dirancang secara efisien untuk memaksimalkan fungsi ruang dan kenyamanan dalam 6 kamar.',
    denahImage: '/pdf_assets/denah/dara_denah.png',
  },
  {
    id: 'E',
    blockLetter: 'E',
    tabLabel: 'Blok E · Eulis',
    title: 'Unit Rumah Kost Blok E (Eulis)',
    subtitle: '2 Kamar | 1 Lantai',
    description:
      'Menghadirkan konsep rumah kost 1 lantai 2 kamar sebagai investasi hunian kost entry-level yang terjangkau namun tetap optimal. Setiap unit memiliki pembagian ruang yang jelas dan dapat dimanfaatkan sesuai kebutuhan pemilik.',
    unitCount: 22,
    unitRange: 'E1 – E22',
    luasTanah: '24,80 m²',
    luasBangunan: '22,00 m²',
    kamarTidur: '2 Kamar Tidur',
    kamarMandi: '2 Kamar Mandi',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p18_main.png',
      top: '/pdf_assets/units/p18_top.png',
      bottom: '/pdf_assets/units/p18_bottom.png',
      extraBanner: '/pdf_assets/units/eulis_banner.png',
    },
    denahTitle: 'Denah Rumah Kost',
    denahSubTitle: 'Eulis',
    denahDescription:
      'Denah yang dirancang secara efisien untuk memaksimalkan fungsi ruang dan kenyamanan dalam 1 lantai.',
    denahImage: '/pdf_assets/denah/eulis_denah.png',
  },
  {
    id: 'F',
    blockLetter: 'F',
    tabLabel: 'Blok F · Fathya',
    title: 'Unit Rumah Kost Blok F (Fathya)',
    subtitle: '4 Kamar | 2 Lantai',
    description:
      'Setiap unit rumah kost memiliki akses masuk dan tangga pribadi, dengan seluruh kamar berada dalam satu kepemilikan. Konsep ini memberikan privasi, keleluasaan pengelolaan, serta ruang yang lebih mandiri bagi setiap pemilik dan penyewa.',
    unitCount: 8,
    unitRange: 'F1 – F8',
    luasTanah: '28,00 m²',
    luasBangunan: '52,00 m²',
    kamarTidur: '4 Kamar Tidur',
    kamarMandi: '4 Kamar Mandi',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p20_main.png',
      top: '/pdf_assets/units/p20_top.png',
      bottom: '/pdf_assets/units/p20_bottom.png',
    },
    denahTitle: 'Denah Rumah Kost',
    denahSubTitle: 'Fathya',
    denahDescription:
      'Tata ruang yang efisien untuk memaksimalkan kenyamanan, fungsi, dan potensi setiap unit rumah kost.',
    denahImage: '/pdf_assets/denah/fathya_denah.png',
  },
  {
    id: 'G1',
    blockLetter: 'G',
    tabLabel: 'Blok G1-G45 · Geiby',
    title: 'Unit Rumah Kost Blok G1 -G45 (Geiby)',
    subtitle: '2 Kamar | 1 Lantai',
    description:
      'Setiap unit rumah kost memiliki akses masuk dan tangga pribadi, dengan seluruh kamar berada dalam satu kepemilikan. Konsep ini memberikan privasi, keleluasaan pengelolaan, serta ruang yang lebih mandiri bagi setiap pemilik dan penyewa.',
    unitCount: 45,
    unitRange: 'G1 – G45 (Memanjang)',
    luasTanah: '14,00 m²',
    luasBangunan: '23,00 m²',
    kamarTidur: '2 Kamar Tidur',
    kamarMandi: '2 Kamar Mandi',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p22_main.png',
      top: '/pdf_assets/units/p22_top.png',
      bottom: '/pdf_assets/units/p22_bottom.png',
    },
    denahTitle: 'Denah Rumah Kost',
    denahSubTitle: 'Geiby (G1 - G45)',
    denahDescription:
      'Tata ruang yang efisien untuk memaksimalkan kenyamanan, fungsi, dan potensi setiap unit rumah kost.',
    denahImage: '/pdf_assets/denah/geiby1_denah.png',
  },
  {
    id: 'G2',
    blockLetter: 'G',
    tabLabel: 'Blok G46-G52 · Geiby',
    title: 'Unit Rumah Kost Blok G46 - G52 (Geiby)',
    subtitle: '2 Kamar | 1 Lantai',
    description:
      'Setiap unit rumah kost memiliki akses masuk dan tangga pribadi, dengan seluruh kamar berada dalam satu kepemilikan. Konsep ini memberikan privasi, keleluasaan pengelolaan, serta ruang yang lebih mandiri bagi setiap pemilik dan penyewa.',
    unitCount: 7,
    unitRange: 'G46 – G52 (Menyamping)',
    luasTanah: '14,00 m²',
    luasBangunan: '23,00 m²',
    kamarTidur: '2 Kamar Tidur',
    kamarMandi: '2 Kamar Mandi',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p24_main.png',
      top: '/pdf_assets/units/p24_top.png',
      bottom: '/pdf_assets/units/p24_bottom.png',
      extraBanner: '/pdf_assets/units/geiby2_banner.png',
    },
    denahTitle: 'Denah Rumah Kost',
    denahSubTitle: 'Geiby (G46 - G52)',
    denahDescription:
      'Denah yang dirancang secara efisien untuk memaksimalkan fungsi ruang dan kenyamanan dalam 1 lantai.',
    denahImage: '/pdf_assets/denah/geiby2_denah.png',
  },
  {
    id: 'H',
    blockLetter: 'H',
    tabLabel: 'Blok H · Harmonia',
    title: 'Unit Properti Komersial Blok H (Harmonia)',
    subtitle: 'Ruko 2 Lantai',
    description:
      'Pusat aktivitas bisnis strategis di kawasan pendidikan Jatinangor, yang menghadirkan peluang usaha di tengah ekosistem mahasiswa, hunian, dan masyarakat yang terus berkembang.',
    unitCount: 5,
    unitRange: 'H1 – H5',
    luasTanah: '32,00 m²',
    luasBangunan: '56,00 m²',
    lantaiLabel: '2 Lantai',
    kamarMandi: '1 Kamar Mandi',
    fullFurnished: true,
    photos: {
      main: '/pdf_assets/units/p26_main.png',
      top: '/pdf_assets/units/p26_top.png',
      bottom: '/pdf_assets/units/p26_bottom.png',
    },
    denahTitle: 'Denah Ruko',
    denahSubTitle: 'Harmonia',
    denahDescription:
      'Tata ruang yang efisien untuk memaksimalkan kenyamanan, fungsi, dan potensi setiap unit ruko.',
    denahImage: '/pdf_assets/denah/harmonia_denah.png',
  },
];

export const PDF_SPEC_BANGUNAN = {
  title: 'Spesifikasi Bangunan Harmonia',
  description:
    'Harmonia dirancang dengan bangunan modern dan fungsional, menggunakan material berkualitas dari struktur, fasad, kamar, kamar mandi, hingga interior untuk menunjang kenyamanan penghuni.',
  bannerImage: '/pdf_assets/spec_bangunan_banner.png',
  categories: [
    {
      name: 'Struktur',
      items: [
        '1. Besi D12',
        '2. Semen Gresik/Semen Padang/Setara',
        '3. Dak dengan Wiremesh dan Bondek 0.75mm',
      ],
    },
    {
      name: 'Arsitektur',
      items: [
        '1. Bata ringan 7.5 cm',
        '2. Keramik 60 x 60 Matt Surface Gray ex. Sandimas/Setara',
        '3. Keramik 60 x 60 Matt Surface Gray ex. Sandimas/Setara',
        '4. Keramik 30 x 90 Matt Surface Gray ex. Sandimas/Setara',
        '5. Pintu Kamar Solid Engineering +Smart Doorlock ex.ClenP/Setara',
        '6. Pintu Kamar Mandi uPVC',
        '7. Kusen Pintu alumunium Ex. Inkalum',
        '8. Kusen Jendela alumunium ex. Inkalum +kaca 5 mm',
        '9. Ruang Shaft/Ruang maintanance pipa (Untuk Apartkos)',
        '10. Cat Interior ex.Dulux putih',
        '11. Cat Ekstrior Weathershield putih, biru, & kuning',
        '12. Railing tangga besi hollow 40/40 dan 40/60',
      ],
    },
    {
      name: 'Sanitair',
      items: [
        '1. Pipa Air Hujan,Kotor Dan bekas PVC Tipe D ex. Rucika',
        '2. Pipa Air Bersih PVC Tipe AW Ex. Rucika',
        '3. Closet Duduk Ex. Vlok 680/setara',
        '4. Floordrain/Roofdrain Ex. Onda',
        '5. Shower set Ex. Onda',
        '6. Toren Kapasitas 1000 liter ex. Profil Tank/Setara',
        '7. Biotank Ex. Biofill/setara',
      ],
    },
    {
      name: 'Atap',
      items: [
        '1. Multiroof pasir Dark Gray',
        '2. Rangka Baja Ringan C 0.75',
      ],
    },
  ],
};

export const PDF_SPEC_INTERIOR = {
  title: 'Spesifikasi Interior Harmonia',
  description:
    'Interior Harmonia dirancang modern dan fungsional, dilengkapi furniture serta fasilitas yang menunjang kenyamanan dan kebutuhan penghuni',
  bannerImage: '/pdf_assets/spec_interior_banner.png',
  rows: [
    { no: '1.', item: 'Lemari', dimensi: '50cm x 60cm x 190cm', spesifikasi: 'Plywood 9mm-18mm' },
    { no: '2.', item: 'Meja Belajar', dimensi: '80cm x 60cm x 75cm', spesifikasi: 'Plywood 9mm-18mm, hollow' },
    { no: '3.', item: 'Kursi Belajar', dimensi: 'Ukuran Standard', spesifikasi: '' },
    { no: '4.', item: 'Dipan', dimensi: '200cm x 90cm x 30cm', spesifikasi: 'Kayu Pallete fin. Plitur' },
    { no: '5.', item: 'Kasur', dimensi: '200cm x 90cm x 30cm', spesifikasi: 'Royal Foam Grand' },
    { no: '6.', item: 'Ac', dimensi: '1/2 PK', spesifikasi: 'MIDEA /setara' },
    { no: '7.', item: 'Smart TV', dimensi: '32 Inch', spesifikasi: 'CooCaa' },
    { no: '8.', item: 'Water Heater', dimensi: '10 Liter', spesifikasi: 'Ariston' },
    { no: '9.', item: 'Bantal', dimensi: '', spesifikasi: '' },
    { no: '10.', item: 'Guling', dimensi: '', spesifikasi: '' },
    { no: '11.', item: 'Sprei + Selimut Bed Cover', dimensi: '', spesifikasi: '' },
    { no: '12.', item: 'Curtain', dimensi: '', spesifikasi: '' },
  ],
};

export const PDF_SITEPLAN = {
  title: 'Siteplan Harmonia Jatinangor',
  description:
    'Kenali tata letak Harmonia Student House Jatinangor secara menyeluruh, dengan pembagian unit yang terencana, akses yang nyaman, serta area pendukung untuk menunjang pengalaman tinggal yang lebih praktis.',
  image: '/pdf_assets/siteplan_full.png',
  unitLegend: [
    { count: 2, name: 'AYMAN', type: 'RuKost Mezzanine', spec: '4 Kamar | 2 Lantai', color: '#E85350' },
    { count: 1, name: 'BAJRA', type: 'Rumah Kost', spec: '4 Kamar | 2 Lantai', color: '#7D42A1' },
    { count: 14, name: 'CINDY', type: 'Apart Kost', spec: '4 Kamar | 2 Lantai', color: '#14A3C7' },
    { count: 3, name: 'DARA', type: 'Rumah Kost', spec: '6 Kamar | 3 Lantai', color: '#F9C934' },
    { count: 22, name: 'EULIS', type: 'Rumah Kost', spec: '2 Kamar | 1 Lantai', color: '#D9DCE1' },
    { count: 8, name: 'FATHYA', type: 'Rumah Kost', spec: '4 Kamar | 2 Lantai', color: '#BCE08A' },
    { count: 52, name: 'GEIBY', type: 'RuKost Mezzanine', spec: '2 Kamar | 1 Lantai', color: '#8DC63F' },
    { count: 5, name: 'HARMONIA', type: 'Ruko', spec: '2 Lantai', color: '#DE5B9E' },
  ],
  facilities: ['Shuttle Bus', 'Taman', 'CCTV Kawasan', 'Security'],
};

export const PDF_ROI = {
  title: 'Estimasi BEP & ROI',
  description:
    'Simulasikan potensi keuntungan investasi Harmonia Student House berdasarkan harga unit, estimasi pendapatan sewa, serta biaya operasional untuk melihat gambaran return investasi.',
  biayaIjarohTitle: 'Biaya Ijaroh (Management Fee)',
  biayaIjarohValue: 'Rp 250.000 per Kamar',
  includeBiaya: [
    'Iklan dan Pemasaran',
    'IPL Kawasan',
    'Utilitas (Listrik, Wifi)',
    'House Keeping',
    'Maintenance (Unit & Peralatan)',
  ],
  notes: [
    '*Estimasi Capital Gain 5% per tahun',
    '*Perhitungan berdasarkan skema Kerja Sama Pengelolaan (net profit setelah Biaya Ijaroh)',
    '*BEP (Break Even Point) adalah estimasi waktu pengembalian investasi dari net profit tahunan',
    '*Angka merupakan proyeksi dan dapat berubah sesuai kondisi pasar',
    '*Harga sewa per kamar adalah Net Profit / Jumlah Kamar + 250.000',
  ],
};

export const PDF_OKUPANSI = {
  title: 'Jaminan Okupansi',
  subtitle: 'Garansi Okupansi 4+2 Tahun',
  paragraphs: [
    'Perjalanan kuliah sering kali dimulai dengan rencana empat tahun. Namun, setiap mahasiswa punya ritmenya sendiri: ada yang lulus tepat waktu, ada pula yang membutuhkan waktu lebih panjang untuk menuntaskan tugas akhir, menjalani penelitian, atau menyelesaikan tahap akhir studinya.',
    'Dari pemahaman itu, skema okupansi 4+2 tahun menggambarkan rentang hingga enam tahun: empat tahun masa studi normal, ditambah kemungkinan dua tahun masa studi lanjutan sesuai batas. Bagi hunian mahasiswa, rentang ini dapat menjadi cara untuk menjelaskan potensi kebutuhan tempat tinggal selama perjalanan studi berlangsung.',
  ],
  upayaTitle: 'Upaya Pemenuhan Okupansi:',
  upayaItems: [
    {
      title: 'Hadir di Platform Kost',
      description: 'Memasarkan unit melalui platform seperti Mamikos untuk menjangkau calon penghuni.',
    },
    {
      title: 'Promosi Kamar Tersedia',
      description: 'Mempromosikan kamar kosong secara aktif melalui berbagai media sosial.',
    },
    {
      title: 'Peningkatan Layanan',
      description: 'Mengembangkan layanan kost untuk meningkatkan kenyamanan dan kepuasan penghuni.',
    },
  ],
  sideImage: '/pdf_assets/jaminan_okupansi_side.png',
};

export const PDF_GALLERY: GalleryItem[] = [
  { id: 'gal-34-top', category: 'kawasan', title: 'Gerbang Kawasan & Shuttle Bus Harmonia Jatinangor', image: '/pdf_assets/gallery/gal_34_top.png', pageRef: 34, width: 1240, height: 877 },
  { id: 'gal-34-bot', category: 'kawasan', title: 'One Gate System & Taman Masuk Harmonia Jatinangor', image: '/pdf_assets/gallery/gal_34_bottom.png', pageRef: 34, width: 1240, height: 877 },
  { id: 'gal-33-top', category: 'kawasan', title: 'Area Parkir & Lingkungan Blok Dara dan Eulis', image: '/pdf_assets/gallery/gal_33_top.png', pageRef: 33, width: 1240, height: 877 },
  { id: 'gal-33-bot', category: 'kawasan', title: 'Koridor Hunian Blok Fathya Harmonia Jatinangor', image: '/pdf_assets/gallery/gal_33_bottom.png', pageRef: 33, width: 1240, height: 877 },
  { id: 'gal-35-top', category: 'ruko', title: 'Deretan Ruko Komersial Blok H & Area Masjid', image: '/pdf_assets/gallery/gal_35_top.png', pageRef: 35, width: 1240, height: 877 },
  { id: 'gal-35-bl', category: 'kawasan', title: 'Jalur Akses Hunian Apartkost & Rukost', image: '/pdf_assets/gallery/gal_35_bl.png', pageRef: 35, width: 620, height: 877 },
  { id: 'gal-35-br', category: 'ruko', title: 'Area Taman Terbuka & Parkir Motor Kawasan', image: '/pdf_assets/gallery/gal_35_br.png', pageRef: 35, width: 620, height: 877 },
  { id: 'gal-36-tl', category: 'interior', title: 'Interior Kamar Tidur & Meja Belajar', image: '/pdf_assets/gallery/gal_36_tl.png', pageRef: 36, width: 620, height: 584 },
  { id: 'gal-36-ml', category: 'interior', title: 'Kamar Mezzanine Lantai Atas', image: '/pdf_assets/gallery/gal_36_ml.png', pageRef: 36, width: 620, height: 584 },
  { id: 'gal-36-bl', category: 'interior', title: 'Tangga Mezzanine & Ruang Belajar Bawah', image: '/pdf_assets/gallery/gal_36_bl.png', pageRef: 36, width: 620, height: 586 },
  { id: 'gal-36-tr', category: 'interior', title: 'Kamar Mandi Modern dengan Wastafel & Shower', image: '/pdf_assets/gallery/gal_36_tr.png', pageRef: 36, width: 620, height: 877 },
  { id: 'gal-36-br', category: 'interior', title: 'Area Shower & Ventilasi Kamar Mandi', image: '/pdf_assets/gallery/gal_36_br.png', pageRef: 36, width: 620, height: 877 },
  { id: 'gal-37-tl', category: 'interior', title: 'Sanitair Closet Duduk & Shower Kamar Mandi', image: '/pdf_assets/gallery/gal_37_tl.png', pageRef: 37, width: 620, height: 584 },
  { id: 'gal-37-ml', category: 'interior', title: 'Kamar Tidur Full Furnished dengan Lemari', image: '/pdf_assets/gallery/gal_37_ml.png', pageRef: 37, width: 620, height: 584 },
  { id: 'gal-37-bl', category: 'interior', title: 'Suasana Kamar Tidur & Pencahayaan Alami', image: '/pdf_assets/gallery/gal_37_bl.png', pageRef: 37, width: 620, height: 586 },
  { id: 'gal-37-tr', category: 'interior', title: 'Detail Aksen Dinding Kayu & Dekorasi Interior', image: '/pdf_assets/gallery/gal_37_tr.png', pageRef: 37, width: 620, height: 877 },
  { id: 'gal-37-br', category: 'interior', title: 'Area Meja Belajar, Rak Buku & Jendela', image: '/pdf_assets/gallery/gal_37_br.png', pageRef: 37, width: 620, height: 877 },
];
