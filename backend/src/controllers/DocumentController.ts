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
}
