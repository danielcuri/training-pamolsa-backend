import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';

import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ListAreasDto } from './dto/list-areas.dto';
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Area creado correctamente')
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areaService.create(createAreaDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Areas obtenidos correctamente')
  findAll(@Query() dto: ListAreasDto) {
    return this.areaService.findAll(dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Area obtenido correctamente')
  findOne(@Param('id') id: string) {
    return this.areaService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Area actualizado correctamente')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Area eliminado correctamente')
  remove(@Param('id') id: string) {
    return this.areaService.remove(id);
  }
}
