import { Upload } from '../../database/entities/Upload';

export interface IUploadService {
  createUpload(originalFileName: string, filePath: string, totalRecords: number, uploadedById: number): Promise<Upload>;
  getUploadById(id: number): Promise<Upload>;
  getUserUploads(userId: number, page?: number, limit?: number): Promise<{ uploads: Upload[]; total: number }>;
  getAllUploads(page?: number, limit?: number): Promise<{ uploads: Upload[]; total: number }>;
  deleteUpload(id: number, userId: number, userRole: string): Promise<void>;
  getUploadFilePath(id: number): Promise<string>;
}
