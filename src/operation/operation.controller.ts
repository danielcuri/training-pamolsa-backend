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
import { OperationService } from './operation.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';

import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ListOperationsDto } from './dto/list-operations.dto';

@Controller('operation')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operacion creada correctamente')
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationService.create(createOperationDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operaciones obtenidas correctamente')
  findAll(@Query() dto: ListOperationsDto) {
    return this.operationService.findAll(dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operacion obtenida correctamente')
  findOne(@Param('id') id: string) {
    return this.operationService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operacion actualizada correctamente')
  update(
    @Param('id') id: string,
    @Body() updateOperationDto: UpdateOperationDto,
  ) {
    return this.operationService.update(id, updateOperationDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Operacion eliminada correctamente')
  remove(@Param('id') id: string) {
    return this.operationService.remove(id);
  }
}
