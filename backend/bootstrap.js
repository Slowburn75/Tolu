const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function bootstrap() {
  const prisma = new PrismaClient();
  try {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) {
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@tolumak.com',
          password: await bcrypt.hash('Admin123!', 12),
          role: 'ADMIN',
          isEmailVerified: true,
        },
      });
      console.log('Seeding: Admin user created');
    } else {
      console.log('Seeding: Admin user already exists');
    }
  } catch (e) {
    console.error('Seeding error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
