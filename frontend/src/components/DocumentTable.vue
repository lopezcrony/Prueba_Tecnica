<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Upload } from '../types/document.types';
import { confirmDelete } from '../utils/alerts';

export default defineComponent({
  name: 'DocumentTable',

  props: {
    uploads: {
      type: Array as PropType<Upload[]>,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['download', 'delete'],

  methods: {
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    },

    handleDownload(uploadId: number) {
      this.$emit('download', uploadId);
    },

    async handleDelete(uploadId: number) {
      const result = await confirmDelete();
      
      if (result.isConfirmed) {
        this.$emit('delete', uploadId);
      }
    },
  },
});
</script>

<template>
  <div class="table-container">
    <div v-if="loading" class="loading-state">
      <p>Cargando...</p>
    </div>

    <div v-else-if="uploads.length === 0" class="empty-state">
      <p>📁 No hay archivos cargados aún</p>
      <p class="empty-hint">Sube tu primer archivo CSV para comenzar</p>
    </div>

    <table v-else class="documents-table">
      <thead>
        <tr>
          <th>NOMBRE DOC.</th>
          <th>USUARIO</th>
          <th>FECHA CARGA</th>
          <th>REGISTROS</th>
          <th>ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="upload in uploads" :key="upload.id">
          <td class="filename">
            📄 {{ upload.originalFileName }}
          </td>
          <td>{{ upload.uploadedBy.name }}</td>
          <td>{{ formatDate(upload.uploadedAt) }}</td>
          <td>
            <span class="records-count">{{ upload.totalRecords }}</span>
          </td>
          <td class="actions">
            <button
              class="btn-action btn-download"
              @click="handleDownload(upload.id)"
              title="Descargar CSV"
            >
              ⬇️ Descargar
            </button>
            <button
              v-if="isAdmin"
              class="btn-action btn-delete"
              @click="handleDelete(upload.id)"
              title="Eliminar"
            >
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem 1.25rem;
  color: #64748b;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.empty-state p {
  font-size: 0.95rem;
  margin: 0.35rem 0;
  color: #475569;
  font-weight: 600;
}

.empty-hint {
  font-size: 0.8rem;
  color: #94a3b8;
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  display: block;
}

.documents-table thead {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  display: table;
  width: 100%;
  table-layout: fixed;
}

.documents-table tbody {
  display: block;
  max-height: calc(100vh - 380px);
  overflow-y: auto;
  overflow-x: hidden;
}

.documents-table thead tr,
.documents-table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.documents-table th {
  padding: 0.65rem 0.85rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.documents-table tbody tr {
  transition: all 0.15s;
}

.documents-table tbody tr:hover {
  background-color: #f8fafc;
}

.documents-table td {
  padding: 0.65rem 0.85rem;
  font-size: 0.8rem;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
}

.documents-table tbody tr:last-child td {
  border-bottom: none;
}

.filename {
  font-weight: 600;
  color: #2563eb;
  font-size: 0.8rem;
}

.records-count {
  font-weight: 700;
  color: #059669;
  background-color: #f0fdf4;
  padding: 0.2rem 0.55rem;
  border-radius: 10px;
  display: inline-block;
  font-size: 0.75rem;
}

.actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-download {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-download:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.25);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(220, 38, 38, 0.25);
}

/* Responsive */
@media (max-width: 1024px) {
  .documents-table tbody {
    max-height: calc(100vh - 400px);
  }

  .documents-table th {
    font-size: 0.7rem;
    padding: 0.6rem 0.7rem;
  }

  .documents-table td {
    font-size: 0.72rem;
    padding: 0.6rem 0.7rem;
  }

  .filename {
    font-size: 0.72rem;
  }

  .records-count {
    font-size: 0.68rem;
    padding: 0.18rem 0.48rem;
  }

  .btn-action {
    font-size: 0.68rem;
    padding: 0.35rem 0.62rem;
  }
}

@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
    border-radius: 6px;
    -webkit-overflow-scrolling: touch; /* Smooth scroll en iOS */
  }

  .documents-table {
    min-width: 650px; /* Asegura scroll horizontal */
  }

  .documents-table tbody {
    max-height: calc(100vh - 380px);
  }

  .documents-table th {
    font-size: 0.65rem;
    padding: 0.5rem 0.5rem;
    white-space: nowrap;
  }

  .documents-table td {
    padding: 0.5rem 0.5rem;
    font-size: 0.68rem;
  }

  .filename {
    font-size: 0.68rem;
  }

  .actions {
    flex-direction: column;
    gap: 0.3rem;
    align-items: stretch;
  }

  .btn-action {
    padding: 0.3rem 0.55rem;
    font-size: 0.63rem;
    width: 100%;
  }

  .records-count {
    font-size: 0.63rem;
    padding: 0.15rem 0.42rem;
  }
}

@media (max-width: 480px) {
  .documents-table {
    min-width: 600px;
  }

  .documents-table tbody {
    max-height: calc(100vh - 360px);
  }

  .documents-table th {
    font-size: 0.6rem;
    padding: 0.45rem 0.4rem;
  }

  .documents-table td {
    padding: 0.45rem 0.4rem;
    font-size: 0.63rem;
  }

  .filename {
    font-size: 0.63rem;
  }

  .btn-action {
    padding: 0.28rem 0.5rem;
    font-size: 0.6rem;
  }

  .records-count {
    font-size: 0.58rem;
    padding: 0.12rem 0.38rem;
  }

  .empty-state p {
    font-size: 0.82rem;
  }

  .empty-hint {
    font-size: 0.68rem;
  }

  .loading-state {
    padding: 1.5rem 0.9rem;
    font-size: 0.75rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 375px) {
  .documents-table {
    min-width: 550px;
  }

  .documents-table tbody {
    max-height: calc(100vh - 340px);
  }

  .documents-table th,
  .documents-table td {
    font-size: 0.58rem;
    padding: 0.4rem 0.35rem;
  }
}
</style>
