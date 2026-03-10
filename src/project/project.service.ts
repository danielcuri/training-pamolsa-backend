import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'generated/prisma';
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

  async findAll() {
    return await this.prisma.project.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
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
