import { UploadController } from '../controllers/UploadController';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { UploadRepository } from '../repositories/UploadRepository';
import { UploadService } from '../services/UploadService';
import { Router } from 'express';

const router = Router();
const uploadRepository = new UploadRepository();
const uploadService = new UploadService(uploadRepository);
const uploadController = new UploadController(uploadService);

router.use(authMiddleware);
router.get('/', uploadController.getUserUploads);
router.get('/all', roleMiddleware('admin'), uploadController.getAllUploads);
router.get('/:id/download', uploadController.downloadUpload);
router.delete('/:id', roleMiddleware('admin'), uploadController.deleteUpload);

export default router;
