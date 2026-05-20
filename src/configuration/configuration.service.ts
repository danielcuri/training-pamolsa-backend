import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class ConfigurationService {
  constructor(private readonly prisma: PrismaService) {}
  async seedUser() {
    if (process.env.ALLOW_BOOTSTRAP !== 'true') {
      return {
        message: 'Bootstrap deshabilitado',
      };
    }
    const adminExists = await this.prisma.user.findFirst({
      where: { role: 'SUPERADMIN' },
    });

    if (adminExists) {
      return {
        message: 'Ya existe un administrador. Bootstrap bloqueado.',
      };
    }

    const hashedPassword = await bcrypt.hash('Admin1234!', 10);

    const user = await this.prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'SUPERADMIN',
        status: 'ACTIVE',
      },
    });

    return {
      message: 'Administrador creado correctamente',
      user,
    };
  }
}
