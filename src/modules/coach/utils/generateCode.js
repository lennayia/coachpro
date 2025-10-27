import { v4 as uuidv4 } from 'uuid';

/**
 * Generuje 6místný kód pro sdílení programu
 * Formát: ABC123 (3 písmena + 3 čísla)
 */
export const generateShareCode = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // bez I, O (můžou být matoucí)
  const numbers = '0123456789';

  let code = '';

  // 3 písmena
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // 3 čísla
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
};

/**
 * Generuje unikátní UUID
 */
export const generateUUID = () => {
  return uuidv4();
};

/**
 * Generuje QR kód jako data URL
 */
export const generateQRCode = async (text) => {
  try {
    const QRCode = (await import('qrcode')).default;
    const url = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#556B2F',  // Nature theme primary color
        light: '#FFFFFF'
      }
    });
    return url;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

/**
 * Ověří, zda je kód validní (formát 6 znaků)
 */
export const isValidShareCode = (code) => {
  if (!code || code.length !== 6) return false;
  return /^[A-Z]{3}[0-9]{3}$/.test(code.toUpperCase());
};

/**
 * Formátuje kód (přidá mezery pro čitelnost)
 */
export const formatShareCode = (code) => {
  if (!code || code.length !== 6) return code;
  return `${code.slice(0, 3)} ${code.slice(3)}`;
};

export default {
  generateShareCode,
  generateUUID,
  generateQRCode,
  isValidShareCode,
  formatShareCode
};
