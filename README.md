# Proyecto Fullstack - Vue 3 + Node.js + PostgreSQL

Proyecto fullstack empresarial con arquitectura separada de backend y frontend, utilizando Docker para orquestación de servicios.

## Stack Tecnológico

### Backend
- **Runtime**: Node.js con Express
- **Lenguaje**: TypeScript
- **ORM**: TypeORM
- **Base de Datos**: PostgreSQL 15
- **Arquitectura**: Clean Architecture en capas (Controller → Service → Repository)
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: JWT, Helmet, CORS, Rate Limiting, Bcrypt

### Frontend
- **Framework**: Vue 3 (Options API)
- **Build Tool**: Vite

### Infraestructura
- **Contenedorización**: Docker & Docker Compose
- **Servicios**: PostgreSQL, Backend API, Frontend (opcional)

## Estructura del Proyecto

```
proyecto-fullstack/
├── backend/              # API REST - Node.js + Express + TypeORM
│   ├── src/
│   │   ├── config/       # Configuraciones (DB, ENV, Swagger)
│   │   ├── controllers/  # Controladores HTTP
│   │   ├── services/     # Lógica de negocio
│   │   ├── repositories/ # Acceso a datos
│   │   ├── entities/     # Modelos TypeORM
│   │   ├── middlewares/  # Auth, validación, errores
│   │   ├── routes/       # Definición de rutas
│   │   ├── migrations/   # Migraciones de BD
│   │   └── seeds/        # Datos iniciales
│   └── README.md
├── frontend/             # Aplicación Vue 3
├── docker-compose.yml
├── .env.example
└── README.md
```

## Requisitos Previos

- Docker Desktop instalado
- Docker Compose v3.8+
- Node.js 18+ (solo para desarrollo local sin Docker)

## Instalación y Ejecución

### 1. Clonar y configurar variables de entorno

```powershell
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

### 2. Inicializar backend (primera vez)

```powershell
cd backend
npm install
```

**Nota**: El `package.json` ya está configurado con todas las dependencias necesarias incluyendo Swagger, TypeORM, JWT, etc.

### 3. Desarrollo local (sin Docker)

```powershell
cd backend
npm run dev
```

### 4. Ejecutar con Docker Compose (recomendado para entrega)

El `docker-compose.yml` levanta PostgreSQL, backend y un servicio opcional `frontend`. Además incluye un servicio `migrator` que ejecuta migraciones y el seed (si existen) antes de que comiences a usar el backend.

```powershell
# desde la raíz del repo
docker-compose up -d --build
docker-compose logs -f

# Para detener y limpiar volúmenes
docker-compose down -v
```

## Migraciones y Seeds

- En este proyecto se fuerza el uso de migraciones: `DB_SYNCHRONIZE` no está presente en `.env.example`. Esto asegura que el esquema se gestione exclusivamente mediante migraciones versionadas.
- Recomendación para entrega: genera y versiona migraciones con TypeORM y aplica las migraciones con `npm run migration:run` antes de arrancar el servicio de producción.
- Scripts útiles en `backend/package.json`:

  - `npm run migration:generate -- <Name>` -> generar una migración
  - `npm run migration:run` -> ejecutar migraciones pendientes
  - `npm run migration:revert` -> revertir la última migración
  - `npm run seed` -> ejecutar script de seed (crea admin si no existe)

## Arquitectura del Backend

### Capas implementadas

```
┌─────────────────────────────────────────┐
│          HTTP Request (Cliente)          │
└────────────────┬────────────────────────┘
                 │
         ┌───────▼────────┐
         │   Middlewares  │ (Auth, CORS, Rate Limit)
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │   Controllers  │ (Manejo de Request/Response)
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │    Services    │ (Lógica de negocio)
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │  Repositories  │ (Acceso a datos)
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │   TypeORM      │
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │   PostgreSQL   │
         └────────────────┘
```

### Características implementadas

- ✅ **Separación de responsabilidades**: Controller → Service → Repository
- ✅ **Configuración centralizada**: `config/env.ts`, `config/database.ts`
- ✅ **Documentación automática**: Swagger UI en `/api/v1/docs`
- ✅ **Autenticación JWT**: Middleware reutilizable
- ✅ **Manejo de errores**: Middleware centralizado
- ✅ **Migraciones**: Control de versiones del esquema de BD
- ✅ **Seeds**: Datos iniciales automatizados

## Documentación API

Una vez levantado el backend, la documentación interactiva de Swagger estará disponible en:

**http://localhost:3000/api/v1/docs**

Allí podrás:
- Ver todos los endpoints disponibles
- Probar las APIs directamente desde el navegador
- Ver schemas de request/response
- Autenticarte con JWT

- Recomendación preferida: servicio `migrator` separado en `docker-compose`.
  - Ventaja: independencia del runtime del backend, mayor control y visibilidad de fallos de migración.
  - Cómo funciona: `migrator` hace `npm ci && npm run migration:run && npm run seed` y sale.

- Alternativa: ejecutar migraciones en el entrypoint del backend antes de arrancar el servidor.
  - Ventaja: menos servicios en compose.
  - Inconveniente: si una migración falla, el backend puede entrar en crash-loop y complicar debugging en entornos automatizados.

Por seguridad y estabilidad, para una prueba técnica y entornos CI/CD recomiendo usar el servicio `migrator`.

## Notas rápidas sobre archivos TypeScript y `tsconfig`

- `tsconfig.json` define cómo transpilar TypeScript a JavaScript (target, módulos, decoración para TypeORM, etc.).
- `tsconfig.build.json` extiende la configuración para la compilación de producción (por ejemplo, excluir tests).

## Criterios de evaluación que cubrimos (resumen)

- Option API en Vue 3: la carpeta `frontend/` está preparada para usar Vite y Vue 3 Options API.
- Seguridad: JWT gestionado en backend (usa `JWT_SECRET` en `.env`) y middlewares básicos (helmet, rate-limit, cors).
- Validación de CSV: implementarás el parsing/validación en backend — deja el endpoint preparado, luego podemos añadir middleware de validación y tests.
- Dockerización: `docker-compose.yml` facilita levantar toda la stack.
- Limpieza de código: la estructura inicial del backend usa TypeORM con `src/`, `entities/`, `migrations/`, `seeds/`.

## ¿Qué hago a continuación?

Si quieres que genere la migración inicial `users` y la añada al repo, puedo hacerlo ahora (generaría el archivo bajo `backend/src/migrations/`). Alternativamente, si prefieres generar migraciones localmente tú mismo, te doy los comandos y reviso los archivos que crees.

Si prefieres que cambie `DB_SYNCHRONIZE` a `false` por defecto (más seguro para entrega), dime y lo actualizo.
