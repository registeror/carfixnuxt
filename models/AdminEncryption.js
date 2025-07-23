// models/AdminEncryption.js
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const algorithm = 'aes-256-cbc';
const key = process.env.ADMIN_ENCRYPTION;

if (!key || key.length !== 32) {
  throw new Error('ADMIN_ENCRYPTION key must be 32 characters long');
}

export const encryptAdminData = (text) => {
  if (!text || typeof text !== 'string') return text;
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Admin encryption error:', error);
    return text;
  }
};

export const decryptAdminData = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  if (!text.includes(':')) {
    console.error('Invalid encrypted admin data format');
    return text;
  }

  try {
    const [ivHex, encrypted] = text.split(':');
    if (!ivHex || !encrypted) {
      console.error('Missing IV or encrypted data');
      return text;
    }

    const iv = Buffer.from(ivHex, 'hex');
    if (iv.length !== 16) {
      console.error('Invalid IV length');
      return text;
    }

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Admin decryption error:', error);
    return text;
  }
};