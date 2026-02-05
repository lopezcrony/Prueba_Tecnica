export interface CreateDocumentData {
  correo: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  notas?: string;
  uploadId: number;
}

export interface DocumentResponse {
  id: number;
  correo: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  notas?: string;
  uploadId: number;
  createdAt: Date;
}
