import { UserRole } from '../../database/entities/User';
import { PaginatedResponse } from '../models/common.types';
import { DocumentResponse } from '../models/document.types';

export interface UploadCSVResult {
  recordsImported: number;
  message: string;
  uploadId: number;
}

export interface IDocumentService {
  uploadCSV(filePath: string, originalFileName: string, userId: number): Promise<UploadCSVResult>;
  listDocuments(uploadId?: number, page?: number, limit?: number): Promise<PaginatedResponse<DocumentResponse>>;
  deleteDocument(id: number, userId: number, userRole: UserRole): Promise<void>;
  getDocumentById(id: number): Promise<DocumentResponse | null>;
}
