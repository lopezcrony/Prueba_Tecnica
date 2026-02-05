import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { ENV } from '../config/env';
import { UserRole } from '../database/entities/User';
import { 
  IAuthService, 
  IUserRepository,
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  RegisterResponse 
} from '../interfaces';
import { 
  ConflictError, 
  ValidationError, 
  InvalidCredentialsError 
} from '../utils/exceptions';

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    const { name, email, password, confirmPassword, role } = data;

    if (password !== confirmPassword) {
      throw new ValidationError('Las contraseñas no coinciden');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('El usuaio ya existe');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await this.comparePasswords(password, user.password);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, ENV.BCRYPT_ROUNDS);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  generateToken(userId: number, email: string, role: UserRole): string {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRATION,
    } as SignOptions);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, ENV.JWT_SECRET);
    } catch {
      return null;
    }
  }
}
