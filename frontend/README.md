# 📱 Frontend - Sistema de Gestión de Documentos CSV

> Aplicación web desarrollada con **Vue 3**, **TypeScript** y **Vite** para la gestión de documentos CSV.

![Vue 3](https://img.shields.io/badge/Vue-3.5.24-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite&logoColor=white)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Scripts Disponibles](#-scripts-disponibles)
- [Arquitectura y Buenas Prácticas](#-arquitectura-y-buenas-prácticas)
- [Variables de Entorno](#-variables-de-entorno)
- [Vistas de la Aplicación](#-vistas-de-la-aplicación)

---

## ✨ Características

### 🔐 **Autenticación**
- ✅ Sistema de registro con validación de contraseñas
- ✅ Login con JWT
- ✅ Gestión de sesiones con Pinia
- ✅ Guards de navegación para rutas protegidas
- ✅ Validación en tiempo real de formularios

### 📤 **Gestión de Archivos**
- ✅ Carga de archivos CSV con **Drag & Drop**
- ✅ Selector de archivos alternativo
- ✅ Validación de formato CSV
- ✅ Feedback visual del proceso de carga
- ✅ Descarga de documentos originales

### 📊 **Dashboard**
- ✅ Tabla de documentos procesados
- ✅ Información de usuario y fecha de carga
- ✅ Paginación del lado del servidor
- ✅ Control de acceso basado en roles (admin/user)
- ✅ Eliminación de documentos (solo admin)

### 🎨 **Interfaz de Usuario**
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Alertas con SweetAlert2
- ✅ Indicadores de carga
- ✅ Animaciones y transiciones suaves
- ✅ Modo oscuro en gradientes

---

## 🛠 Tecnologías

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **Vue 3** | 3.5.24 | Framework progresivo (Options API) |
| **TypeScript** | 5.9.3 | Tipado estático |
| **Vite** | 7.2.4 | Build tool ultrarrápido |
| **Pinia** | - | State management |
| **Vue Router** | - | Enrutamiento |
| **Axios** | - | Cliente HTTP |
| **SweetAlert2** | 11.26.18 | Alertas elegantes |
| **SCSS** | - | Preprocesador CSS |

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── assets/              # Recursos estáticos
│   ├── components/          # Componentes reutilizables
│   │   ├── DocumentTable.vue
│   │   └── FileUpload.vue
│   ├── config/              # Configuraciones
│   │   └── env.ts
│   ├── router/              # Rutas de la aplicación
│   │   └── index.ts
│   ├── services/            # Servicios HTTP
│   │   ├── api/
│   │   │   └── axios.ts    # Configuración de Axios
│   │   ├── auth.service.ts
│   │   └── upload.service.ts
│   ├── stores/              # Stores de Pinia
│   │   └── auth.store.ts
│   ├── types/               # Definiciones TypeScript
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   └── document.types.ts
│   ├── utils/               # Utilidades
│   │   ├── alerts.ts        # SweetAlert2 wrapper
│   │   ├── errorHandler.ts  # Manejo centralizado de errores
│   │   ├── formatters.ts    # Formateo de datos
│   │   ├── storage.ts       # LocalStorage wrapper
│   │   └── validators.ts    # Validadores de formularios
│   ├── views/               # Vistas principales
│   │   ├── LoginView.vue
│   │   ├── LoginView.styles.scss
│   │   ├── RegisterView.vue
│   │   ├── RegisterView.styles.scss
│   │   ├── DashboardView.vue
│   │   └── DashboardView.styles.scss
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** >= 18.x
- **npm** >= 9.x o **yarn** >= 1.22.x
- **Backend** corriendo en `http://localhost:3000`

---

## 🚀 Instalación

### 1️⃣ **Clonar el repositorio**

```bash
git clone <repository-url>
cd Prueba_Tecnica/frontend
```

### 2️⃣ **Instalar dependencias**

```bash
npm install
```

### 3️⃣ **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del frontend (opcional, usa valores por defecto):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4️⃣ **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Previsualiza el build de producción |

---

## 🏗 Arquitectura y Buenas Prácticas

### **Principios SOLID Implementados**

#### ✅ **SRP - Responsabilidad Única**
- **Separación de concerns**: Estilos en archivos `.scss` separados
- **Componentes enfocados**: Cada componente tiene una única responsabilidad
- **Utilidades específicas**: `formatters.ts`, `validators.ts`, `errorHandler.ts`

#### ✅ **DRY - Don't Repeat Yourself**
- **Manejo de errores centralizado** en `errorHandler.ts`
- **Validadores reutilizables** en `validators.ts`
- **Formateo de fechas centralizado** en `formatters.ts`

#### ✅ **Separation of Concerns**
```
LoginView.vue (255 líneas)    → Lógica + Template
LoginView.styles.scss (240 líneas) → Estilos
```

**Antes:** 496 líneas mezcladas  
**Después:** Separación clara (reducción del 48% en archivos Vue)

### **Arquitectura de Carpetas**

```
📂 components/     → Componentes reutilizables
📂 views/          → Vistas/páginas principales
📂 services/       → Lógica de negocio y APIs
📂 stores/         → Estado global (Pinia)
📂 utils/          → Funciones auxiliares
📂 types/          → Definiciones TypeScript
```

### **Patrón de Servicios**

```typescript
// services/auth.service.ts
export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
}
```

### **Validación en Tiempo Real**

```vue
<input
  v-model="form.email"
  @blur="validateField('email')"
/>
<span v-if="errors.email">{{ errors.email }}</span>
```

---

## 🌍 Variables de Entorno

| Variable | Por Defecto | Descripción |
|----------|-------------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | URL base del backend |

**Archivo:** `src/config/env.ts`

```typescript
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
};
```

---

## 🖥 Vistas de la Aplicación

### **1. Login** (`/login`)
- Formulario de inicio de sesión
- Validación de email y contraseña
- Redirección automática a dashboard si está autenticado
- Link a registro

### **2. Registro** (`/register`)
- Formulario con validación completa
- Selección de rol (user/admin)
- Confirmación de contraseña con feedback visual
- Validación en tiempo real

### **3. Dashboard** (`/dashboard`)
- **Solo usuarios autenticados**
- Área de carga de CSV (Drag & Drop)
- Tabla con paginación del servidor
- Acciones de descarga
- Eliminación (solo admin)
- Botón de logout

---

## 🔒 Autenticación y Guards

### **Navigation Guards**

```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Rutas protegidas
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
    return;
  }
  
  // Rutas de invitados
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' });
    return;
  }
  
  next();
});
```

### **Almacenamiento de Sesión**

- JWT almacenado en `localStorage`
- Restauración automática al recargar
- Limpieza en logout

---

## 🎨 Estilos y Diseño

### **Responsive Design**

- ✅ Mobile First
- ✅ Breakpoints: 375px, 480px, 768px, 1024px
- ✅ Adaptación automática de componentes

### **Temas de Color**

```scss
// Paleta principal
$primary: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
$success: #22c55e;
$error: #dc2626;
$warning: #fbbf24;
```

---

## 📝 Convenciones de Código

### **TypeScript**

- ✅ Tipado estricto
- ✅ Interfaces para todas las respuestas de API
- ✅ Types para props de componentes

### **Vue 3**

- ✅ **Options API** (requerimiento del proyecto)
- ✅ Componentes Single File Component (SFC)
- ✅ Props tipadas con TypeScript
- ✅ Emits declarados

### **Estilos**

- ✅ SCSS con separación de archivos
- ✅ BEM para nomenclatura (opcional)
- ✅ Scoped styles en componentes

---

## 🐛 Manejo de Errores

### **Centralizado con `errorHandler.ts`**

```typescript
import { handleApiError } from '@/utils/errorHandler';

try {
  await authStore.login(credentials);
} catch (error) {
  handleApiError(error, 'Error al iniciar sesión');
}
```

### **Feedback Visual**

- ✅ Alertas con SweetAlert2
- ✅ Indicadores de carga
- ✅ Mensajes de error en formularios

---

## 📊 Mejoras Implementadas (FASE 1)

### **Refactorización**

| Vista | Antes | Después | Reducción |
|-------|-------|---------|-----------|
| LoginView | 496 líneas | 255 líneas | **-48%** |
| RegisterView | 683 líneas | 288 líneas | **-58%** |
| DashboardView | 640 líneas | 264 líneas | **-59%** |

### **Nuevas Utilidades**

- ✅ `formatters.ts` - Formateo de fechas, números, tamaños
- ✅ `errorHandler.ts` - Manejo centralizado de errores de API
- ✅ Validación en tiempo real con `@blur`

---

## 🤝 Contribuciones

Este proyecto es parte de una prueba técnica y sigue las mejores prácticas de:

- ✅ Clean Code
- ✅ Principios SOLID
- ✅ Arquitectura escalable
- ✅ TypeScript estricto
- ✅ Separación de responsabilidades

---

## 📄 Licencia

Este proyecto es de uso privado para evaluación técnica.

---

## 👨‍💻 Autor

Desarrollado como parte de una prueba técnica - 2026

---

## 🔗 Enlaces Útiles

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
