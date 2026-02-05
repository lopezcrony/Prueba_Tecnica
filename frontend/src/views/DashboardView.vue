<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { uploadService } from '../services/upload.service';
import { showSuccess, showError, showLoading, closeLoading } from '../utils/alerts';
import FileUpload from '../components/FileUpload.vue';
import DocumentTable from '../components/DocumentTable.vue';
import type { Upload } from '../types/document.types';

export default defineComponent({
  name: 'DashboardView',

  components: {
    FileUpload,
    DocumentTable,
  },

  data() {
    return {
      uploads: [] as Upload[],
      loading: false,
      // Paginación
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    };
  },

  computed: {
    authStore() {
      return useAuthStore();
    },
    
    isAdmin(): boolean {
      return this.authStore.isAdmin;
    },
    
    userName(): string {
      return this.authStore.userName;
    },

    // Total de páginas basado en totalItems del backend
    totalPages(): number {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },

    pageNumbers(): number[] {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },

  mounted() {
    this.loadUploads();
  },

  methods: {
    async loadUploads() {
      this.loading = true;

      try {
        let result;
        if (this.isAdmin) {
          result = await uploadService.getAllUploads(this.currentPage, this.itemsPerPage);
        } else {
          result = await uploadService.getUserUploads(this.currentPage, this.itemsPerPage);
        }
        
        this.uploads = result.uploads;
        this.totalItems = result.total;
      } catch (error: any) {
        showError('Error al cargar los archivos', 'Error de carga');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async handleFileSelected(file: File) {
      try {
        showLoading('Subiendo y procesando archivo...');
        
        const response = await uploadService.uploadFile(file);
        
        closeLoading();
        
        await showSuccess(response.message, '¡Archivo subido!');
        
        // Limpiar el componente FileUpload
        const fileUpload = this.$refs.fileUpload as any;
        if (fileUpload && fileUpload.resetUpload) {
          fileUpload.resetUpload();
        }
        
        // Recargar la lista de uploads
        await this.loadUploads();
      } catch (error: any) {
        closeLoading();
        showError(
          error.response?.data?.error?.message || 'Error al subir el archivo',
          'Error al subir'
        );
      }
    },

    async handleDownload(uploadId: number) {
      try {
        showLoading('Descargando archivo...');
        
        const blob = await uploadService.downloadUpload(uploadId);
        const upload = this.uploads.find(u => u.id === uploadId);
        const filename = upload?.originalFileName || 'download.csv';
        
        closeLoading();
        
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showSuccess('Archivo descargado correctamente', '¡Descargado!');
      } catch (error: any) {
        closeLoading();
        showError('Error al descargar el archivo', 'Error de descarga');
        console.error(error);
      }
    },

    async handleDelete(uploadId: number) {
      try {
        showLoading('Eliminando archivo...');
        
        await uploadService.deleteUpload(uploadId);
        
        closeLoading();
        
        // Actualizar la lista
        await this.loadUploads();
        
        showSuccess('Archivo eliminado correctamente', '¡Eliminado!');
      } catch (error: any) {
        closeLoading();
        showError(
          error.response?.data?.message || 'Error al eliminar el archivo',
          'Error al eliminar'
        );
      }
    },

    handleLogout() {
      this.authStore.logout();
      this.$router.push({ name: 'login' });
    },

    // Métodos de paginación
    async goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        await this.loadUploads(); // Recargar datos del backend
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    async nextPage() {
      await this.goToPage(this.currentPage + 1);
    },

    async prevPage() {
      await this.goToPage(this.currentPage - 1);
    },
  },
});
</script>

<template>
  <div class="dashboard-container">
    <!-- Header Fijo -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">DASHBOARD</h1>
        <div class="user-info">
          <span class="user-name">👤 {{ userName }}</span>
          <button class="btn-logout" @click="handleLogout">
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido con scroll -->
    <div class="dashboard-content">
      <!-- Main Content -->
      <main class="dashboard-main">
        <!-- Upload Section -->
        <section class="upload-section">
          <FileUpload ref="fileUpload" @file-selected="handleFileSelected" />
        </section>

        <!-- Table Section con Scroll -->
        <section class="table-section">
          <h2 class="section-title">
            {{ isAdmin ? 'Todos los Archivos' : 'Mis Archivos' }}
          </h2>
          
          <DocumentTable
            :uploads="uploads"
            :is-admin="isAdmin"
            :loading="loading"
            @download="handleDownload"
            @delete="handleDelete"
          />

          <!-- Paginación - Siempre visible -->
          <div class="pagination">
            <button 
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              ← Anterior
            </button>

            <button
              v-for="page in pageNumbers"
              :key="page"
              class="pagination-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button 
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Siguiente →
            </button>
          </div>

          <!-- Info de paginación - Siempre visible -->
          <div class="pagination-info">
            <span v-if="uploads.length > 0">
              Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }} - 
              {{ ((currentPage - 1) * itemsPerPage) + uploads.length }} 
              de {{ totalItems }} archivos
            </span>
            <span v-else>No hay archivos</span>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f1f5f9;
}

