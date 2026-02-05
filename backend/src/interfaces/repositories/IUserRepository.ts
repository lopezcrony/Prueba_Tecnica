import { User } from '../../database/entities/User';
import { CreateUserData, UpdateUserData } from '../models/user.types';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: number, data: UpdateUserData): Promise<User | null>;
  delete(id: number): Promise<boolean>;
  findAll(skip?: number, take?: number): Promise<[User[], number]>;
}
