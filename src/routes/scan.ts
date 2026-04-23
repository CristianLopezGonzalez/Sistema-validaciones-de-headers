import { Router } from 'express';
import * as scanController from '../controllers/scanController';
import { authenticate } from '../middlewares/auth';
import { createScanValidator } from '../validators/scanValidators';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear nuevo scan
router.post('/', createScanValidator, validateRequest, scanController.createScan);

// Listar scans del usuario
router.get('/', scanController.getScans);

// Obtener scan específico
router.get('/:id', scanController.getscanById);

export default router;