/* Header Fijo */
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
  color: white;
  padding: 0.6rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  width: 100%;
  flex-shrink: 0;
}

.header-content {
  width: 100%;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.dashboard-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.user-name {
  font-weight: 500;
  font-size: 0.85rem;
}

.admin-badge {
  background-color: #fbbf24;
  color: #78350f;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.btn-logout {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-logout:hover {
  background-color: white;
  color: #2563eb;
  border-color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-logout:active {
  transform: translateY(0);
}

/* Contenido con Scroll */
.dashboard-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.dashboard-main {
  width: 100%;
  padding: 0.85rem 1.5rem 0.4rem 1.5rem;
  min-height: calc(100% - 1.25rem);
}

.upload-section {
  margin-bottom: 0.85rem;
}

.table-section {
  margin-top: 0.65rem;
  margin-bottom: 0.4rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.85rem;
  margin-bottom: 0.4rem;
  flex-wrap: wrap;
  padding: 0.4rem 0;
}

.pagination-btn {
  padding: 0.45rem 0.75rem;
  border: 2px solid #e2e8f0;
  background-color: white;
  color: #475569;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 38px;
  text-align: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #3b82f6;
  color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

.pagination-btn.active {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-color: #2563eb;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: #f1f5f9;
  transform: none;
}

.pagination-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.2);
}

.pagination-info {
  text-align: center;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

/* Responsive Design - Mobile First Approach */

/* Tablets (1024px) */
@media (max-width: 1024px) {
  .dashboard-main {
    padding: 1.1rem 1.3rem;
  }

  .dashboard-title {
    font-size: 1.15rem;
  }

  .user-name {
    font-size: 0.8rem;
  }

  .btn-logout {
    padding: 0.38rem 0.9rem;
    font-size: 0.78rem;
  }

  .section-title {
    font-size: 1.05rem;
  }

  .alert {
    font-size: 0.8rem;
    padding: 0.6rem 0.9rem;
  }

  .pagination-btn {
    padding: 0.4rem 0.7rem;
    font-size: 0.75rem;
    min-width: 36px;
  }

  .pagination-info {
    font-size: 0.75rem;
  }
}

/* Mobile Landscape & Small Tablets (768px) */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
    gap: 0.5rem;
  }

  .dashboard-title {
    font-size: 1rem;
    letter-spacing: 0.8px;
  }

  .user-info {
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
  }

  .user-name {
    font-size: 0.75rem;
  }

  .admin-badge {
    font-size: 0.6rem;
    padding: 0.2rem 0.5rem;
  }

  .btn-logout {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
  }

  .dashboard-main {
    padding: 0.9rem 1rem;
  }

  .section-title {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
  }

  .alert {
    padding: 0.55rem 0.8rem;
    font-size: 0.75rem;
  }

  .upload-section {
    margin-bottom: 1rem;
  }

  .pagination {
    gap: 0.3rem;
    padding: 0.4rem 0;
  }

  .pagination-btn {
    padding: 0.35rem 0.6rem;
    font-size: 0.7rem;
    min-width: 32px;
  }

  .pagination-info {
    font-size: 0.7rem;
    margin-top: 0.5rem;
  }
}

/* Mobile Portrait (480px) */
@media (max-width: 480px) {
  .dashboard-header {
    padding: 0.55rem 0;
  }

  .header-content {
    padding: 0 0.75rem;
    gap: 0.4rem;
  }

  .dashboard-title {
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }

  .user-name {
    font-size: 0.7rem;
  }

  .btn-logout {
    padding: 0.3rem 0.65rem;
    font-size: 0.7rem;
  }

  .dashboard-main {
    padding: 0.7rem 0.75rem;
  }

  .section-title {
    font-size: 0.85rem;
    margin-bottom: 0.7rem;
  }

  .alert {
    padding: 0.5rem 0.7rem;
    font-size: 0.7rem;
  }

  .upload-section {
    margin-bottom: 0.9rem;
  }

  .pagination {
    gap: 0.25rem;
    padding: 0.3rem 0;
  }

  .pagination-btn {
    padding: 0.3rem 0.5rem;
    font-size: 0.65rem;
    min-width: 28px;
  }

  .pagination-info {
    font-size: 0.65rem;
  }
}

/* Extra Small Mobile (375px and below) */
@media (max-width: 375px) {
  .dashboard-title {
    font-size: 0.85rem;
  }

  .user-name {
    font-size: 0.65rem;
  }

  .btn-logout {
    padding: 0.28rem 0.6rem;
    font-size: 0.65rem;
  }

  .pagination-btn {
    padding: 0.28rem 0.45rem;
    font-size: 0.6rem;
    min-width: 26px;
  }
}
</style>
