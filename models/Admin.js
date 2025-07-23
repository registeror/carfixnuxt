// models/Admin.js
import mongoose from 'mongoose';
import { decryptAdminData } from './AdminEncryption.js';

const adminSchema = new mongoose.Schema({
    'admin-login': { type: String, required: true },
    'admin-pass': { type: String, required: true },
    'admin-role': { type: String, required: true },
});

// Добавляем методы для дешифровки данных
adminSchema.methods.getDecryptedLogin = function() {
    return decryptAdminData(this['admin-login']);
};

adminSchema.methods.getDecryptedPassword = function() {
    return decryptAdminData(this['admin-pass']);
};

// Middleware для автоматической дешифровки при запросе
adminSchema.post(['find', 'findOne', 'findOneAndUpdate'], function(docs) {
    if (!docs) return;

    const processDoc = (doc) => {
        if (doc['admin-login']) doc['admin-login'] = decryptAdminData(doc['admin-login']);
        if (doc['admin-pass']) doc['admin-pass'] = decryptAdminData(doc['admin-pass']);
        return doc;
    };

    if (Array.isArray(docs)) {
        return docs.map(processDoc);
    } else if (docs) {
        return processDoc(docs);
    }
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;