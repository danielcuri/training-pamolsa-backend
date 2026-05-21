import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();

  const email = 'admin@test.com';
  const plainPassword = 'micronics';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name: 'Admin Test',
      password: hashedPassword,
      role: 'SUPERADMIN',
      status: 'ACTIVE',
    },
    create: {
      name: 'Admin Test',
      email,
      password: hashedPassword,
      role: 'SUPERADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(`Usuario admin creado/actualizado correctamente: ${user.email}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});