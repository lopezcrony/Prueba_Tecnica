import Swal from 'sweetalert2';

/**
 * Configuración de SweetAlert2 personalizada con el tema de la aplicación
 */
const customClass = {
  popup: 'custom-swal-popup',
  confirmButton: 'custom-swal-confirm',
  cancelButton: 'custom-swal-cancel',
  denyButton: 'custom-swal-deny',
};

/**
 * Alerta de éxito
 */
export const showSuccess = (message: string, title: string = '¡Éxito!') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    timer: 3000,
    timerProgressBar: true,
    customClass,
  });
};

/**
 * Alerta de error
 */
export const showError = (message: string, title: string = 'Error') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    customClass,
  });
};

/**
 * Confirmación de eliminación
 */
export const confirmDelete = (message: string = '¿Estás seguro de eliminar este archivo y todos sus documentos?') => {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    customClass: {
      popup: 'custom-swal-popup',
      confirmButton: 'custom-swal-delete',
      cancelButton: 'custom-swal-cancel',
    },
  });
};

/**
 * Confirmación genérica
 */
export const confirm = (title: string, message: string) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    customClass,
  });
};

/**
 * Alerta de carga/procesando
 */
export const showLoading = (message: string = 'Procesando...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/**
 * Cerrar alerta de carga
 */
export const closeLoading = () => {
  Swal.close();
};
