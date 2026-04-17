import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { config } from './config';
import authRoutes from './routes/auth';
import skillRoutes from './routes/skills';
import sessionRoutes from './routes/sessions';
import reviewRoutes from './routes/reviews';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 SkillSwap API running on port ${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
});

export default app;
