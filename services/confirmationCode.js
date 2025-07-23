// services/confirmationCode.js
import crypto from 'crypto';
import { encryptAdminData } from '../models/AdminEncryption.js';

const CODE_LENGTH = 6;
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_EXPIRY_MINUTES = 5;

export const generateConfirmationCode = () => {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS.charAt(crypto.randomInt(0, CODE_CHARS.length));
  }
  return code;
};

export const createCodePayload = () => {
  const code = generateConfirmationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60000);
  
  return {
    code: encryptAdminData(code),
    expiresAt: encryptAdminData(expiresAt.toISOString())
  };
};

export const validateCode = (storedCode, storedExpiry, inputCode) => {
  try {
    const decryptedCode = decryptAdminData(storedCode);
    const decryptedExpiry = decryptAdminData(storedExpiry);
    
    const expiryDate = new Date(decryptedExpiry);
    const now = new Date();
    
    return decryptedCode === inputCode && expiryDate > now;
  } catch (error) {
    console.error('Error validating code:', error);
    return false;
  }
};