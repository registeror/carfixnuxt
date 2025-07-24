import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Импортируем authMiddleware
import rateLimit from 'express-rate-limit';
import { encryptAdminData } from '../models/AdminEncryption.js';
import { sendConfirmationCode } from '../services/mailer.js';

const confirmationCodes = new Map();
const router = express.Router();

router.post('/send-confirmation-code', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'sAdmin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Генерация случайного кода из 6 символов [A-Z0-9]
    const code = Array.from({ length: 6 }, () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');

    // Установка времени истечения (5 минут)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Сохранение кода
    confirmationCodes.set(req.user.id, { code, expiresAt });

    // Отправка кода на почту
    await sendConfirmationCode(code);

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при отправке кода подтверждения:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Временное хранилище для неудачных попыток входа
const failedAttempts = new Map(); // { ip: { count: number, blockedUntil: Date } }
// Лимит: 100 запросов в минуту
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100,
  skip: (req) => {
    // Пропускаем лимит для админов
    return req.user?.role === 'sAdmin';
  }
});
router.use(limiter);
// Middleware для проверки блокировки
const checkBlocked = (req, res, next) => {
  const ip = req.ip;
  const attemptData = failedAttempts.get(ip);

  if (attemptData && attemptData.blockedUntil > new Date()) {
    const remainingTime = Math.ceil((attemptData.blockedUntil - new Date()) / 1000 / 60);
    return res.status(429).json({ 
      message: `Слишком много попыток.` 
    });
  }

  next();
};
setInterval(() => {
  const now = new Date();
  for (const [ip, data] of failedAttempts.entries()) {
    if (data.blockedUntil && data.blockedUntil < now) {
      failedAttempts.delete(ip);
    }
  }
}, 60 * 1000);

// Маршрут для входа в систему
router.post('/login', checkBlocked, async (req, res) => {
  const { login, password } = req.body;
  const ip = req.ip;
  
  // Проверка на английские буквы и спецсимволы
  const englishAndSpecialChars = /^[a-zA-Z0-9!@#$]*$/;
  if (!englishAndSpecialChars.test(login) || !englishAndSpecialChars.test(password)) {
    return res.status(400).json({ 
      message: 'Логин и пароль должны содержать только английские буквы и специальные символы' 
    });
  }

  try {
    // Получаем всех администраторов и проверяем вручную
    const admins = await Admin.find({});
    let admin = null;

    for (const a of admins) {
      const decryptedLogin = a.getDecryptedLogin();
      const decryptedPassword = a.getDecryptedPassword();
      
      if (decryptedLogin === login && decryptedPassword === password) {
        admin = a;
        break;
      }
    }

    if (!admin) {
      // Остальной код обработки ошибок остается без изменений...
      const attemptData = failedAttempts.get(ip) || { count: 0 };
      attemptData.count += 1;
      
      if (attemptData.count >= 5) {
        attemptData.blockedUntil = new Date(Date.now() + 1 * 60 * 1000);
      }
      
      failedAttempts.set(ip, attemptData);

      return res.status(401).json({ 
        message: attemptData.count >= 5 
          ? 'Слишком много попыток.' 
          : 'Неверный логин, или пароль.' 
      });
    }

    // Остальной код остается без изменений...
    failedAttempts.delete(ip);

    const token = jwt.sign(
      { id: admin._id, role: admin['admin-role'] },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      path: '/', 
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.json({ success: true, role: admin['admin-role'] });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут для проверки авторизации
router.get('/check-auth', authMiddleware, (req, res) => {
  res.json({ success: true, role: req.user.role });
});

// Маршрут для обновления токена
router.post('/refresh-token', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Устанавливаем новый токен в cookies
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      path: '/',
      sameSite: 'strict',
    });

    res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен' });
  }
});

// Выход с авторизации.
router.post('/logout', (req, res) => {
  // Очищаем куки с токеном
  res.clearCookie('token', {
    path: '/', // Убедитесь, что путь совпадает с путем установки куки
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: 'strict',
  });
  res.json({ success: true, message: 'Вы успешно вышли из системы' });
});

router.post('/get-account', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'sAdmin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const { role } = req.body;
    const admin = await Admin.findOne({ 'admin-role': role });

    if (!admin) {
      return res.status(404).json({ message: 'Учетная запись не найдена' });
    }

    // Возвращаем данные (можно добавить шифрование)
    res.json({ 
      login: admin['admin-login'],
      role: admin['admin-role']
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/update-account', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'sAdmin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const { login, newPassword, role, confirmationCode } = req.body;
    
    // Валидация входных данных
     const storedCode = confirmationCodes.get(req.user.id);
    if (!storedCode || storedCode.code !== confirmationCode) {
      return res.status(400).json({ message: 'Неверный код подтверждения' });
    }
    if (new Date() > storedCode.expiresAt) {
      return res.status(400).json({ message: 'Срок действия кода истек' });
    }
    const validPattern = /^[a-zA-Z0-9!@#$]*$/;
    if (!validPattern.test(login)) {
      return res.status(400).json({ message: 'Недопустимые символы в логине' });
    }
    
    if (newPassword && !validPattern.test(newPassword)) {
      return res.status(400).json({ message: 'Недопустимые символы в пароле' });
    }
    
    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
    }

    // Шифруем данные перед сохранением
    const encryptedLogin = encryptAdminData(login);
    const encryptedPassword = newPassword ? encryptAdminData(newPassword) : undefined;

    // Обновляем запись
    const updateData = { 
      'admin-login': encryptedLogin,
      ...(encryptedPassword && { 'admin-pass': encryptedPassword })
    };

    await Admin.findOneAndUpdate(
      { 'admin-role': role },
      updateData,
      { new: true }
    );
    confirmationCodes.delete(req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


export default router;