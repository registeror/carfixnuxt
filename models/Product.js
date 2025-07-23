import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    'product-name': {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return !/<[^>]*>|[\<\>\"\'\`\;\(\)\&\$\%\#\@\*\+\=\\\/\|\{\}\[\]]/.test(v);
            },
            message: props => `Название содержит запрещенные символы`
        },
        maxlength: [100, 'Название слишком длинное']
    },
    'product-description': {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return !/<[^>]*>|[\<\>\"\'\`\;\(\)\&\$\%\#\@\*\+\=\\\/\|\{\}\[\]]/.test(v);
            },
            message: props => `Название содержит запрещенные символы`
        },
        maxlength: [1000, 'Название слишком длинное']
    },
    'product-has-volume': {
        type: Boolean,
        default: false,
        validate: {
            validator: function(v) {
                return !/<[^>]*>|[\<\>\"\'\`\;\(\)\&\$\%\#\@\*\+\=\\\/\|\{\}\[\]]/.test(v);
            },
            message: props => `Название содержит запрещенные символы`
        },
        maxlength: [10, 'Название слишком длинное']
    },
    items: [
    {
    'product-volume': {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return !/<[^>]*>|[\<\>\"\'\`\;\(\)\&\$\%\#\@\*\+\=\\\/\|\{\}\[\]]/.test(v);
            },
            message: props => `Название содержит запрещенные символы`
        },
        maxlength: [30, 'Название слишком длинное']
    },
    'product-price': {
        type: Number,
        required: true,
    }
    },
  ],
    'product-image': {
        type: String,
        required: true,
                validate: {
            validator: function(v) {
                return /^data:image\/(png|jpeg|jpg|gif);base64,/.test(v) || 
                       /^https?:\/\/.+\.(png|jpe?g|gif)$/i.test(v);
            },
            message: props => `Некорректный формат изображения`
        }
    },
    'product-category': {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: props => `Некорректный ID категории`
        }
    },
});

export default mongoose.model('Product', productSchema);