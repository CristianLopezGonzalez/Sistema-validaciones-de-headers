import express from 'express';
const router = express.Router();
import { register, login, getProfile } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);


export default router;
