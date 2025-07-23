import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = process.env.PROMOCODE_ENCRYPTION_KEY ;

export const encryptData = (text) => {
  if (!text || typeof text !== 'string') return text;
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Ошибка шифрования:', error);
    return text;
  }
};

export const decryptData = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // Проверяем, есть ли разделитель IV и зашифрованных данных
  if (!text.includes(':')) {
    console.error('Некорректный формат зашифрованных данных');
    return text;
  }

  try {
    const [ivHex, encrypted] = text.split(':');
    if (!ivHex || !encrypted) {
      console.error('Отсутствует IV или зашифрованные данные');
      return text;
    }

    const iv = Buffer.from(ivHex, 'hex');
    if (iv.length !== 16) {
      console.error('Некорректная длина IV');
      return text;
    }

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Ошибка дешифрования:', error);
    return text;
  }
};