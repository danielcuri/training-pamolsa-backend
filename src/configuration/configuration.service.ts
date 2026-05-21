import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class ConfigurationService {
  constructor(private readonly prisma: PrismaService) {}
  async seedUser() {
    if (process.env.ALLOW_CONFIGURATION !== 'true') {
      return {
        message: 'Bootstrap deshabilitado',
      };
    }

    const email = 'admin@test.com';
    const plainPassword = 'micronics';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await this.prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name: 'Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
        status: 'ACTIVE',
      },
      create: {
        name: 'Admin',
        email,
        password: hashedPassword,
        role: 'SUPERADMIN',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        dni: true,
        role: true,
        status: true,
        projectId: true,
        areaId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Administrador creado/actualizado correctamente',
      user,
    };
  }
}