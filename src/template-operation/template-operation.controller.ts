import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TemplateOperationService } from './template-operation.service';
import { CreateTemplateOperationDto } from './dto/create-template-operation.dto';
import { UpdateTemplateOperationDto } from './dto/update-template-operation.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ListTemplateOperationsDto } from './dto/list-template-operations.dto';

@ApiTags('template-operation')
@ApiBearerAuth('JWT-auth')
@Controller('training-template/:templateId/template-operation')
export class TemplateOperationController {
  constructor(
    private readonly templateOperationService: TemplateOperationService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operación de plantilla creada correctamente')
  create(
    @Param('templateId') templateId: string,
    @Body() dto: CreateTemplateOperationDto,
  ) {
    return this.templateOperationService.create(templateId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operaciones de plantilla seleccionada')
  findAll(
    @Param('templateId') templateId: string,
    @Query() dto: ListTemplateOperationsDto,
  ) {
    return this.templateOperationService.findAll(templateId, dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operación de plantilla obtenida correctamente')
  findOne(@Param('templateId') templateId: string, @Param('id') id: string) {
    return this.templateOperationService.findOne(templateId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operación de plantilla actualizada correctamente')
  update(
    @Param('templateId') templateId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTemplateOperationDto,
  ) {
    return this.templateOperationService.update(templateId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operación de plantilla eliminada correctamente')
  remove(@Param('templateId') templateId: string, @Param('id') id: string) {
    return this.templateOperationService.remove(templateId, id);
  }
}
