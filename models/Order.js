import mongoose from 'mongoose';
import { encryptData } from './Encryption.js';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      'items-product-id': {
        type: String,
        required: true,
      },
      'items-product-name': {
        type: String,
        required: true,
      },
      'items-quantity': {
        type: Number,
        required: true,
      },
      'items-price': {
        type: Number,
        required: true,
      },
      'items-product-image': {
        type: String,
        required: true,
      },
      'items-product-volume': {  
        type: String,
        required: true,
        default: '1шт'
      },
      'items-has-volume': {  
        type: Boolean,
        default: false
      },
      'items-promocode': {
        type: String,
        required: false,
      },
      'items-promocode-discount': {
        type: Number,
        required: false,
        default: 0
      },
      'items-original-price': {
        type: Number,
        required: false
      },
      'items-final-price': {
        type: Number,
        required: false
      }
    },
  ],
  'order-name': {
    type: String,
    required: true,
    set: encryptData,
  },
  'order-gmail': {
    type: String,
    required: true,
    set: encryptData,
  },
  'order-phone': {
    type: String,
    required: true,
    set: encryptData,
  },
  'order-status': {
    type: String,
    default: 'Не готов',
    enum: ['Не готов', 'В обработке', 'В процессе', 'Готов'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    encrypted: {
    type: Boolean,
    default: true,
  },
});

// Добавим метод для шифрования промокода
orderSchema.methods.encryptPromocode = function() {
  if (!this['order-promocode'] || this.encryptedPromo) return;
  
  try {
    const { encryptData } = require('./Encryption');
    this['order-promocode'] = encryptData(this['order-promocode']);
    this.encryptedPromo = true;
  } catch (error) {
    console.error('Ошибка шифрования промокода:', error);
  }
};

// Обновим pre-save хук
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Находим последний заказ
      const lastOrder = await this.constructor.findOne()
        .sort({ orderNumber: -1 })
        .exec();
      
      // Устанавливаем новый orderNumber
      this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
      
      // Шифруем промокод если он есть
      if (this['order-promocode']) {
        this.encryptPromocode();
      }
      
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Обновим метод decryptFields для дешифровки промокода
orderSchema.methods.decryptFields = async function() {
  if (!this.encrypted) return this;
  
  try {
    const { decryptData } = await import('./Encryption');
    
    if (this['order-name']) this['order-name'] = decryptData(this['order-name']);
    if (this['order-gmail']) this['order-gmail'] = decryptData(this['order-gmail']);
    if (this['order-phone']) this['order-phone'] = decryptData(this['order-phone']);
    if (this['order-promocode'] && this.encryptedPromo) {
      this['order-promocode'] = decryptData(this['order-promocode']);
      this.encryptedPromo = false;
    }
    
    this.encrypted = false;
    return this;
  } catch (error) {
    console.error(`Ошибка дешифрования заказа ${this._id}:`, error);
    return this;
  }
};

// Middleware для автоматического увеличения orderNumber
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastOrder = await this.constructor.findOne().sort({ orderNumber: -1 });
    this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
  }
  next();
});

export default mongoose.model('Order', orderSchema);