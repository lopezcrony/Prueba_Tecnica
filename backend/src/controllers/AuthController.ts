import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AuthService } from '../services/AuthService';
import { RegisterDTO, LoginDTO } from '../dtos';
import { createSuccessResponse } from '../utils/errorCodes';
import { IAuthService } from '../interfaces';
import { ValidationError } from '../utils/exceptions';

export class AuthController {
  private authService: IAuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Registrar nuevo usuario
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *               - confirmPassword
   *               - role
   *             properties:
   *               name:
   *                 type: string
   *                 example: Juan Pérez
   *               email:
   *                 type: string
   *                 format: email
   *                 example: juan@example.com
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: Password123!
   *               confirmPassword:
   *                 type: string
   *                 example: Password123!
   *               role:
   *                 type: string
   *                 enum: [user, admin]
   *                 example: user
   *     responses:
   *       201:
   *         description: Usuario creado exitosamente (NO devuelve token, debe hacer login)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                         name:
   *                           type: string
   *                         email:
   *                           type: string
   *                         role:
   *                           type: string
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *       400:
   *         description: Datos inválidos o email ya existe
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(RegisterDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) => ({
          field: error.property,
          errors: error.constraints ? Object.values(error.constraints) : [],
        }));
        throw new ValidationError('Errores de validación', errorMessages);
      }

      const result = await this.authService.register(dto);

      res.status(201).json(
        createSuccessResponse(result, 'Usuario registrado exitosamente')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Iniciar sesión y obtener token JWT
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *               password:
   *                 type: string
   *                 example: admin123
   *     responses:
   *       200:
   *         description: Login exitoso (devuelve token + usuario)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                         name:
   *                           type: string
   *                         email:
   *                           type: string
   *                         role:
   *                           type: string
   *       401:
   *         description: Credenciales inválidas
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar DTO
      const dto = plainToClass(LoginDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) => ({
          field: error.property,
          errors: error.constraints ? Object.values(error.constraints) : [],
        }));
        throw new ValidationError('Errores de validación', errorMessages);
      }

      // Intentar login
      const result = await this.authService.login(dto);

      res.status(200).json(
        createSuccessResponse(result, 'Login exitoso')
      );
    } catch (error) {
      next(error);
    }
  };
}
