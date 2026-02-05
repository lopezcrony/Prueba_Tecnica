<script lang="ts">
import { defineComponent } from 'vue';
import { confirm, showError } from '../utils/alerts';

export default defineComponent({
  name: 'FileUpload',

  emits: ['file-selected'],

  data() {
    return {
      isDragging: false,
      selectedFileName: '',
    };
  },

  methods: {
    handleDragEnter() {
      this.isDragging = true;
    },

    handleDragLeave() {
      this.isDragging = false;
    },

    async handleDrop(event: DragEvent) {
      this.isDragging = false;
      const files = event.dataTransfer?.files;

      if (files && files.length > 0 && files[0]) {
        await this.handleFile(files[0]);
      }
    },

    async handleFileInput(event: Event) {
      const target = event.target as HTMLInputElement;
      const files = target.files;

      if (files && files.length > 0 && files[0]) {
        await this.handleFile(files[0]);
      }
      
      // Limpiar el input para permitir subir el mismo archivo de nuevo
      target.value = '';
    },

    async handleFile(file: File) {
      // Validar que sea CSV
      if (!file.name.endsWith('.csv')) {
        await showError('Por favor selecciona un archivo CSV', 'Formato inválido');
        return;
      }

      // Confirmar subida
      const result = await confirm(
        '¿Confirmar subida?',
        `¿Deseas subir el archivo "${file.name}"? Se procesarán todos los contactos del CSV.`
      );

      if (result.isConfirmed) {
        this.selectedFileName = file.name;
        this.$emit('file-selected', file);
      }
    },

    triggerFileInput() {
      const input = this.$refs.fileInput as HTMLInputElement;
      input.click();
    },

    resetUpload() {
      this.selectedFileName = '';
      const input = this.$refs.fileInput as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    },
  },
});
</script>

<template>
  <div class="file-upload-container">
    <div
      class="drop-zone"
      :class="{ 'drag-over': isDragging }"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="drop-zone-content">
        <svg
          class="cloud-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p class="drop-zone-text">
          <span v-if="!selectedFileName">
            <strong>DRAG & DROP</strong> / SELECCIONAR CSV
          </span>
          <span v-else class="selected-file">
            📄 {{ selectedFileName }}
          </span>
        </p>

        <p class="drop-zone-hint">
          Arrastra tu archivo CSV aquí o haz clic para seleccionar
        </p>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept=".csv"
        @change="handleFileInput"
        style="display: none"
      />
    </div>
  </div>
</template>

<style scoped>
.file-upload-container {
  width: 100%;
}

.drop-zone {
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 1.5rem 1.25rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.drop-zone:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
}

.drop-zone.drag-over {
  border-color: #2563eb;
  background-color: #eff6ff;
  transform: scale(1.005);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.15);
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
}

.cloud-icon {
  width: 50px;
  height: 50px;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.drop-zone-text {
  font-size: 0.95rem;
  color: #1e293b;
  margin: 0;
  font-weight: 600;
}

.drop-zone-text strong {
  color: #2563eb;
  font-weight: 700;
}

.selected-file {
  color: #059669;
  font-weight: 600;
}

.drop-zone-hint {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .drop-zone {
    padding: 1.35rem 1.1rem;
  }

  .cloud-icon {
    width: 45px;
    height: 45px;
  }

  .drop-zone-text {
    font-size: 0.9rem;
  }

  .drop-zone-hint {
    font-size: 0.72rem;
  }
}

@media (max-width: 768px) {
  .drop-zone {
    padding: 1.15rem 0.95rem;
  }

  .cloud-icon {
    width: 40px;
    height: 40px;
  }

  .drop-zone-text {
    font-size: 0.82rem;
  }

  .drop-zone-hint {
    font-size: 0.68rem;
  }
}

@media (max-width: 480px) {
  .drop-zone {
    padding: 0.95rem 0.7rem;
  }

  .cloud-icon {
    width: 36px;
    height: 36px;
  }

  .drop-zone-text {
    font-size: 0.75rem;
  }

  .drop-zone-hint {
    font-size: 0.62rem;
  }

  .drop-zone-content {
    gap: 0.5rem;
  }
}
</style>

