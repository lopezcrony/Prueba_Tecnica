/**
 * Servicio de uploads
 * Maneja listado, descarga y eliminación de archivos CSV
 */

import apiClient from './api/axios';
import type { Upload, UploadResponse } from '../types/document.types';
import type { ApiSuccessResponse } from '../types/api.types';

export const uploadService = {
  /**
   * Subir archivo CSV
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiSuccessResponse<UploadResponse>>(
      '/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Obtener uploads del usuario con paginación
   */
  async getUserUploads(page: number = 1, limit: number = 10): Promise<{ uploads: Upload[]; total: number; totalPages: number }> {
    const response = await apiClient.get<{ 
      status: string; 
      data: Upload[]; 
      pagination: { page: number; limit: number; total: number; totalPages: number } 
    }>('/uploads', {
      params: { page, limit }
    });
    return {
      uploads: response.data.data,
      total: response.data.pagination.total,
      totalPages: response.data.pagination.totalPages
    };
  },

  /**
   * Obtener todos los uploads (admin) con paginación
   */
  async getAllUploads(page: number = 1, limit: number = 10): Promise<{ uploads: Upload[]; total: number; totalPages: number }> {
    const response = await apiClient.get<{ 
      status: string; 
      data: Upload[]; 
      pagination: { page: number; limit: number; total: number; totalPages: number } 
    }>('/uploads/all', {
      params: { page, limit }
    });
    return {
      uploads: response.data.data,
      total: response.data.pagination.total,
      totalPages: response.data.pagination.totalPages
    };
  },

  /**
   * Descargar archivo CSV
   */
  async downloadUpload(uploadId: number): Promise<Blob> {
    const response = await apiClient.get(`/uploads/${uploadId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Eliminar upload (admin)
   */
  async deleteUpload(uploadId: number): Promise<void> {
    await apiClient.delete(`/uploads/${uploadId}`);
  },
};
