import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  'categories-name': {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model('Category', categorySchema);