// Códigos de error centralizados
export const ErrorCodes = {
  // Auth errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  PASSWORDS_DO_NOT_MATCH: 'PASSWORDS_DO_NOT_MATCH',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // CSV errors
  CSV_VALIDATION_ERROR: 'CSV_VALIDATION_ERROR',
  CSV_PARSE_ERROR: 'CSV_PARSE_ERROR',
  CSV_EMPTY: 'CSV_EMPTY',
  CSV_INVALID_FORMAT: 'CSV_INVALID_FORMAT',
  CSV_MISSING_HEADERS: 'CSV_MISSING_HEADERS',
  
  // Document errors
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  
  // File errors
  FILE_NOT_PROVIDED: 'FILE_NOT_PROVIDED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  
  // General errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// Interfaz para respuestas de error
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
}

// Interfaz para respuestas exitosas
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// Helper para crear respuestas de error
export const createErrorResponse = (
  code: ErrorCode,
  message: string,
  details?: any
): ErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    ...(details && { details }),
  },
});

// Helper para crear respuestas exitosas
export const createSuccessResponse = <T>(
  data: T,
  message?: string
): SuccessResponse<T> => ({
  success: true,
  data,
  ...(message && { message }),
});
