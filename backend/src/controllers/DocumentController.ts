import { Response, NextFunction } from 'express';
import { DocumentService } from '../services/DocumentService';
import { IAuthRequest } from '../middlewares/auth.middleware';
import { createSuccessResponse } from '../utils/errorCodes';
import { UserRole } from '../database/entities/User';
import { IDocumentService } from '../interfaces';
import { FileNotProvidedError } from '../utils/exceptions';

export class DocumentController {
  private documentService: IDocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  /**
   * @swagger
   * /documents/upload:
   *   post:
   *     summary: Subir archivo CSV con contactos
   *     tags: [Documents]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: Archivo CSV con campos correo, nombre, telefono, ciudad, notas (opcional)
   *     responses:
   *       200:
   *         description: Archivo procesado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "5 registro(s) importado(s) exitosamente"
   *                     uploadId:
   *                       type: integer
   *       400:
   *         description: Errores de validación en el CSV
   *       401:
   *         description: No autorizado
   */
  upload = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new FileNotProvidedError();
      }

      const userId = req.user!.id;
      const originalFileName = req.file.originalname;
      const result = await this.documentService.uploadCSV(req.file.path, originalFileName, userId);

      res.status(200).json(
        createSuccessResponse(result, result.message)
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /documents:
   *   get:
   *     summary: Listar documentos/contactos con paginación
   *     tags: [Documents]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: uploadId
   *         schema:
   *           type: integer
   *         description: Filtrar por ID de upload específico
   *     responses:
   *       200:
   *         description: Lista de documentos/contactos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                           correo:
   *                             type: string
   *                             format: email
   *                           nombre:
   *                             type: string
   *                           telefono:
   *                             type: string
   *                           ciudad:
   *                             type: string
   *                           notas:
   *                             type: string
   *                             nullable: true
   *                           uploadId:
   *                             type: integer
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *                     total:
   *                       type: integer
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       401:
   *         description: No autorizado
   */
  list = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.documentService.listDocuments(undefined, page, limit);

      res.status(200).json(
        createSuccessResponse(result)
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /documents/{id}:
   *   delete:
   *     summary: Eliminar documento/contacto (solo admin)
   *     tags: [Documents]
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
   *         description: Documento eliminado
   *       403:
   *         description: No autorizado (requiere rol admin)
   *       404:
   *         description: Documento no encontrado
   */
  delete = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role as UserRole;

      await this.documentService.deleteDocument(Number(id), userId, userRole);

      res.status(200).json(
        createSuccessResponse({ deleted: true }, 'Documento eliminado exitosamente')
      );
    } catch (error) {
      next(error);
    }
  };
}
