import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PrismaService } from '../prisma/prisma.service';
import { ListUsersDto } from './dto/list-users.dto';
import { UserEntity } from './entities/user.entity';
import {
  buildPaginatedResponse,
  buildPrismaQueryParams,
  buildWhere,
} from 'src/common/helpers';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = { ...createUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await this.prisma.user.create({
      data,
      select: UserEntity.DEFAULT_SELECT,
    });
  }

  async findAll(dto: ListUsersDto) {
    const where = {
      ...buildWhere(dto, UserEntity.SEARCH_FIELDS as string[]),
      ...(dto.projectId && {
        project: { id: dto.projectId },
      }),
      ...(dto.areaId && {
        area: { id: dto.areaId },
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: UserEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.user.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
      select: UserEntity.DEFAULT_SELECT,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: UserEntity.DEFAULT_SELECT,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: UserEntity.DEFAULT_SELECT,
    });
  }
}
