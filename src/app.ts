import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';
import authRoutes from './routes/auth';
import scanRoutes from './routes/scan';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
