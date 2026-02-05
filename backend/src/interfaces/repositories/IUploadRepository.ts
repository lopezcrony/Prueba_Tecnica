import { Upload } from '../../database/entities/Upload';

export interface IUploadRepository {
  create(uploadData: Partial<Upload>): Promise<Upload>;
  findById(id: number): Promise<Upload | null>;
  findByUser(userId: number, page?: number, limit?: number): Promise<{ uploads: Upload[]; total: number }>;
  findAll(page?: number, limit?: number): Promise<{ uploads: Upload[]; total: number }>;
  delete(id: number): Promise<boolean>;
}
