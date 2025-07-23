import mongoose from 'mongoose';
import crypto from 'crypto';

// Проверка ключа шифрования
if (!process.env.PROMOCODE_ENCRYPTION_KEY || process.env.PROMOCODE_ENCRYPTION_KEY.length !== 32) {
  throw new Error('PROMOCODE_ENCRYPTION_KEY должен быть ровно 32 символа');
}

const ENCRYPTION_KEY = process.env.PROMOCODE_ENCRYPTION_KEY;
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

const promocodeSchema = new mongoose.Schema({
  'promocode-name': {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return !/<[^>]*>|[\<\>\"\'\`\;\(\)\&\$\%\#\@\*\+\=\\\/\|\{\}\[\]]/.test(v);
        },
        message: props => `Название содержит запрещенные символы`
        },
    maxlength: [20, 'Название слишком длинное']
  },
  'promocode-active': {
    type: Number,
    required: true,
    maxlength: [10, 'Название слишком длинное']
  },
  'promocode-discount': {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    maxlength: [4, 'Название слишком длинное']
  },
  encrypted: { type: Boolean, default: false },
  encryptedPromo: { type: Boolean, default: false }
});

// Улучшенный метод шифрования
promocodeSchema.methods.encryptName = function() {
  if (this.encrypted || !this['promocode-name']) return;
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    let encrypted = cipher.update(this['promocode-name'], 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    this['promocode-name'] = `${iv.toString('hex')}:${encrypted}`;
    this.encrypted = true;
  } catch (error) {
    console.error('Ошибка шифрования:', error);
    throw error;
  }
};

// Улучшенный метод дешифрования
promocodeSchema.methods.decryptName = function() {
  if (!this.encrypted || !this['promocode-name']) return;
  
  try {
    const [ivHex, encryptedText] = this['promocode-name'].split(':');
    if (!ivHex || !encryptedText) {
      throw new Error('Неверный формат зашифрованного промокода');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    this['promocode-name'] = decrypted;
    this.encrypted = false;
  } catch (error) {
    console.error('Ошибка дешифрования:', error);
    throw error;
  }
};

// Хук для автоматического шифрования
promocodeSchema.pre('save', function(next) {
  if (this.isModified('promocode-name') && !this.encrypted) {
    this.encryptName();
  }
  next();
});

export default mongoose.model('Promocode', promocodeSchema);