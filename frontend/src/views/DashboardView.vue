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
        
        const fileUpload = this.$refs.fileUpload as any;
        if (fileUpload && fileUpload.resetUpload) {
          fileUpload.resetUpload();
        }
        
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

    async goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        await this.loadUploads();
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

<style scoped lang="scss" src="./DashboardView.styles.scss"></style>

