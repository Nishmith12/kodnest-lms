import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { corsConfig } from './config/security';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import videoRoutes from './modules/videos/video.routes';
import progressRoutes from './modules/progress/progress.routes';
import healthRoutes from './modules/health/health.routes';

const app = express();

// Middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/health', healthRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
