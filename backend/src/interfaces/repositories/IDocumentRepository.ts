import { Document } from '../../database/entities/Document';
import { CreateDocumentData } from '../models/document.types';

export interface IDocumentRepository {
  findById(id: number): Promise<Document | null>;
  findAll(skip?: number, take?: number): Promise<[Document[], number]>;
  findByUploadId(uploadId: number, skip?: number, take?: number): Promise<[Document[], number]>;
  create(data: CreateDocumentData): Promise<Document>;
  createMany(data: CreateDocumentData[]): Promise<Document[]>;
  delete(id: number): Promise<boolean>;
  count(): Promise<number>;
}
