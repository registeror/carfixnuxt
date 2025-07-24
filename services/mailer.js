import nodemailer from 'nodemailer';
import { decryptData } from '../models/Encryption.js';

// Конфигурация SMTP (Mail.ru)
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILRU_USER,
    pass: process.env.MAILRU_PASSWORD
  }
});

// Добавить в services.mailer.js
export async function sendConfirmationCode( code) {
  try {
    const mailOptions = {
      from: process.env.MAILRU_USER,
      to: process.env.ADMIN_CODE_EMAIL,
      subject: 'Код подтверждения изменения учетной записи',
      html: generateConfirmationCodeHtml(code)
    };

    await transporter.sendMail(mailOptions);
    console.log('Код подтверждения отправлен');
  } catch (error) {
    console.error('Ошибка отправки кода подтверждения:', error);
    throw error;
  }
}

function generateConfirmationCodeHtml(code) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Код подтверждения</h2>
      <p>Для подтверждения изменения учетной записи администратора используйте следующий код:</p>
      <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; padding: 10px; background: #f5f5f5; display: inline-block;">
        ${code}
      </div>
      <p>Код действителен в течение 5 минут.</p>
    </div>
  `;
}

export async function sendOrderEmail(orderDetails) {
  try {
    // Дешифруем данные перед отправкой
    const decryptedOrder = {
      ...orderDetails,
      'order-name': decryptData(orderDetails['order-name']),
      'order-gmail': decryptData(orderDetails['order-gmail']),
      'order-phone': decryptData(orderDetails['order-phone'])
    };

    const mailOptions = {
      from: process.env.MAILRU_USER,
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: `Новый заказ #${orderDetails.orderNumber}`,
      html: generateOrderEmailHtml(decryptedOrder)
    };

    await transporter.sendMail(mailOptions);
    console.log('Email уведомление отправлено');
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    throw error;
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price).replace(/\s/g, '.');
}

function generateOrderEmailHtml(order) {
  const totalOriginal = order.items.reduce((sum, item) => sum + (item['items-original-price'] || item['items-price'] * item['items-quantity']), 0);
  const totalFinal = order.items.reduce((sum, item) => sum + (item['items-final-price'] || item['items-price'] * item['items-quantity']), 0);
  const hasDiscount = totalFinal < totalOriginal;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Новый заказ #${order.orderNumber}</h2>
      <p><strong>Дата:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      ${order['order-promocode'] ? `<p><strong>Промокод:</strong> ${order['order-promocode']}</p>` : ''}
      
      <h3 style="margin-top: 20px;">Информация о клиенте:</h3>
      <p><strong>Имя:</strong> ${order['order-name']}</p>
      <p><strong>Email:</strong> ${order['order-gmail']}</p>
      <p><strong>Телефон:</strong> ${order['order-phone']}</p>
      
      <h3 style="margin-top: 20px;">Детали заказа:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Товар</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Цена</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Кол-во</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${item['items-product-name']} (${item['items-product-volume']})</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${formatPrice(item['items-price'])} руб.</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${item['items-quantity']}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">\
                ${item['items-final-price'] && item['items-final-price'] < item['items-original-price'] ? 
                  `${formatPrice(item['items-final-price'])} руб.
                  <span style="text-decoration: line-through; color: #999; margin-right: 5px;">
                    ${formatPrice(item['items-original-price'])} руб.
                  </span>`
                  : 
                  `${formatPrice(item['items-price'] * item['items-quantity'])} руб.`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h3 style="margin-top: 20px;">
        Итого: 
        ${formatPrice(totalFinal)} руб.
          ${hasDiscount ? `
          <span style="text-decoration: line-through; color: #999; margin-right: 5px;">
            ${formatPrice(totalOriginal)} руб.
          </span>` : ''}
      </h3>
    </div>
  `;
}