import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import cookieParser from 'cookie-parser';
import categoriesRouter from './routes/categories.js';
import productsRouter from './routes/products.js';
import basketRouter from './routes/basket.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';
import authMiddleware from './middleware/authMiddleware.js';
import promocodesRouter from './routes/promocodes.js';
import csrfMiddleware from'./middleware/csrfMiddleware.js';
import secFetchMiddleware from './middleware/secFetchMiddleware.js';
import originMiddleware from './middleware/originMiddleware.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

// Загрузка SSL сертификатов
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '/certs/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/certs/cert.pem'))
};

// Middleware
app.use(cors({
  origin: 'https://carfixnuxt-production-89aa.up.railway.app', 
  credentials: true,
  exposedHeaders: ['application/json', 'X-CSRF-Token']
}));
app.use(express.json({ limit: '50mb' })); // Увеличиваем лимит до 50 МБ
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Увеличиваем лимит до 50 МБ
app.use(cookieParser());


// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ОШИБКА: Переменная MONGODB_URI не задана!");
  console.error("Добавьте её в настройки Railway (Settings → Variables)");
  process.exit(1); // Остановка приложения
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB подключена!"))
  .catch(err => console.error("❌ Ошибка подключения к MongoDB:", err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
db.once('open', () => {
  console.log('Успешное подключение к MongoDB!');
});

db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
db.once('open', () => {
  console.log('Успешное подключение к MongoDB!');
});

// Проверки, для безопасности.
app.use(csrfMiddleware);
app.use(secFetchMiddleware);
app.use(originMiddleware);

// Маршруты
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/baskets', basketRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admins', adminRouter);
app.use('/api/promocodes', promocodesRouter);

app.use(express.static(path.join(__dirname, '.output/public')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Защищенные маршруты для админ-панели
app.get('/admin/sAdmin', authMiddleware, (req, res) => {
  if (req.user.role === 'sAdmin') {
    res.send('Добро пожаловать, sAdmin!');
  } else {
    res.status(403).json({ message: 'Доступ запрещен' });
  }
});

app.get('/admin/sAdmin/admin-product', authMiddleware, (req, res) => {
  if (req.user.role === 'sAdmin') {
    res.send('Добро пожаловать, sAdmin!');
  } else {
    res.status(403).json({ message: 'Доступ запрещен' });
  }
});

app.get('/admin/yAdmin', authMiddleware, (req, res) => {
  if (req.user.role === 'yAdmin') {
    res.send('Добро пожаловать, yAdmin!');
  } else {
    res.status(403).json({ message: 'Доступ запрещен' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});