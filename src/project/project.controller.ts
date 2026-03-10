import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Proyecto creado correctamente')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Proyectos obtenidos correctamente')
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Proyecto obtenido correctamente')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Proyecto actualizado correctamente')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Proyecto eliminado correctamente')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

