import express from 'express';
const router = express.Router();
import { healthCheck } from '../controllers/healthController';

// Ruta verficar estado del servidor
router.get('/health', healthCheck);

export default router;
