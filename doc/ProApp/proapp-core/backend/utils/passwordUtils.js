// utils/passwordUtils.js - Bezpečné práce s hesly
import bcrypt from 'bcryptjs';

// Počet rounds pro hashing (10-12 je doporučené)
const SALT_ROUNDS = 12;

/**
 * Zahashuje heslo s automatickým solením
 * @param {string} plainPassword - Heslo v plain textu
 * @returns {Promise<string>} - Zahashované heslo
 */
export const hashPassword = async (plainPassword) => {
    try {
        // bcrypt automaticky generuje salt a hashuje
        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        console.log('✅ Heslo úspěšně zahashováno');
        return hashedPassword;
    } catch (error) {
        console.error('❌ Chyba při hashování hesla:', error);
        throw new Error('Chyba při zabezpečení hesla');
    }
};

/**
 * Ověří heslo proti hashi
 * @param {string} plainPassword - Heslo v plain textu
 * @param {string} hashedPassword - Zahashované heslo z databáze
 * @returns {Promise<boolean>} - true pokud hesla odpovídají
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        const isValid = await bcrypt.compare(plainPassword, hashedPassword);
        console.log(isValid ? '✅ Heslo správné' : '❌ Heslo nesprávné');
        return isValid;
    } catch (error) {
        console.error('❌ Chyba při ověřování hesla:', error);
        return false;
    }
};

/**
 * Zkontroluje sílu hesla
 * @param {string} password - Heslo k ověření
 * @returns {object} - Výsledek kontroly
 */
export const validatePasswordStrength = (password) => {
    const result = {
        isValid: false,
        errors: [],
        strength: 'weak'
    };

    // Minimální délka
    if (password.length < 8) {
        result.errors.push('Heslo musí mít alespoň 8 znaků');
    }

    // Obsahuje číslici
    if (!/\d/.test(password)) {
        result.errors.push('Heslo musí obsahovat alespoň jednu číslici');
    }

    // Obsahuje velké písmeno
    if (!/[A-Z]/.test(password)) {
        result.errors.push('Heslo musí obsahovat alespoň jedno velké písmeno');
    }

    // Obsahuje malé písmeno
    if (!/[a-z]/.test(password)) {
        result.errors.push('Heslo musí obsahovat alespoň jedno malé písmeno');
    }

    // Pokud žádné chyby, heslo je validní
    if (result.errors.length === 0) {
        result.isValid = true;
        
        // Určení síly hesla
        let score = 0;
        if (password.length >= 12) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++; // Speciální znaky
        if (/\d.*\d/.test(password)) score++; // Více číslic
        
        if (score >= 2) result.strength = 'strong';
        else if (score === 1) result.strength = 'medium';
        else result.strength = 'weak';
    }

    return result;
};

export default {
    hashPassword,
    verifyPassword,
    validatePasswordStrength
};