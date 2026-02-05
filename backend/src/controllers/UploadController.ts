import { IUploadService } from '../interfaces/services/IUploadService';
import { IAuthRequest } from '../middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

export class UploadController {
  constructor(private uploadService: IUploadService) {}

  /**
   * @swagger
   * /uploads:
   *   get:
   *     summary: Obtener uploads del usuario autenticado
   *     tags: [Uploads]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de uploads del usuario
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       originalFileName:
   *                         type: string
   *                       totalRecords:
   *                         type: integer
   *                       uploadedAt:
   *                         type: string
   *                         format: date-time
   *                       uploadedBy:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                           name:
   *                             type: string
   *                           email:
   *                             type: string
   *       401:
   *         description: No autorizado
   */
  getUserUploads = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { uploads, total } = await this.uploadService.getUserUploads(userId, page, limit);
      
      res.status(200).json({
        status: 'success',
        data: uploads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /uploads/all:
   *   get:
   *     summary: Obtener todos los uploads (solo admin)
   *     tags: [Uploads]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de todos los uploads
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Requiere permisos de administrador
   */
  getAllUploads = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { uploads, total } = await this.uploadService.getAllUploads(page, limit);
      
      res.status(200).json({
        status: 'success',
        data: uploads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /uploads/{id}/download:
   *   get:
   *     summary: Descargar archivo CSV original
   *     tags: [Uploads]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Descarga del archivo CSV
   *         content:
   *           text/csv:
   *             schema:
   *               type: string
   *               format: binary
   *       404:
   *         description: Archivo no encontrado
   */
  downloadUpload = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const filePath = await this.uploadService.getUploadFilePath(Number(id));
      
      const fileName = path.basename(filePath);
      res.download(filePath, fileName);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /uploads/{id}:
   *   delete:
   *     summary: Eliminar upload y sus documentos (solo admin)
   *     tags: [Uploads]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Upload eliminado exitosamente
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Requiere permisos de administrador
   *       404:
   *         description: Upload no encontrado
   */
  deleteUpload = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      
      await this.uploadService.deleteUpload(Number(id), userId, userRole);
      
      res.status(200).json({
        status: 'success',
        message: 'Se ha eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  };
}
