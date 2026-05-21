import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async login(dto: LoginDto) {
    if (!dto.dni && !dto.email) {
      throw new BadRequestException('Debe enviar DNI o email para iniciar sesión');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        ...(dto.dni && { dni: dto.dni }),
        ...(dto.email && { email: dto.email }),
      },
    });

    if (!user || user.status === 'INACTIVE') {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      dni: user.dni,
      educationLevel: user.educationLevel,
      hireDate: user.hireDate,
      role: user.role,
      status: user.status,
      projectId: user.projectId,
      areaId: user.areaId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };

    return {
      user: userWithoutPassword,
      token: this.generateToken(user),
    };
  }

  private generateToken(user: {
    id: string;
    email: string | null;
    dni: string | null;
    role: string;
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      dni: user.dni,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}