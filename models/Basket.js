import mongoose from 'mongoose';
import { type } from 'os';

const basketSchema = new mongoose.Schema({
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
        default: 1,
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
      },
       'items-has-volume': {
        type: Boolean,
        default: false 
      },
      'items-promocode':{
        type: String,
        required: false,
      },
      'items-promocode-discount': {
      type: Number,
      required: false,
      }
    },
  ],
});

export default mongoose.model('Basket', basketSchema);