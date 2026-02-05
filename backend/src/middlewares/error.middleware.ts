import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../utils/exceptions';
import { createErrorResponse } from '../utils/errorCodes';
import { ENV } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  // Si es una excepción de aplicación (AppError)
  if (err instanceof AppError) {
    return void res.status(err.statusCode).json(
      createErrorResponse(err.code, err.message, err.details)
    );
  }

  // Errores de Multer (upload de archivos)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return void res.status(400).json(
        createErrorResponse('FILE_TOO_LARGE', 'El archivo es demasiado grande. Tamaño máximo: 5MB')
      );
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return void res.status(400).json(
        createErrorResponse('FILE_UPLOAD_ERROR', 'Campo de archivo no esperado')
      );
    }
    return void res.status(400).json(
      createErrorResponse('FILE_UPLOAD_ERROR', err.message)
    );
  }

  // Error de fileFilter (tipo de archivo inválido)
  if (err.message === 'Solo se permiten archivos CSV') {
    return void res.status(400).json(
      createErrorResponse('INVALID_FILE_TYPE', err.message)
    );
  }

  // Error de validación de class-validator (si llega aquí)
  if (Array.isArray(err) && err.length > 0 && err[0].constraints) {
    return void res.status(400).json(
      createErrorResponse('VALIDATION_ERROR', 'Error de validación', err)
    );
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
    }
  });
};
