import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export interface IAuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token no proporcionado' });
      return;
    }

    const token = authHeader.substring(7);
    const authService = new AuthService();
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Token inválido o expirado' });
      return;
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Error de autenticación' });
  }
};

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'No autorizado' });
      return;
    }

    next();
  };
};
