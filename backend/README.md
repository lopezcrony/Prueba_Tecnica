# Backend - Proyecto Fullstack

Sistema de gestión de contactos con importación masiva desde archivos CSV.

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **Docker Desktop** (para ejecutar con contenedores)
- **npm** o **yarn**

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 18 (Alpine Linux en Docker)
- **Framework**: Express.js 4.x
- **Lenguaje**: TypeScript 5.x
- **ORM**: TypeORM 0.3.x
- **Base de datos**: PostgreSQL 15
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: Helmet, CORS, bcrypt
- **Desarrollo**: ts-node-dev (hot-reload)

## 🎯 Características Principales

- ✅ **Autenticación JWT** con roles (user/admin)
- ✅ **Importación CSV** con validación en streaming
- ✅ **Gestión de contactos** (correo, nombre, teléfono, ciudad, notas)
- ✅ **Control de uploads** (historial de archivos subidos)
- ✅ **RBAC** (Role-Based Access Control)
- ✅ **Clean Architecture** (separación de capas)
- ✅ **Exception-based error handling**
- ✅ **TypeORM Migrations** (control de versiones de BD)
- ✅ **Containerización** con Docker y Docker Compose

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado) 🐳

```bash
# 1. Desde la raíz del proyecto (Prueba_Tecnica/)
cd ..

# 2. Levantar backend + PostgreSQL con Docker Compose
docker-compose up -d

# 3. Ejecutar migraciones y seeds (se ejecutan automáticamente)
docker-compose up migrator

# 4. Verificar que todo esté corriendo
docker-compose ps
```

**El backend estará disponible en:**
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/v1/docs
- PostgreSQL: localhost:5432

**Usuario administrador creado automáticamente:**
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

### Opción 2: Desarrollo Local (Sin Docker)

```bash
# 1. Levantar solo PostgreSQL con Docker
docker-compose up -d postgres

# 2. Instalar dependencias
npm install

# 3. Ejecutar migraciones
npm run migration:run

# 4. Crear usuario admin
npm run seed

# 5. Iniciar servidor en modo desarrollo
npm run dev
```

## 📁 Estructura de Carpetas

```
backend/
├── src/
│   ├── config/              # Configuraciones centralizadas
│   │   ├── database.ts      # Configuración TypeORM DataSource
│   │   ├── env.ts           # Variables de entorno tipadas
│   │   └── swagger.ts       # Configuración Swagger/OpenAPI
│   │
│   ├── database/            # Todo relacionado con la base de datos
│   │   ├── entities/        # Entidades de TypeORM (User, Document, Upload)
│   │   ├── migrations/      # Migraciones de base de datos
│   │   └── seeds/           # Scripts de datos iniciales
│   │
│   ├── interfaces/          # Contratos y tipos TypeScript
│   │   ├── models/          # Tipos de datos (user.types, document.types, upload.types)
│   │   ├── repositories/    # Contratos de repositorios (IUserRepository, IDocumentRepository, IUploadRepository)
│   │   ├── services/        # Contratos de servicios (IAuthService, IDocumentService, IUploadService, ICSVService)
│   │   └── index.ts         # Exportación centralizada
│   │
│   ├── repositories/        # Capa de acceso a datos
│   │   ├── UserRepository.ts
│   │   ├── DocumentRepository.ts
│   │   └── UploadRepository.ts
│   │
│   ├── services/            # Lógica de negocio
│   │   ├── AuthService.ts
│   │   ├── CSVService.ts
│   │   ├── DocumentService.ts
│   │   └── UploadService.ts
│   │
│   ├── controllers/         # Controladores (Request/Response)
│   │   ├── AuthController.ts
│   │   ├── DocumentController.ts
│   │   └── UploadController.ts
│   │
│   ├── middlewares/         # Middlewares personalizados
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── upload.middleware.ts
│   │
│   ├── routes/              # Definición de rutas
│   │   ├── auth.routes.ts
│   │   ├── document.routes.ts
│   │   └── upload.routes.ts
│   │
│   ├── dtos/                # Data Transfer Objects con validaciones
│   │   └── index.ts         # RegisterDTO, LoginDTO, DocumentRecordDTO
│   │
│   ├── utils/               # Utilidades y helpers
│   │   ├── errorCodes.ts    # Códigos de error centralizados
│   │   └── exceptions.ts    # Clases de excepciones personalizadas
│   │
│   ├── app.ts               # Configuración de Express
│   └── index.ts             # Punto de entrada
│
├── uploads/                 # Archivos CSV subidos (git ignored)
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── Dockerfile
```

## 🏗️ Arquitectura

### Capas del Backend

