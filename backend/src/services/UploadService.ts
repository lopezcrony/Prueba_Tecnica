import { Upload } from '../database/entities/Upload';
import { NotFoundError, ForbiddenError } from '../utils/exceptions';
import { IUploadRepository } from '../interfaces/repositories/IUploadRepository';
import { IUploadService } from '../interfaces/services/IUploadService';
import fs from 'fs';
import path from 'path';

export class UploadService implements IUploadService {
  constructor(private uploadRepository: IUploadRepository) {}

  async createUpload(
    originalFileName: string,
    filePath: string,
    totalRecords: number,
    uploadedById: number
  ): Promise<Upload> {
    const upload = await this.uploadRepository.create({
      originalFileName,
      filePath,
      totalRecords,
      uploadedById
    });

    return upload;
  }

  async getUploadById(id: number): Promise<Upload> {
    const upload = await this.uploadRepository.findById(id);
    
    if (!upload) {
      throw new NotFoundError('Upload', id.toString());
    }

    return upload;
  }

  async getUserUploads(userId: number, page: number = 1, limit: number = 10): Promise<{ uploads: Upload[]; total: number }> {
    return await this.uploadRepository.findByUser(userId, page, limit);
  }

  async getAllUploads(page: number = 1, limit: number = 10): Promise<{ uploads: Upload[]; total: number }> {
    return await this.uploadRepository.findAll(page, limit);
  }

  async deleteUpload(id: number, userId: number, userRole: string): Promise<void> {
    const upload = await this.getUploadById(id);

    // Solo admin o el usuario que subió el archivo puede eliminarlo
    if (userRole !== 'admin' && upload.uploadedById !== userId) {
      throw new ForbiddenError('Solo puedes eliminar tus propios archivos');
    }

    // Eliminar el archivo físico
    if (fs.existsSync(upload.filePath)) {
      fs.unlinkSync(upload.filePath);
    }

    // Eliminar el registro (cascade eliminará los documents asociados)
    const deleted = await this.uploadRepository.delete(id);
    
    if (!deleted) {
      throw new NotFoundError('Upload', id.toString());
    }
  }

  async getUploadFilePath(id: number): Promise<string> {
    const upload = await this.getUploadById(id);
    
    if (!fs.existsSync(upload.filePath)) {
      throw new NotFoundError('Archivo en disco', upload.filePath);
    }

    return upload.filePath;
  }
}
