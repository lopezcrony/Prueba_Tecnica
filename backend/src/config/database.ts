import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ENV } from './env';
import { User } from '../database/entities/User';
import { Document } from '../database/entities/Document';
import { Upload } from '../database/entities/Upload';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  synchronize: false, // Siempre usar migraciones
  logging: ENV.DB_LOGGING,
  ssl: ENV.DB_SSL,
  entities: [User, Document, Upload],
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: false,
  maxQueryExecutionTime: 1000,
  extra: {
    max: ENV.DB_MAX_CONNECTIONS,
  },
});

export default AppDataSource;
