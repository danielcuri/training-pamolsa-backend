import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();

  const email = 'admin@test.com';
  const plainPassword = 'Admin1234!';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`El usuario "${email}" ya existe. No se creó uno nuevo.`);
    await prisma.$disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: 'Admin Test',
      email,
      password: hashedPassword,
      role: 'SUPERADMIN',
      status: 'ACTIVE',
    },
  });

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});
