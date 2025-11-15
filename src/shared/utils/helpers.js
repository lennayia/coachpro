// 🛠️ Pomocné funkce pro CoachPro

/**
 * Konvertuje File na base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Získá délku audio souboru v sekundách
 */
export const getAudioDuration = (file) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      resolve(Math.floor(audio.duration));
      URL.revokeObjectURL(audio.src);
    });
    audio.addEventListener('error', reject);
  });
};

/**
 * Získá délku video souboru v sekundách
 */
export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.addEventListener('loadedmetadata', () => {
      resolve(Math.floor(video.duration));
      URL.revokeObjectURL(video.src);
    });
    video.addEventListener('error', reject);
  });
};

/**
 * Získá počet stran z PDF souboru
 */
export const getPdfPageCount = async (file) => {
  try {
    const pdfjsLib = await import('pdfjs-dist');

    // Use worker from unpkg CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    return pdf.numPages;
  } catch (error) {
    console.error('Error getting PDF page count:', error);
    return null;
  }
};

/**
 * Odhadne počet stran z textového obsahu
 * Průměrně 2000 znaků = 1 strana A4
 */
export const estimateTextPageCount = (text) => {
  if (!text) return 0;
  const charsPerPage = 2000;
  const charCount = text.length;
  return Math.max(1, Math.ceil(charCount / charsPerPage));
};

/**
 * Formátuje velikost souboru (bytes -> human readable)
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formátuje čas v sekundách na MM:SS nebo HH:MM:SS
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';

  // Pro videa delší než hodina - HH:MM:SS
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Pro videa kratší než hodina - MM:SS
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formátuje počet stran
 */
export const formatPageCount = (pages) => {
  if (!pages || pages < 1) return '';
  if (pages === 1) return '1 strana';
  if (pages >= 2 && pages <= 4) return `${pages} strany`;
  return `${pages} stran`;
};

/**
 * Formátuje čas v sekundách na HH:MM:SS (pro delší nahrávky)
 */
export const formatLongDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00:00';

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formátuje datum podle locale
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  return date.toLocaleDateString('cs-CZ', defaultOptions);
};

/**
 * Relativní čas (např. "před 2 hodinami")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'právě teď';
  if (diffMin < 60) return `před ${diffMin} ${diffMin === 1 ? 'minutou' : diffMin < 5 ? 'minutami' : 'minutami'}`;
  if (diffHour < 24) return `před ${diffHour} ${diffHour === 1 ? 'hodinou' : diffHour < 5 ? 'hodinami' : 'hodinami'}`;
  if (diffDay < 7) return `před ${diffDay} ${diffDay === 1 ? 'dnem' : diffDay < 5 ? 'dny' : 'dny'}`;

  return formatDate(dateString);
};

/**
 * Získá accept string pro file input podle typu
 */
export const getAcceptString = (type) => {
  switch (type) {
    case 'audio':
      return 'audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/aac,audio/ogg';
    case 'pdf':
      return 'application/pdf';
    case 'document':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.presentation,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp';
    case 'text':
      return 'text/plain';
    case 'image':
      return 'image/jpeg,image/png,image/jpg,image/webp,image/gif,image/svg+xml,image/heic,image/heif,.heic,.heif';
    case 'video':
      return 'video/mp4,video/quicktime,video/webm,video/x-msvideo,.mp4,.mov,.webm,.avi';
    default:
      return '*/*';
  }
};

/**
 * Získá hint text pro file input podle typu
 */
export const getFileTypeHint = (type) => {
  switch (type) {
    case 'audio':
      return 'Podporované formáty: MP3, WAV, M4A, AAC, OGG (doporučeno max 1 MB)';
    case 'pdf':
      return 'Pouze PDF soubory (doporučeno max 1-2 MB)';
    case 'document':
      return 'DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP (doporučeno max 1 MB)';
    case 'text':
      return 'Textové soubory .txt (max 500 KB)';
    case 'image':
      return 'JPG, PNG, WebP, GIF, SVG, HEIC (iPhone) - max 2 MB';
    case 'video':
      return 'MP4, MOV (iPhone/Mac), WebM, AVI - max 5 MB';
    default:
      return 'Vyberte soubor';
  }
};

