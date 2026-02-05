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

<style scoped lang="scss" src="./RegisterView.styles.scss"></style>

