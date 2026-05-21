import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { ListTrainingsDto } from './dto/list-trainings.dto';
import { TrainingEntity } from './entities/training.entity';
import { CreatePeriodProgressDto } from './dto/create-period-progress.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AppTrainingIdentityDto } from './dto/app-training-identity.dto';
@ApiTags('training')
@ApiBearerAuth('JWT-auth')
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) { }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Capacitación creada correctamente')
  @ApiOperation({
    summary: 'Crear capacitación',
    description:
      'Crea una capacitación para un usuario usando una plantilla. Requiere `userId` y `templateId`. Aunque `startDate` es nullable en BD, el backend lo exige para generar los periodos.',
  })
  @ApiCreatedResponse({ description: 'Capacitación creada', type: TrainingEntity })
  @ApiBadRequestResponse({
    description:
      'Datos inválidos o la plantilla no tiene `totalPeriods`/`periodDurationDays` configurados, o falta `startDate`.',
  })
  @ApiNotFoundResponse({ description: 'Plantilla de capacitación no encontrada' })
  create(@Body() createTrainingDto: CreateTrainingDto) {
    return this.trainingService.create(createTrainingDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Capacitaciones obtenidas correctamente')
  @ApiOperation({
    summary: 'Listar capacitaciones',
    description:
      'Devuelve una lista paginada de capacitaciones. Permite filtros por `userId`, `templateId`, `status`, `result` y parámetros de paginación/orden.',
  })
  @ApiOkResponse({
    description: 'Listado paginado de capacitaciones',
  })
  findAll(@Query() dto: ListTrainingsDto) {
    return this.trainingService.findAll(dto);
  }

  @Post('periods/:periodId/progress')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Progreso del periodo registrado correctamente')
  @ApiOperation({
    summary: 'Registrar progreso grupal de un periodo',
    description:
      'Registra en grupo los puntajes de varias operaciones dentro de un periodo. Actualiza los datos generales del periodo y crea logs históricos por operación.',
  })
  @ApiParam({
    name: 'periodId',
    description: 'ID del periodo de capacitación',
    format: 'uuid',
  })
  @ApiCreatedResponse({
    description: 'Progreso del periodo registrado correctamente',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o una operación no pertenece a la plantilla de la capacitación',
  })
  @ApiNotFoundResponse({
    description: 'Periodo de capacitación no encontrado',
  })
  createPeriodProgress(
    @Param('periodId') periodId: string,
    @Body() dto: CreatePeriodProgressDto,
  ) {
    return this.trainingService.createPeriodProgress(periodId, dto);
  }

  @Get('evaluable')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.SUPERVISOR)
  @ResponseMessage('Entrenamientos evaluables obtenidos correctamente')
  @ApiOperation({
    summary: 'Listar entrenamientos evaluables',
    description:
      'Devuelve las cabeceras de entrenamientos que el usuario logueado puede evaluar según su proyecto y área.',
  })
  @ApiOkResponse({
    description: 'Listado de entrenamientos evaluables',
  })
  findEvaluableTrainings(@Req() req: any, @Query() dto: ListTrainingsDto) {
    return this.trainingService.findEvaluableTrainings(req.user.id, dto);
  }

  @Public()
  @Post('app/:id/matrix')
  @ResponseMessage('Matriz de entrenamiento para app obtenida correctamente')
  @ApiOperation({
    summary: 'Obtener matriz de entrenamiento para app',
    description:
      'Devuelve la matriz de entrenamiento para app validando al usuario mediante documento y email enviados en el payload.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la capacitación',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Matriz de entrenamiento para app obtenida correctamente',
  })
  @ApiBadRequestResponse({
    description: 'Debe enviar documento o email, o el usuario no tiene proyecto/área asignados.',
  })
  @ApiNotFoundResponse({
    description: 'Usuario o capacitación no encontrada',
  })
  @Public()
  @Post('app/evaluable')
  @ResponseMessage('Entrenamientos evaluables para app obtenidos correctamente')
  @ApiOperation({
    summary: 'Listar entrenamientos evaluables para app',
    description:
      'Devuelve las cabeceras de entrenamientos que el usuario puede evaluar, validando documento y email enviados en el payload.',
  })
  @ApiOkResponse({
    description: 'Listado de entrenamientos evaluables para app',
  })
  @ApiBadRequestResponse({
    description: 'Debe enviar documento o email, o el usuario no tiene proyecto/área asignados.',
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado o no homologado en Training.',
  })
  findEvaluableTrainingsForApp(
    @Body() identity: AppTrainingIdentityDto,
    @Query() dto: ListTrainingsDto,
  ) {
    return this.trainingService.findEvaluableTrainingsForApp(identity, dto);
  }

  findMatrixForApp(
    @Param('id') id: string,
    @Body() dto: AppTrainingIdentityDto,
  ) {
    return this.trainingService.findMatrixForApp(id, dto);
  }

  @Get(':id/matrix')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.SUPERVISOR)
  @ResponseMessage('Matriz de entrenamiento obtenida correctamente')
  @ApiOperation({
    summary: 'Obtener matriz de entrenamiento',
    description:
      'Devuelve la información completa de una capacitación para pintar la matriz: colaborador, plantilla, operaciones, periodos, evaluador, validaciones, refuerzos y puntajes.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la capacitación',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Matriz de entrenamiento obtenida correctamente',
  })
  @ApiNotFoundResponse({
    description: 'Capacitación no encontrada',
  })
  findMatrix(@Param('id') id: string) {
    return this.trainingService.findMatrix(id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Capacitación obtenida correctamente')
  @ApiOperation({ summary: 'Obtener capacitación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la capacitación', format: 'uuid' })
  @ApiOkResponse({ description: 'Capacitación encontrada', type: TrainingEntity })
  @ApiNotFoundResponse({ description: 'Capacitación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.trainingService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Capacitación actualizada correctamente')
  @ApiOperation({ summary: 'Actualizar capacitación' })
  @ApiParam({ name: 'id', description: 'ID de la capacitación', format: 'uuid' })
  @ApiOkResponse({ description: 'Capacitación actualizada', type: TrainingEntity })
  @ApiNotFoundResponse({ description: 'Capacitación no encontrada' })
  update(@Param('id') id: string, @Body() updateTrainingDto: UpdateTrainingDto) {
    return this.trainingService.update(id, updateTrainingDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ResponseMessage('Capacitación eliminada correctamente')
  @ApiOperation({ summary: 'Eliminar capacitación (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID de la capacitación', format: 'uuid' })
  @ApiOkResponse({ description: 'Capacitación eliminada', type: TrainingEntity })
  @ApiNotFoundResponse({ description: 'Capacitación no encontrada' })
  remove(@Param('id') id: string) {
    return this.trainingService.remove(id);
  }
}

