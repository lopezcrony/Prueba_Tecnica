import { Repository } from 'typeorm';
import AppDataSource from '../config/database';
import { Document } from '../database/entities/Document';
import { IDocumentRepository, CreateDocumentData } from '../interfaces';

export class DocumentRepository implements IDocumentRepository {
  private repository: Repository<Document>;

  constructor() {
    this.repository = AppDataSource.getRepository(Document);
  }

  async findById(id: number): Promise<Document | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['upload', 'upload.uploadedBy'],
    });
  }

  async findAll(skip = 0, take = 10): Promise<[Document[], number]> {
    return this.repository.findAndCount({
      skip,
      take,
      relations: ['upload', 'upload.uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUploadId(uploadId: number, skip = 0, take = 10): Promise<[Document[], number]> {
    return this.repository.findAndCount({
      where: { uploadId },
      skip,
      take,
      relations: ['upload', 'upload.uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: CreateDocumentData): Promise<Document> {
    const document = this.repository.create(data);
    return this.repository.save(document);
  }

  async createMany(data: CreateDocumentData[]): Promise<Document[]> {
    const documents = this.repository.create(data);
    return this.repository.save(documents);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return !!result.affected;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}

