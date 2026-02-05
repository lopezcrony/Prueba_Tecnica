import { Repository } from 'typeorm';
import AppDataSource from '../config/database';
import { User } from '../database/entities/User';
import { IUserRepository, CreateUserData, UpdateUserData } from '../interfaces';

export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(data: CreateUserData): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: number, data: UpdateUserData): Promise<User | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return !!result.affected;
  }

  async findAll(skip = 0, take = 10): Promise<[User[], number]> {
    return this.repository.findAndCount({ skip, take });
  }
}
