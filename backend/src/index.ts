import 'reflect-metadata';
import App from './app';
import AppDataSource from './config/database';
import { ENV } from './config/env';

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    App.listen(ENV.PORT, ENV.HOST, () => {
      console.log(`🚀 Server running on http://${ENV.HOST}:${ENV.PORT}`);
      console.log(`📚 API Docs available at http://localhost:${ENV.PORT}${ENV.API_PREFIX}/docs`);
      console.log(`📝 Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
