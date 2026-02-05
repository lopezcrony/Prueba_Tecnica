<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { showError, showLoading, closeLoading } from '../utils/alerts';
import { validators } from '../utils/validators';
import type { LoginCredentials } from '../types/auth.types';

export default defineComponent({
  name: 'LoginView',

  data() {
    return {
      form: {
        email: '',
        password: '',
      } as LoginCredentials,
      errors: {
        email: '',
        password: '',
      },
      loading: false,
      showPassword: false,
    };
  },

  methods: {
    validateField(field: keyof typeof this.errors): void {
      // Validar campo individual en tiempo real
      switch (field) {
        case 'email':
          this.errors.email = validators.email(this.form.email) || '';
          break;
        case 'password':
          this.errors.password = validators.password(this.form.password) || '';
          break;
      }
    },

    validateForm(): boolean {
      this.errors = {
        email: '',
        password: '',
      };

      const emailError = validators.email(this.form.email);
      const passwordError = validators.password(this.form.password);

      if (emailError) this.errors.email = emailError;
      if (passwordError) this.errors.password = passwordError;

      return !emailError && !passwordError;
    },

    async handleSubmit() {
      if (!this.validateForm()) return;

      this.loading = true;

      try {
        showLoading('Iniciando sesión...');
        
        const authStore = useAuthStore();
        await authStore.login(this.form);
        
        closeLoading();
        
        // Redirigir al dashboard
        this.$router.push({ name: 'dashboard' });
      } catch (error: any) {
        closeLoading();
        showError(
          error.response?.data?.error?.message || 'Error al iniciar sesión',
          'Error de autenticación'
        );
      } finally {
        this.loading = false;
      }
    },

    goToRegister() {
      this.$router.push({ name: 'register' });
    },
  },
});
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <h1 class="login-title">Iniciar sesión</h1>
      </div>

      <div class="card-content">
        <form @submit.prevent="handleSubmit" class="login-form">
          <!-- Email -->
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <div class="input-wrapper">
              <div class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="correo@ejemplo.com"
                :disabled="loading"
                @blur="validateField('email')"
              />
            </div>
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <div class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="••••••••"
                :disabled="loading"
                @blur="validateField('password')"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="error">{{ errors.password }}</span>
          </div>

          <!-- Botón de ingresar -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>
              Ingresar
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </span>
          </button>

          <!-- Link a registro -->
          <p class="register-link">
            ¿No tienes cuenta?
            <a @click.prevent="goToRegister" href="#">Crear una cuenta</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
  padding: 1.5rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  padding: 1.25rem 1.5rem;
  border-bottom: 3px solid #1e40af;
}

.login-title {
  text-align: center;
  font-size: 1.375rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 1.5rem 1.5rem 1.75rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  font-weight: 600;
  color: #334155;
  font-size: 0.8125rem;
  margin-bottom: 0.125rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  width: 1.125rem;
  height: 1.125rem;
  color: rgba(71, 85, 105, 0.5);
  pointer-events: none;
  z-index: 1;
}

.input-icon svg {
  width: 100%;
  height: 100%;
}

.form-input {
  width: 100%;
  height: 2.5rem;
  padding: 0 2.5rem 0 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  color: #64748b;
  transition: color 0.2s;
  z-index: 1;
}

.toggle-password:hover:not(:disabled) {
  color: #3b82f6;
}

.toggle-password:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-password svg {
  width: 100%;
  height: 100%;
}

.error {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: -0.125rem;
  font-weight: 500;
}

.btn-submit {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.625rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-submit svg {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.register-link {
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.register-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    padding: 1.25rem;
  }

  .card-header {
    padding: 1.5rem 1.75rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .card-content {
    padding: 1.75rem 1.75rem 2rem;
  }

  .form-input {
    height: 2.5rem;
    font-size: 0.9rem;
  }

  .btn-submit {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
    min-height: 2.75rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
  }

  .login-title {
    font-size: 1.35rem;
  }

  .card-content {
    padding: 1.5rem 1.5rem 1.75rem;
  }

  .login-form {
    gap: 1rem;
  }

  .form-group label {
    font-size: 0.8rem;
  }

  .input-icon {
    left: 0.75rem;
    width: 1.1rem;
    height: 1.1rem;
  }

  .form-input {
    height: 2.5rem;
    padding: 0 2.5rem 0 2.5rem;
    font-size: 0.875rem;
  }

  .toggle-password {
    right: 0.65rem;
    width: 1.35rem;
    height: 1.35rem;
  }

  .btn-submit {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    min-height: 2.65rem;
  }

  .btn-submit svg {
    width: 1.1rem;
    height: 1.1rem;
  }

  .spinner {
    width: 1.1rem;
    height: 1.1rem;
  }

  .register-link {
    font-size: 0.8rem;
  }

  .error {
    font-size: 0.75rem;
  }
}

@media (max-width: 375px) {
  .card-header {
    padding: 1.125rem 1.25rem;
  }

  .login-title {
    font-size: 1.25rem;
  }

  .card-content {
    padding: 1.25rem 1.25rem 1.5rem;
  }

  .form-input {
    height: 2.375rem;
    font-size: 0.85rem;
  }

  .btn-submit {
    font-size: 0.875rem;
    min-height: 2.5rem;
  }
}
</style>
