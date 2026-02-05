<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { showSuccess, showError, showLoading, closeLoading } from '../utils/alerts';
import { validators } from '../utils/validators';
import type { RegisterData } from '../types/auth.types';

export default defineComponent({
  name: 'RegisterView',

  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' as 'user' | 'admin',
      } as RegisterData,
      errors: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
    };
  },

  computed: {
    passwordsMatch(): boolean {
      return !!(this.form.password && 
                this.form.confirmPassword && 
                this.form.password === this.form.confirmPassword);
    },
  },

  methods: {
    validateField(field: keyof typeof this.errors): void {
      switch (field) {
        case 'name':
          this.errors.name = validators.required(this.form.name, 'El nombre') || '';
          break;
        case 'email':
          this.errors.email = validators.email(this.form.email) || '';
          break;
        case 'password':
          this.errors.password = validators.password(this.form.password) || '';
          if (this.form.confirmPassword) {
            this.errors.confirmPassword = validators.confirmPassword(
              this.form.password,
              this.form.confirmPassword
            ) || '';
          }
          break;
        case 'confirmPassword':
          this.errors.confirmPassword = validators.confirmPassword(
            this.form.password,
            this.form.confirmPassword
          ) || '';
          break;
      }
    },

    validateForm(): boolean {
      this.errors = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      };

      const nameError = validators.required(this.form.name, 'El nombre');
      const emailError = validators.email(this.form.email);
      const passwordError = validators.password(this.form.password);
      const confirmPasswordError = validators.confirmPassword(
        this.form.password,
        this.form.confirmPassword
      );

      if (nameError) this.errors.name = nameError;
      if (emailError) this.errors.email = emailError;
      if (passwordError) this.errors.password = passwordError;
      if (confirmPasswordError) this.errors.confirmPassword = confirmPasswordError;

      return !nameError && !emailError && !passwordError && !confirmPasswordError;
    },

    async handleSubmit() {
      if (!this.validateForm()) return;

      this.loading = true;

      try {
        showLoading('Creando cuenta...');
        
        const authStore = useAuthStore();
        await authStore.register(this.form);
        
        closeLoading();
        
        await showSuccess('¡Usuario registrado exitosamente!', '¡Bienvenido!');
        
        this.$router.push({ name: 'login' });
      } catch (error: any) {
        closeLoading();
        showError(
          error.response?.data?.error?.message || 'Error al registrar usuario',
          'Error en el registro'
        );
      } finally {
        this.loading = false;
      }
    },

    goToLogin() {
      this.$router.push({ name: 'login' });
    },
  },
});
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <h1 class="card-title">Crear cuenta</h1>
      </div>

      <div class="card-content">
        <form @submit.prevent="handleSubmit" class="register-form">
          <!-- Nombre -->
          <div class="form-group">
            <label for="name" class="form-label">Nombre completo</label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Ingresa tu nombre completo"
                :disabled="loading"
                class="form-input"
                @blur="validateField('name')"
              />
            </div>
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Correo electrónico</label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="nombre@empresa.com"
                :disabled="loading"
                class="form-input"
                @blur="validateField('email')"
              />
            </div>
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mínimo 6 caracteres"
                :disabled="loading"
                class="form-input"
                @blur="validateField('password')"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="toggle-password"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <!-- Confirmar contraseña -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
            <div class="input-wrapper" :class="{ 'match-success': passwordsMatch }">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Repite tu contraseña"
                :disabled="loading"
                class="form-input"
                @blur="validateField('confirmPassword')"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="toggle-password"
              >
                <svg v-if="passwordsMatch" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="check-icon">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <svg v-else-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <!-- Tipo de cuenta -->
          <div class="form-group">
            <label class="form-label">Tipo de cuenta</label>
            <div class="role-grid">
              <button
                type="button"
                @click="form.role = 'user'"
                :class="['role-button', { active: form.role === 'user' }]"
                :disabled="loading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Usuario
              </button>
              <button
                type="button"
                @click="form.role = 'admin'"
                :class="['role-button', { active: form.role === 'admin' }]"
                :disabled="loading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" x2="9.01" y1="9" y2="9"></line>
                  <line x1="15" x2="15.01" y1="9" y2="9"></line>
                </svg>
                Admin
              </button>
            </div>
          </div>

          <!-- Botón de submit -->
          <button 
            type="submit" 
            class="btn-submit" 
            :disabled="loading || !passwordsMatch"
          >
            <span v-if="loading" class="btn-content">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creando cuenta...
            </span>
            <span v-else class="btn-content">
              Registrarse
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </button>
        </form>

        <div class="login-link">
          <p>
            ¿Ya tienes cuenta?
            <a @click.prevent="goToLogin" href="#">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
  padding: 1.5rem;
}

.register-card {
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

.card-title {
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

.register-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
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

.form-input::placeholder {
  color: #94a3b8;
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

.input-wrapper.match-success .form-input {
  border-color: rgba(34, 197, 94, 0.5);
  background-color: rgba(240, 253, 244, 0.5);
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

.check-icon {
  color: #16a34a !important;
}

.error-message {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: -0.125rem;
  font-weight: 500;
}

.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.role-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem;
  border: 1.5px solid rgba(226, 232, 240, 0.5);
  background-color: rgba(248, 250, 252, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.role-button:hover:not(:disabled) {
  background-color: rgba(248, 250, 252, 0.5);
}

.role-button.active {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
  color: #2563eb;
}

.role-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.role-button svg {
  width: 16px;
  height: 16px;
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

.login-link {
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.login-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.login-link a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-card {
    max-width: 100%;
  }

  .card-header {
    padding: 1.25rem 1.5rem 0.85rem 1.5rem;
  } 

  .card-title {
    font-size: 1.125rem;
  }

  .card-content {
    padding: 1.25rem 1.5rem 1.75rem 1.5rem;
  }

  .register-form {
    gap: 0.65rem;
  }

  .form-group {
    gap: 0.3rem;
  }

  .form-label {
    font-size: 0.7rem;
  }

  .form-input {
    height: 2.25rem;
    padding: 0 2rem 0 2rem;
    font-size: 0.8125rem;
  }

  .btn-submit {
    height: 2.25rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 1rem;
  }

  .register-card {
    border-radius: 10px;
  }

  .card-header {
    padding: 1rem 1.25rem 0.75rem 1.25rem;
  }

  .card-title {
    font-size: 1.35rem;
  }

  .card-content {
    padding: 1.5rem 1.5rem 1.75rem;
  }

  .register-form {
    gap: 0.6rem;
  }

  .form-label {
    font-size: 0.6875rem;
  }

  .form-input {
    height: 2.125rem;
    font-size: 0.8rem;
  }

  .input-icon {
    left: 0.65rem;
  }

  .toggle-password {
    right: 0.65rem;
  }

  .role-button {
    padding: 0.5rem;
    font-size: 0.8125rem;
    gap: 0.375rem;
  }

  .btn-submit {
    height: 2.125rem;
    font-size: 0.8rem;
  }

  .login-link {
    padding-top: 0.65rem;
    margin-top: 0.4rem;
  }

  .login-link p {
    font-size: 0.8125rem;
  }
}

@media (max-width: 375px) {
  .card-header {
    padding: 1.125rem 1.25rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .form-input,
  .btn-submit {
    height: 2rem;
    font-size: 0.75rem;
  }

  .role-button {
    font-size: 0.75rem;
  }
}
</style>
