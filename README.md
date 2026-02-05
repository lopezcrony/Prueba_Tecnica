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

- **Docker Desktop** instalado y ejecutándose
- **Node.js** 18+ (para desarrollo local del frontend)
- **npm** o **yarn**

## 🚀 Inicio Rápido (Recomendado)

### Paso 1: Levantar Backend + PostgreSQL con Docker

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto iniciará automáticamente:
- ✅ PostgreSQL en puerto `5432`
- ✅ Backend API en puerto `3000` con hot-reload
- ✅ Migraciones y seeds ejecutados automáticamente

### Paso 2: Verificar que todo esté corriendo

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f backend
```

**El backend estará disponible en:**
- API: <http://localhost:3000>
- Swagger Docs: <http://localhost:3000/api/v1/docs>

**Usuario admin creado automáticamente:**
- Email: `admin@example.com`
- Password: `admin123`

### Paso 3: Levantar Frontend (local)

```bash
# En otra terminal
cd frontend
npm install
npm run dev
```

El frontend estará en <http://localhost:5174>

### Detener servicios

```bash
# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra la base de datos)
docker-compose down -v
```

## 📝 Configuración (Opcional)

Si deseas personalizar las credenciales o puertos, crea un archivo `.env` en la raíz:

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

Variables disponibles:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `PORT` (puerto del backend)

## Migraciones y Seeds

El proyecto usa migraciones de TypeORM para gestionar el esquema de la base de datos de forma versionada.

**Migrador automático**: El servicio `migrator` en Docker Compose ejecuta automáticamente:
1. Las migraciones pendientes (`npm run migration:run`)
2. Los seeds (`npm run seed` - crea usuario admin)

**Scripts disponibles** (en `backend/`):

```bash
npm run migration:generate -- <Name>  # Generar migración
npm run migration:run                 # Ejecutar migraciones
npm run migration:revert              # Revertir última migración
npm run seed                          # Ejecutar seeds manualmente
```

## 🐳 Comandos Docker Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f backend
docker-compose logs -f postgres

# Reiniciar un servicio
docker-compose restart backend

# Reconstruir imágenes
docker-compose up -d --build

# Ejecutar migraciones manualmente
docker-compose up migrator

# Acceder al contenedor del backend
docker exec -it proyecto-backend sh

# Acceder a PostgreSQL
docker exec -it proyecto-postgres psql -U admin -d proyecto_db

# Ver estado de contenedores
docker-compose ps
```

## 🔧 Solución de Problemas

### Backend no inicia

```bash
# Ver logs detallados
docker-compose logs backend

# Reconstruir sin caché
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Base de datos no responde

```bash
# Verificar estado
docker-compose ps

# Reiniciar PostgreSQL
docker-compose restart postgres
```

### Puerto 3000 o 5432 ya en uso

```bash
# Detener otros servicios o modificar puertos en docker-compose.yml
# Cambiar "3000:3000" a "3001:3000" por ejemplo
```

### WSL needs updating (Windows)

```bash
# En PowerShell como administrador
wsl --update
```

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
