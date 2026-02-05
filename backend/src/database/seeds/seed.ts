import 'reflect-metadata';
import AppDataSource from '../../config/database';
import { UserRepository } from '../../repositories/UserRepository';
import { AuthService } from '../../services/AuthService';
import { ENV } from '../../config/env';

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = new UserRepository();
    const authService = new AuthService();

    const adminEmail = ENV.SEED_ADMIN_EMAIL;
    const adminPassword = ENV.SEED_ADMIN_PASSWORD;

    const exists = await userRepository.findByEmail(adminEmail);
    if (exists) {
      console.log('ℹ️  Admin user already exists:', adminEmail);
      await AppDataSource.destroy();
      return;
    }

  const hashedPassword = await authService.hashPassword(adminPassword);
  await userRepository.create({
    name: 'Admin User',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
  });    console.log('✅ Seeded admin user:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

run();
