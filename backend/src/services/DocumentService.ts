import { DocumentRepository } from '../repositories/DocumentRepository';
import { UploadRepository } from '../repositories/UploadRepository';
import { CSVService } from './CSVService';
import { 
  IDocumentService, 
  IDocumentRepository,
  ICSVService,
  CreateDocumentData,
  PaginatedResponse,
  DocumentResponse,
  UploadCSVResult
} from '../interfaces';
import { IUploadRepository } from '../interfaces/repositories/IUploadRepository';
import { UserRole } from '../database/entities/User';
import { 
  CSVValidationError, 
  NotFoundError, 
  ForbiddenError,
  FileNotProvidedError
} from '../utils/exceptions';
import path from 'path';

export class DocumentService implements IDocumentService {
  private documentRepository: IDocumentRepository;
  private uploadRepository: IUploadRepository;
  private csvService: ICSVService;

  constructor() {
    this.documentRepository = new DocumentRepository();
    this.uploadRepository = new UploadRepository();
    this.csvService = new CSVService();
  }

  async uploadCSV(filePath: string, originalFileName: string, userId: number): Promise<UploadCSVResult> {
    try {
      const result = await this.csvService.parseAndValidateCSV(filePath);

      if (!result.isValid) {
        throw new CSVValidationError(
          'El archivo CSV contiene errores de validación',
          { errors: result.errors }
        );
      }

      const upload = await this.uploadRepository.create({
        originalFileName,
        filePath,
        totalRecords: result.data.length,
        uploadedById: userId
      });

      const documentsToInsert: CreateDocumentData[] = result.data.map((record) => ({
        correo: record.correo,
        nombre: record.nombre,
        telefono: record.telefono,
        ciudad: record.ciudad,
        notas: record.notas,
        uploadId: upload.id,
      }));

      await this.documentRepository.createMany(documentsToInsert);

      return {
        recordsImported: documentsToInsert.length,
        message: `${documentsToInsert.length} registro(s) importado(s) exitosamente`,
        uploadId: upload.id,
      };
    } catch (error) {
      throw error;
    }
  }

  async listDocuments(uploadId?: number, page = 1, limit = 10): Promise<PaginatedResponse<DocumentResponse>> {
    const skip = (page - 1) * limit;
    
    let documents;
    let total: number;

    if (uploadId) {
      [documents, total] = await this.documentRepository.findByUploadId(uploadId, skip, limit);
    } else {
      [documents, total] = await this.documentRepository.findAll(skip, limit);
    }

    const data: DocumentResponse[] = documents.map(doc => ({
      id: doc.id,
      correo: doc.correo,
      nombre: doc.nombre,
      telefono: doc.telefono,
      ciudad: doc.ciudad,
      notas: doc.notas,
      uploadId: doc.uploadId,
      createdAt: doc.createdAt,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteDocument(id: number, userId: number, userRole: UserRole): Promise<void> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundError('Documento', id.toString());
    }

    if (userRole !== 'admin') {
      throw new ForbiddenError();
    }

    await this.documentRepository.delete(id);
  }

  async getDocumentById(id: number): Promise<DocumentResponse | null> {
    const document = await this.documentRepository.findById(id);
    
    if (!document) {
      return null;
    }

    return {
      id: document.id,
      correo: document.correo,
      nombre: document.nombre,
      telefono: document.telefono,
      ciudad: document.ciudad,
      notas: document.notas,
      uploadId: document.uploadId,
      createdAt: document.createdAt,
    };
  }
}
