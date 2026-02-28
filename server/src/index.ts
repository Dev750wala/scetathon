import 'dotenv/config';
import http from 'http';
import cron from 'node-cron';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { configureCloudinary } from './config/cloudinary.js';
import { initializeSocket } from './config/socket.js';
import { updateAllZoneScores } from './services/entropy.service.js';
import { checkAndEscalateStalledReports } from './services/escalation.service.js';

const PORT = process.env.PORT || 5000;

async function main() {
  await connectDatabase();
  await connectRedis();
  configureCloudinary();

  const httpServer = http.createServer(app);
  initializeSocket(httpServer);

  // Cron: update zone scores every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try { await updateAllZoneScores(); } catch (e) { console.error('Entropy update failed:', e); }
  });

  // Cron: check escalations every hour
  cron.schedule('0 * * * *', async () => {
    try { await checkAndEscalateStalledReports(); } catch (e) { console.error('Escalation check failed:', e); }
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO ready`);
  });
}

main().catch(console.error);
