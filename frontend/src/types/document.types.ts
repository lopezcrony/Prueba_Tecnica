/**
 * Tipos relacionados con documentos
 */

export interface Document {
  id: number;
  correo: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  notas: string | null;
  uploadId: number;
  createdAt: string;
}

export interface PaginatedDocuments {
  data: Document[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Upload {
  id: number;
  originalFileName: string;
  totalRecords: number;
  uploadedAt: string;
  uploadedBy: {
    id: number;
    name: string;
    email: string;
  };
}

export interface UploadResponse {
  message: string;
  uploadId: number;
}
