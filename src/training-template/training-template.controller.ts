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
import { TrainingTemplateService } from './training-template.service';
import { CreateTrainingTemplateDto } from './dto/create-training-template.dto';
import { UpdateTrainingTemplateDto } from './dto/update-training-template.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';

import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ListTrainingTemplatesDto } from './dto/list-training-templates.dto';

@Controller('training-template')
export class TrainingTemplateController {
  constructor(
    private readonly trainingTemplateService: TrainingTemplateService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Plantilla de capacitación creada correctamente')
  create(@Body() createTrainingTemplateDto: CreateTrainingTemplateDto) {
    return this.trainingTemplateService.create(createTrainingTemplateDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Plantillas de capacitación obtenidas correctamente')
  findAll(@Query() dto: ListTrainingTemplatesDto) {
    return this.trainingTemplateService.findAll(dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Plantilla de capacitación obtenida correctamente')
  findOne(@Param('id') id: string) {
    return this.trainingTemplateService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Plantilla de capacitación actualizada correctamente')
  update(
    @Param('id') id: string,
    @Body() updateTrainingTemplateDto: UpdateTrainingTemplateDto,
  ) {
    return this.trainingTemplateService.update(id, updateTrainingTemplateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Plantilla de capacitación eliminada correctamente')
  remove(@Param('id') id: string) {
    return this.trainingTemplateService.remove(id);
  }
}
