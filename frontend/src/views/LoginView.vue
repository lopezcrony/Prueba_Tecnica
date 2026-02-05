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

<style scoped lang="scss" src="./LoginView.styles.scss"></style>

