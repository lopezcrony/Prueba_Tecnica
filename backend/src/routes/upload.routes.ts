import { UploadController } from '../controllers/UploadController';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { UploadRepository } from '../repositories/UploadRepository';
import { UploadService } from '../services/UploadService';
import { Router } from 'express';

const router = Router();

// Inicializar dependencias
const uploadRepository = new UploadRepository();
const uploadService = new UploadService(uploadRepository);
const uploadController = new UploadController(uploadService);

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/v1/uploads - Obtener uploads del usuario autenticado
router.get('/', uploadController.getUserUploads);

// GET /api/v1/uploads/all - Obtener todos los uploads (solo admin)
router.get('/all', roleMiddleware('admin'), uploadController.getAllUploads);

// GET /api/v1/uploads/:id - Obtener upload por ID
router.get('/:id', uploadController.getUploadById);

// GET /api/v1/uploads/:id/download - Descargar archivo original
router.get('/:id/download', uploadController.downloadUpload);

// DELETE /api/v1/uploads/:id - Eliminar upload y todos sus documentos (solo admin)
router.delete('/:id', roleMiddleware('admin'), uploadController.deleteUpload);

export default router;
