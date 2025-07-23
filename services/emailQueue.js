import Bull from 'bull';
const Queue = Bull;
import { sendOrderEmail } from './mailer.js';

export const emailQueue = new Queue('email-notifications', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

emailQueue.process(async (job) => {
  await sendOrderEmail(job.data);
});