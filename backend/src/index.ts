import 'dotenv/config';
import dns from 'dns';
// Use Google DNS to resolve MongoDB SRV records (local DNS may not support SRV)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

// Allow all origins
app.use(cors({ origin: '*', credentials: false }));

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', env: NODE_ENV });
});

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Database Connection ──────────────────────────────────────────────────────
async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set in environment variables');
  }
  const dbName = process.env.MONGO_DATABASE || 'Todo';
  await mongoose.connect(mongoUri, { dbName });
  console.log('✅ Connected to MongoDB Atlas');
}

// ── Start Server ─────────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} [${NODE_ENV}]`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  });
