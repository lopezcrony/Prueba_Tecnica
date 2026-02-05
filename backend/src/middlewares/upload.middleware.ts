import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos - solo CSV
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos CSV'));
  }
};

// Límite de tamaño de archivo: 5MB
const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

// Middleware de upload configurado
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits
}).single('file');