/**
 * Získá ikonu podle typu materiálu (emoji)
 */
export const getIconByType = (type) => {
  switch (type) {
    case 'audio':
      return '🎧';
    case 'pdf':
      return '📄';
    case 'document':
      return '📊';
    case 'text':
      return '📝';
    case 'link':
      return '🔗';
    case 'image':
      return '🖼️';
    case 'video':
      return '🎬';
    default:
      return '📦';
  }
};

/**
 * Získá label pro kategorii
 */
export const getCategoryLabel = (category) => {
  switch (category) {
    case 'meditation':
      return 'Meditace';
    case 'affirmation':
      return 'Afirmace';
    case 'exercise':
      return 'Cvičení';
    case 'reflection':
      return 'Reflexe';
    case 'template':
      return 'Šablona';
    case 'worksheet':
      return 'Pracovní list';
    case 'workbook':
      return 'Pracovní sešit';
    case 'question':
      return 'Otázky';
    case 'feedback':
      return 'Zpětná vazba';
    case 'other':
      return 'Ostatní';
    default:
      return category;
  }
};

/**
 * Get format label for material type (user-friendly format description)
 * @param {string} type - Material type (audio, video, pdf, image, etc.)
 * @returns {string} Formatted label with emoji
 */
export const getFormatLabel = (type) => {
  switch (type) {
    case 'audio':
      return '🎵 Audio';
    case 'video':
      return '🎬 Video';
    case 'pdf':
      return '📄 PDF dokument';
    case 'document':
      return '📝 Textový dokument';
    case 'image':
      return '🖼️ Obrázek';
    case 'link':
      return '🔗 Odkaz';
    case 'text':
      return '📝 Text';
    default:
      return type ? `📦 ${type}` : '';
  }
};

/**
 * Download QR code
 */
export const downloadQRCode = (dataUrl, filename = 'qr-code') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Validace email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Konvertuje HEIC/HEIF obrázek na JPEG
 * (HEIC není podporován většinou browserů)
 */
export const convertHeicToJpeg = async (file) => {
  try {
    // Kontrola, zda je to HEIC/HEIF
    const isHeic = file.type === 'image/heic' ||
                   file.type === 'image/heif' ||
                   file.name.toLowerCase().endsWith('.heic') ||
                   file.name.toLowerCase().endsWith('.heif');

    if (!isHeic) {
      return file; // Není HEIC, vrátíme původní soubor
    }

    // Dynamický import heic2any (lazy loading)
    const heic2any = (await import('heic2any')).default;

    // Konverze na JPEG
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9 // 90% kvalita
    });

    // Vytvoření nového File objektu z Blob
    const jpegFile = new File(
      [Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob],
      file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'),
      { type: 'image/jpeg' }
    );

    return jpegFile;
  } catch (error) {
    console.error('Chyba při konverzi HEIC:', error);
    throw new Error('Nepodařilo se převést HEIC obrázek. Zkus použít jiný formát (JPG, PNG).');
  }
};

/**
 * Pluralizace (počet + slovo ve správném tvaru)
 */
export const pluralize = (count, singular, few, many) => {
  if (count === 1) return `${count} ${singular}`;
  if (count >= 2 && count <= 4) return `${count} ${few}`;
  return `${count} ${many}`;
};

export default {
  fileToBase64,
  getAudioDuration,
  getVideoDuration,
  getPdfPageCount,
  estimateTextPageCount,
  formatFileSize,
  formatDuration,
  formatPageCount,
  formatLongDuration,
  formatDate,
  formatRelativeTime,
  getAcceptString,
  getFileTypeHint,
  getIconByType,
  getCategoryLabel,
  downloadQRCode,
  isValidEmail,
  truncate,
  convertHeicToJpeg,
  pluralize
};
