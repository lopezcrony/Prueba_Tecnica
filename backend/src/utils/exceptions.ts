import { ErrorCodes, ErrorCode } from './errorCodes';

/**
 * Excepción base para errores de la aplicación
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(code: ErrorCode, message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error de validación (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCodes.VALIDATION_ERROR, message, 400, details);
  }
}

/**
 * Error de autenticación (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(ErrorCodes.UNAUTHORIZED, message, 401);
  }
}

/**
 * Error de permisos (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'No tienes permisos para realizar esta acción') {
    super(ErrorCodes.FORBIDDEN, message, 403);
  }
}

/**
 * Error de recurso no encontrado (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier 
      ? `${resource} con identificador '${identifier}' no encontrado`
      : `${resource} no encontrado`;
    super(ErrorCodes.DOCUMENT_NOT_FOUND, message, 404);
  }
}

/**
 * Error de credenciales inválidas (401)
 */
export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Credenciales inválidas') {
    super(ErrorCodes.INVALID_CREDENTIALS, message, 401);
  }
}

/**
 * Error de conflicto (409) - ej: usuario ya existe
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorCodes.USER_ALREADY_EXISTS, message, 409);
  }
}

/**
 * Error de validación de CSV (400)
 */
export class CSVValidationError extends AppError {
  constructor(message: string, details: any) {
    super(ErrorCodes.CSV_VALIDATION_ERROR, message, 400, details);
  }
}

/**
 * Error de archivo no proporcionado (400)
 */
export class FileNotProvidedError extends AppError {
  constructor(message: string = 'No se proporcionó ningún archivo') {
    super(ErrorCodes.FILE_NOT_PROVIDED, message, 400);
  }
}

/**
 * Error de archivo vacío (400)
 */
export class EmptyFileError extends AppError {
  constructor(message: string = 'El archivo está vacío') {
    super(ErrorCodes.CSV_EMPTY, message, 400);
  }
}

/**
 * Error de headers faltantes en CSV (400)
 */
export class MissingHeadersError extends AppError {
  constructor(missingHeaders: string[]) {
    super(
      ErrorCodes.CSV_MISSING_HEADERS,
      `Faltan los siguientes headers en el archivo CSV: ${missingHeaders.join(', ')}`,
      400,
      { missingHeaders }
    );
  }
}
