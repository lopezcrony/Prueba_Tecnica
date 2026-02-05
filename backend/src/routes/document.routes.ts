import { Router } from 'express';
import { DocumentController } from '../controllers/DocumentController';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

const router = Router();
const documentController = new DocumentController();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gestión de documentos CSV
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         correo:
 *           type: string
 *           format: email
 *         nombre:
 *           type: string
 *         telefono:
 *           type: string
 *         ciudad:
 *           type: string
 *         notas:
 *           type: string
 *           nullable: true
 *         uploadedById:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// Subir archivo CSV (usuarios autenticados)
router.post(
  '/upload',
  authMiddleware,
  uploadMiddleware,
  documentController.upload
);

export default router;