1. **Config**: Configuraciones centralizadas (DB, ENV, Swagger)
2. **Entities**: Modelos de datos (TypeORM)
3. **Repositories**: Abstracción de acceso a datos
4. **Services**: Lógica de negocio
5. **Controllers**: Manejo de HTTP requests/responses
6. **Middlewares**: Autenticación, validación, manejo de errores
7. **Routes**: Definición de endpoints

### Flujo de una Request

```
Request → Route → Middleware → Controller → Service → Repository → Database
                                     ↓
Response ← Controller ← Service ← Repository ← Database
```

## 🚀 Comandos Disponibles

```bash
# Desarrollo (⭐ USAR ESTE LA MAYORÍA DEL TIEMPO)
npm run dev                 # Inicia servidor con hot-reload (TypeScript directo)

# Build y Producción (SOLO para despliegue en servidor)
npm run build              # Compila TypeScript → JavaScript
npm run start:prod         # Ejecuta código compilado (SOLO en producción)

# Migraciones
npm run migration:generate -- NombreMigracion  # Genera migración
npm run migration:run      # Ejecuta migraciones pendientes
npm run migration:revert   # Revierte última migración

# Seeds
npm run seed              # Ejecuta seed (crea admin)
```

**💡 Nota:** Para desarrollo local, usa siempre `npm run dev`. El comando `start:prod` está pensado para servidores de producción (AWS, Azure, etc.).

## 📚 Documentación API (Swagger)

Una vez levantado el servidor:
- **Swagger UI**: http://localhost:3000/api/v1/docs

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens):

1. Login en `/api/v1/auth/login`
2. Recibe token JWT
3. Incluye token en header: `Authorization: Bearer {token}`

## 🗄️ Migraciones

Las migraciones gestionan el esquema de la base de datos de forma controlada:

```bash
# 1. Modificar entidad (ejemplo: User.ts)
# 2. Generar migración automática
npm run migration:generate -- AddNewField

# 3. Revisar archivo generado en src/migrations/
# 4. Ejecutar migración
npm run migration:run
```

## 🌱 Seeds

Crea usuario admin inicial:

```bash
npm run seed
```

Credenciales por defecto (ver `.env`):
- Email: admin@example.com
- Password: admin123

## 📝 Variables de Entorno

Ver `.env.example` en la raíz del proyecto.

## 🔒 Seguridad Implementada

- ✅ Helmet (headers de seguridad)
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Bcrypt password hashing
- ✅ Validación de inputs
- ✅ Error handling centralizado

## 🐳 Comandos Docker Útiles

```bash
# Ver logs del backend en tiempo real
docker-compose logs -f backend

# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Verificar estado de contenedores
docker-compose ps

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v

# Reiniciar solo el backend
docker-compose restart backend

# Reconstruir backend sin caché
docker-compose build --no-cache backend

# Ejecutar comando dentro del contenedor del backend
docker exec -it proyecto-backend sh

# Ver base de datos con psql
docker exec -it proyecto-postgres psql -U admin -d proyecto_db
```

### Solución de Problemas Docker

**Problema: El backend no inicia**
```bash
# Ver logs detallados
docker-compose logs backend

# Reconstruir imagen
docker-compose up -d --build backend
```

**Problema: La base de datos no responde**
```bash
# Verificar salud del contenedor
docker-compose ps

# Reiniciar PostgreSQL
docker-compose restart postgres
```

**Problema: Cambios en el código no se reflejan**
```bash
# El backend usa volúmenes montados, los cambios deberían ser automáticos
# Si no funciona, reinicia:
docker-compose restart backend
```

## 🧪 Próximos Pasos

- [ ] Añadir tests unitarios
- [ ] Implementar logging estructurado
- [ ] Implementar frontend Vue 3

## 📋 Endpoints Disponibles

### Autenticación

#### POST /api/v1/auth/register
Registra un nuevo usuario.

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "createdAt": "2026-02-04T..."
    }
  }
}
```
**Nota:** El registro NO devuelve token. Debes hacer login después.

#### POST /api/v1/auth/login
Inicia sesión y obtiene un token JWT.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user"
    }
  }
}
```
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user"
    }
  },
  "message": "Usuario registrado exitosamente"
}
```

#### POST /api/v1/auth/login
Inicia sesión y devuelve un token JWT.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user"
    }
  }
}
```

### Documentos (requieren autenticación)

#### POST /api/v1/documents/upload
Sube y procesa un archivo CSV con documentos.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
- `file`: Archivo CSV con los campos: correo, nombre, telefono, ciudad, notas (opcional)

**Formato CSV esperado:**
```csv
correo,nombre,telefono,ciudad,notas
juan@example.com,Juan Pérez,1234567890,Bogotá,Cliente premium
maria@example.com,María García,9876543210,Medellín,
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "5 registro(s) importado(s) exitosamente",
    "uploadId": 1
  }
}
```

