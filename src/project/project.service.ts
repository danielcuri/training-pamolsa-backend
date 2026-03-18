import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';

import { ListProjectsDto } from './dto/list-projects.dto';
import {
  buildPrismaQueryParams,
  buildPaginatedResponse,
  buildWhere,
} from 'src/common/helpers';
import { ProjectEntity } from './entities/project.entity';
import type { Prisma } from '../../generated/prisma/client';
@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.prisma.project.create({
      data: {
        ...createProjectDto,
      },
    });
  }

  async findAll(dto: ListProjectsDto) {
    const where = buildWhere(dto, ProjectEntity.SEARCH_FIELDS as string[]);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        select: ProjectEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.project.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(id: string) {
    return await this.prisma.project.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
    });

    if (!project) throw new NotFoundException('Proyecto no encontrado');

    return this.prisma.project.update({
      where: { id },
      data: { ...updateProjectDto },
    });
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) throw new NotFoundException('Proyecto no encontrado');

    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
