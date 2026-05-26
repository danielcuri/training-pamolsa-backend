import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

import { PrismaService } from '../prisma/prisma.service';
import { RecordStatus, Role } from '../../generated/prisma/client';
import { ListAreasDto } from './dto/list-areas.dto';
import { AreaEntity } from './entities/area.entity';
import {
  buildPaginatedResponse,
  buildPrismaQueryParams,
  buildWhere,
} from 'src/common/helpers';
import { AppTrainingIdentityDto } from '../training/dto/app-training-identity.dto';
@Injectable()
export class AreaService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createAreaDto: CreateAreaDto) {
    return await this.prisma.area.create({
      data: {
        ...createAreaDto,
      },
    });
  }

  async findAll(dto: ListAreasDto) {
    const where = {
      ...buildWhere(dto, AreaEntity.SEARCH_FIELDS as string[]),
      // projectId se maneja aparte con la sintaxis correcta de Prisma
      ...(dto.projectId && {
        project: { id: dto.projectId }, // ← sintaxis de relación
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.area.findMany({
        where,
        select: AreaEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.area.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(id: string) {
    return await this.prisma.area.findFirst({
      where: {
        id,
      },
      select: AreaEntity.DEFAULT_SELECT,
    });
  }

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    const area = await this.prisma.area.findUnique({
      where: { id, deletedAt: null },
    });

    if (!area) throw new NotFoundException('Area no encontrado');

    return this.prisma.area.update({
      where: { id },
      data: { ...updateAreaDto },
    });
  }

  async remove(id: string) {
    const area = await this.prisma.area.findUnique({
      where: { id },
    });

    if (!area) throw new NotFoundException('Area no encontrado');

    return this.prisma.area.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
    });
  }
  async findOptionsForApp(dto: AppTrainingIdentityDto, projectId?: string) {
    const appUser = await this.resolveAppUser(dto);

    const selectedProjectId = projectId ?? appUser.projectId;

    if (projectId && projectId !== appUser.projectId) {
      throw new ForbiddenException(
        'No tienes permisos para consultar áreas de otro proyecto',
      );
    }

    const area = await this.prisma.area.findFirst({
      where: {
        id: appUser.areaId,
        deletedAt: null,
        status: RecordStatus.ACTIVE,
        project: {
          id: selectedProjectId,
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundException('Área asignada no encontrada');
    }

    return [area];
  }

  private async resolveAppUser(dto: AppTrainingIdentityDto) {
    const document = dto.document?.trim();
    const email = dto.email?.trim();

    if (!document && !email) {
      throw new BadRequestException(
        'Debe enviar documento o email para identificar al usuario',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        status: RecordStatus.ACTIVE,
        ...(document && { dni: document }),
        ...(email && { email }),
      },
      select: {
        id: true,
        role: true,
        projectId: true,
        areaId: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado o no homologado en Training',
      );
    }

    if (user.role === Role.COLLABORATOR) {
      throw new ForbiddenException(
        'No tienes permisos para visualizar opciones de áreas',
      );
    }

    if (!user.projectId || !user.areaId) {
      throw new BadRequestException(
        'El usuario debe tener un proyecto y área asignados',
      );
    }

    return {
      id: user.id,
      role: user.role,
      projectId: user.projectId,
      areaId: user.areaId,
    };
  }
}