**Response (400) - Errores de validación:**
```json
{
  "success": false,
  "error": {
    "code": "CSV_VALIDATION_ERROR",
    "message": "El archivo CSV contiene errores de validación",
    "details": {
      "errors": [
        {
          "row": 2,
          "errors": [
            "correo must be an email",
            "telefono must match /^[0-9]+$/ regular expression"
          ]
        }
      ]
    }
  }
}
```

#### GET /api/v1/documents
Lista todos los documentos con paginación.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "correo": "juan@example.com",
        "nombre": "Juan Pérez",
        "telefono": "1234567890",
        "ciudad": "Bogotá",
        "notas": "Cliente premium",
        "uploadId": 1,
        "createdAt": "2026-02-04T10:30:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Uploads (requieren autenticación)

#### GET /api/v1/uploads
Obtiene los uploads del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "originalFileName": "contactos.csv",
      "totalRecords": 5,
      "uploadedAt": "2026-02-04T10:30:00.000Z",
      "uploadedBy": {
        "id": 2,
        "name": "Juan Pérez",
        "email": "juan@example.com"
      }
    }
  ]
}
```

#### GET /api/v1/uploads/all
Obtiene TODOS los uploads de todos los usuarios (solo admin).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):** Mismo formato que `/uploads`

#### GET /api/v1/uploads/:id/download
Descarga el archivo CSV original.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** Descarga del archivo CSV

#### DELETE /api/v1/uploads/:id
Elimina un upload y todos sus documentos asociados (solo admin).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Upload eliminado correctamente"
  }
}
```

**Response (403) - Usuario sin permisos:**
```json
{
  "message": "No autorizado"
}
```

---

## 📁 Carpeta Database

Contiene todos los componentes relacionados con la base de datos, organizados en subcarpetas.

### 📦 Entities (`database/entities/`)

Define las entidades (modelos) de la base de datos usando decoradores de TypeORM.

**Entidades disponibles:**
- `User.ts` - Usuarios del sistema (autenticación y autorización)
- `Upload.ts` - Registro de archivos CSV subidos
- `Document.ts` - Documentos/contactos importados desde CSV

**Relaciones:**
- User (1) → (N) Upload - Un usuario puede subir muchos archivos
- Upload (1) → (N) Document - Un archivo contiene muchos documentos
- Eliminación en cascada: Si se elimina un Upload, se eliminan todos sus Documents

