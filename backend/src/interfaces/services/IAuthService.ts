import { UserRole } from '../../database/entities/User';
import { UserResponse } from '../models/user.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface RegisterResponse {
  user: UserResponse;
}

export interface IAuthService {
  register(data: RegisterData): Promise<RegisterResponse>;
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  hashPassword(password: string): Promise<string>;
  comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
  generateToken(userId: number, email: string, role: UserRole): string;
  verifyToken(token: string): any;
}
