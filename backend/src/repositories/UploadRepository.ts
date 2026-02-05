import AppDataSource from '../config/database';
import { Upload } from '../database/entities/Upload';
import { IUploadRepository } from '../interfaces/repositories/IUploadRepository';
import { Repository } from 'typeorm';

export class UploadRepository implements IUploadRepository {
  private repository: Repository<Upload>;

  constructor() {
    this.repository = AppDataSource.getRepository(Upload);
  }

  async create(uploadData: Partial<Upload>): Promise<Upload> {
    const upload = this.repository.create(uploadData);
    return await this.repository.save(upload);
  }

  async findById(id: number): Promise<Upload | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['uploadedBy', 'documents']
    });
  }

  async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<{ uploads: Upload[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [uploads, total] = await this.repository.findAndCount({
      where: { uploadedById: userId },
      relations: ['uploadedBy'],
      order: { uploadedAt: 'DESC' },
      skip,
      take: limit
    });

    return { uploads, total };
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ uploads: Upload[]; total: number }> {
    const skip = (page - 1) * limit;

    const [uploads, total] = await this.repository.findAndCount({
      relations: ['uploadedBy'],
      order: { uploadedAt: 'DESC' },
      skip,
      take: limit
    });

    return { uploads, total };
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