**Características:**
- IDs auto-incrementales (SERIAL en PostgreSQL)
- Decoradores TypeORM (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`)
- Relaciones entre entidades (`@OneToMany`, `@ManyToOne`)
- Validaciones a nivel de base de datos
- Timestamps automáticos (`createdAt`, `uploadedAt`)

### 🔄 Migrations (`database/migrations/`)

Gestiona cambios en el esquema de base de datos de forma controlada y versionada.

**Flujo de trabajo:**

1. **Modificar entidad** (ejemplo: agregar campo a `User.ts`)
2. **Generar migración automática:**
   ```bash
   npm run migration:generate -- AddNewFieldToUser
   ```
3. **Revisar archivo generado** en `src/database/migrations/`
4. **Ejecutar migración:**
   ```bash
   npm run migration:run
   ```
5. **Si hay error, revertir:**
   ```bash
   npm run migration:revert
   ```

**Comandos disponibles:**
- `npm run migration:generate -- NombreMigración` - Genera migración automática
- `npm run migration:run` - Ejecuta migraciones pendientes
- `npm run migration:revert` - Revierte última migración

**⚠️ Importante:**
- NUNCA modificar migraciones ya aplicadas en producción
- Usar `synchronize: false` en producción (configurado en `database.ts`)
- Revisar migraciones generadas antes de ejecutarlas

### 🌱 Seeds (`database/seeds/`)

Scripts para poblar la base de datos con datos iniciales o de prueba.

**Ejecutar seed:**
```bash
npm run seed
```

**¿Qué hace el seed actual?**
- Crea un usuario administrador por defecto
- Credenciales (configurables en `.env`):
  - Email: `admin@example.com`
  - Password: `admin123`
  - Role: `admin`

**Cuándo usar seeds:**
- Desarrollo local (datos de prueba)
- Entornos de staging/testing
- Datos maestros iniciales (roles, categorías, etc.)

---

## 🔷 Carpeta Interfaces

Contiene todas las interfaces y tipos TypeScript del proyecto, organizadas por responsabilidad.

### Principios de Diseño

1. **Dependency Inversion (SOLID)**
   - Clases dependen de abstracciones (interfaces), no de implementaciones
   - Facilita testing con mocks
   - Permite cambiar implementaciones sin romper código

2. **Separación de Responsabilidades**
   - Cada interfaz tiene una única responsabilidad
   - Organizadas por dominio (models, repositories, services)

3. **Exportación Centralizada**
   - Todo se exporta desde `interfaces/index.ts`
   - Importación limpia: `import { IUserRepository } from '../interfaces'`

### Estructura de Interfaces

#### Models (`interfaces/models/`)

Definen la forma de los datos que fluyen por la aplicación.

**Tipos disponibles:**
- `user.types.ts` - Tipos relacionados con usuarios
  - `CreateUserData` - Datos para crear usuario
  - `UpdateUserData` - Datos para actualizar usuario
  - `UserResponse` - Respuesta con datos de usuario
  
- `document.types.ts` - Tipos relacionados con documentos
  - `CreateDocumentData` - Datos para crear documento
  - `DocumentResponse` - Respuesta con datos de documento
  
- `common.types.ts` - Tipos comunes reutilizables
  - `PaginatedResponse<T>` - Respuesta paginada genérica
  - `ServiceResponse<T>` - Respuesta estándar de servicios

#### Repositories (`interfaces/repositories/`)

Contratos para la capa de acceso a datos.

**Características:**
- Definen métodos CRUD estándar
- No contienen lógica de negocio
- Trabajan directamente con entidades

**Ejemplo (`IUserRepository`):**
```typescript
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}
```

#### Services (`interfaces/services/`)

Contratos para la capa de lógica de negocio.

**Características:**
- Orquestan operaciones complejas
- Aplican reglas de negocio
- Usan repositorios y otros servicios
- Pueden lanzar excepciones de negocio

**Ejemplo (`IAuthService`):**
```typescript
export interface IAuthService {
  register(data: RegisterData): Promise<AuthResponse>;
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  verifyToken(token: string): DecodedToken | null;
}
```

### Beneficios del Enfoque

✅ **Testabilidad** - Fácil crear mocks e inyectar dependencias  
✅ **Mantenibilidad** - Cambios en interfaces se detectan en compile-time  
✅ **Escalabilidad** - Agregar implementaciones sin romper código existente  
✅ **Documentación** - Interfaces sirven como contrato vivo  
✅ **TypeScript** - Aprovecha sistema de tipos al máximo

### Convenciones de Nomenclatura

- **Interfaces de contratos:** Prefijo `I` (ejemplo: `IAuthService`, `IUserRepository`)
- **Interfaces de request:** Prefijo `I` (ejemplo: `IAuthRequest`)
- **Tipos de datos:** Sin prefijo (ejemplo: `CreateUserData`, `UserResponse`)
- **DTOs:** Sufijo `DTO` (ejemplo: `RegisterDTO`, `LoginDTO`)

---

## 🛡️ Manejo de Errores

El proyecto usa un sistema de excepciones personalizadas centralizado.

### Excepciones Disponibles (`utils/exceptions.ts`)

Todas heredan de `AppError`:

- `ValidationError` (400) - Errores de validación de datos
- `UnauthorizedError` (401) - Usuario no autenticado
- `InvalidCredentialsError` (401) - Credenciales incorrectas
- `ForbiddenError` (403) - Sin permisos suficientes
- `NotFoundError` (404) - Recurso no encontrado
- `ConflictError` (409) - Conflicto (ej: email duplicado)
- `CSVValidationError` (400) - Errores en validación de CSV
- `FileNotProvidedError` (400) - Archivo no enviado
- `EmptyFileError` (400) - Archivo CSV vacío
- `MissingHeadersError` (400) - Headers faltantes en CSV

### Flujo de Errores

```
Service → throw new ValidationError('Mensaje')
    ↓
Controller → catch (error) { next(error) }
    ↓
Error Middleware → Detecta tipo de AppError
    ↓
Response → JSON con código y mensaje apropiado
```

### Códigos de Error (`utils/errorCodes.ts`)

Códigos estandarizados para respuestas consistentes:

```typescript
ErrorCodes = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // CSV
  CSV_VALIDATION_ERROR: 'CSV_VALIDATION_ERROR',
  CSV_EMPTY: 'CSV_EMPTY',
  CSV_MISSING_HEADERS: 'CSV_MISSING_HEADERS',
  
  // Files
  FILE_NOT_PROVIDED: 'FILE_NOT_PROVIDED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // General
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
}
```

---

## 🧪 Próximos Pasos

- [ ] Implementar tests unitarios (Jest)
- [ ] Implementar tests de integración
- [ ] Añadir logging estructurado (Winston)
- [ ] Implementar frontend Vue 3
- [ ] Configurar CI/CD
- [ ] Añadir documentación de API más detallada
