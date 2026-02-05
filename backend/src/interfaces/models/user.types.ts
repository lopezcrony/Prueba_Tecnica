import { UserRole } from '../../database/entities/User';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
