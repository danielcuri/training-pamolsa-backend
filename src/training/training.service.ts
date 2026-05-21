import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { ListTrainingsDto } from './dto/list-trainings.dto';
import { TrainingEntity } from './entities/training.entity';
import {
  PeriodStatus,
  RecordStatus,
  Role,
} from '../../generated/prisma/client';
import { CreatePeriodProgressDto } from './dto/create-period-progress.dto';
import {
  buildPaginatedResponse,
  buildPrismaQueryParams,
  buildWhere,
} from 'src/common/helpers';
import { AppTrainingIdentityDto } from './dto/app-training-identity.dto';
@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) { }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  async create(createTrainingDto: CreateTrainingDto) {
    const { templateId, startDate } = createTrainingDto;

    const template = await this.prisma.trainingTemplate.findUnique({
      where: { id: templateId, deletedAt: null },
      select: { id: true, totalPeriods: true, periodDurationDays: true },
    });

    if (!template) throw new NotFoundException('Plantilla de capacitación no encontrada');

    if (!template.totalPeriods || template.totalPeriods <= 0) {
      throw new BadRequestException(
        'La plantilla de capacitación no tiene totalPeriods configurado',
      );
    }

    if (!template.periodDurationDays || template.periodDurationDays <= 0) {
      throw new BadRequestException(
        'La plantilla de capacitación no tiene periodDurationDays configurado',
      );
    }

    if (!startDate) {
      throw new BadRequestException(
        'El campo startDate es requerido para generar los periodos',
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      const training = await tx.training.create({
        data: { ...createTrainingDto },
        select: TrainingEntity.DEFAULT_SELECT,
      });

      const durationDays = template.periodDurationDays!;

      await tx.trainingPeriod.createMany({
        data: Array.from({ length: template.totalPeriods! }, (_, idx) => {
          const periodNumber = idx + 1;
          const periodStart = this.addDays(startDate, idx * durationDays);
          const periodEnd = this.addDays(periodStart, durationDays);

          return {
            trainingId: training.id,
            periodNumber,
            startDate: periodStart,
            endDate: periodEnd,
            status: PeriodStatus.NOT_STARTED,
          };
        }),
      });

      return await tx.training.findFirst({
        where: { id: training.id },
        select: TrainingEntity.DEFAULT_SELECT,
      });
    });
  }

  async findAll(dto: ListTrainingsDto) {
    const where = {
      deletedAt: null,
      ...buildWhere(dto, TrainingEntity.SEARCH_FIELDS as string[]),
      ...(dto.userId && { user: { id: dto.userId } }),
      ...(dto.templateId && { template: { id: dto.templateId } }),
      ...(dto.status && { status: dto.status }),
      ...(dto.result && { result: dto.result }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.training.findMany({
        where,
        select: TrainingEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.training.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(id: string) {
    return await this.prisma.training.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: TrainingEntity.DEFAULT_SELECT,
    });
  }

  async update(id: string, updateTrainingDto: UpdateTrainingDto) {
    const training = await this.prisma.training.findUnique({
      where: { id, deletedAt: null },
    });

    if (!training) throw new NotFoundException('Capacitación no encontrada');

    return this.prisma.training.update({
      where: { id },
      data: { ...updateTrainingDto },
      select: TrainingEntity.DEFAULT_SELECT,
    });
  }

  async remove(id: string) {
    const training = await this.prisma.training.findUnique({
      where: { id, deletedAt: null },
    });

    if (!training) throw new NotFoundException('Capacitación no encontrada');

    return this.prisma.training.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: TrainingEntity.DEFAULT_SELECT,
    });
  }
  async findMatrix(id: string) {
    const training = await this.prisma.training.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        startDate: true,
        status: true,
        result: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            dni: true,
            educationLevel: true,
            hireDate: true,
            role: true,
            status: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            version: true,
            periodDurationDays: true,
            totalPeriods: true,
            minimumPassingScore: true,
            status: true,
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
            area: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
            operations: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                name: true,
                description: true,
                priority: true,
                weightPercent: true,
                order: true,
                minimumScore: true,
                status: true,
                areaOperationId: true,
                createdAt: true,
                areaOperation: {
                  select: {
                    id: true,
                    code: true,
                    name: true,
                  },
                },
              },
              orderBy: [
                {
                  order: 'asc',
                },
                {
                  createdAt: 'asc',
                },
              ],
            },
          },
        },

        periods: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            periodNumber: true,
            startDate: true,
            endDate: true,
            evaluationDate: true,
            validationNotes: true,
            reinforcementNotes: true,
            status: true,

            evaluator: {
              select: {
                id: true,
                name: true,
                email: true,
                dni: true,
                role: true,
              },
            },

            logs: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                templateOperationId: true,
                score: true,
                checklist: true,
                notes: true,
                evaluator: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    dni: true,
                    role: true,
                  },
                },
                createdAt: true,
                updatedAt: true,
              },
              orderBy: [
                {
                  createdAt: 'desc',
                },
                {
                  updatedAt: 'desc',
                },
              ],
            },
          },
          orderBy: {
            periodNumber: 'asc',
          },
        },
      },
    });

    if (!training) {
      throw new NotFoundException('Capacitación no encontrada');
    }

    const operations = training.template.operations.map((operation, index) => ({
      id: operation.id,
      order: operation.order ?? index + 1,
      title: `Operación ${operation.order ?? index + 1}`,
      name: operation.name,
      description: operation.description,
      priority: operation.priority,
      weightPercent: operation.weightPercent,
      minimumScore: operation.minimumScore,
      status: operation.status,
      areaOperationId: operation.areaOperationId,
      code: operation.areaOperation?.code ?? null,
    }));

    const periods = training.periods.map((period) => {
      const logsByOperation = new Map<string, (typeof period.logs)[number]>();

      for (const log of period.logs) {
        if (!logsByOperation.has(log.templateOperationId)) {
          logsByOperation.set(log.templateOperationId, log);
        }
      }

      const periodScores = operations.map((operation) => {
        const log = logsByOperation.get(operation.id);

        return {
          operationId: operation.id,
          logId: log?.id ?? null,
          score: log?.score ?? null,
          checklist: log?.checklist ?? null,
          notes: log?.notes ?? null,
          evaluator: log?.evaluator ?? null,
          createdAt: log?.createdAt ?? null,
          updatedAt: log?.updatedAt ?? null,
        };
      });

      const canEdit =
        period.status !== PeriodStatus.COMPLETED &&
        this.isCurrentEditablePeriod(period.startDate, period.endDate);

      return {
        id: period.id,
        periodNumber: period.periodNumber,
        title: this.buildPeriodTitle(
          period.periodNumber,
          training.template.periodDurationDays,
        ),
        startDate: period.startDate,
        endDate: period.endDate,
        evaluationDate: period.evaluationDate,
        status: period.status,

        canEdit,

        evaluator: period.evaluator,

        validationNotes: period.validationNotes,
        reinforcementNotes: period.reinforcementNotes,

        qtyOperationTotal: operations.length,
        qtyOperationStarted: periodScores.filter((score) => score.score !== null)
          .length,

        scores: periodScores,
      };
    });
    const editablePeriod = periods.find((period) => period.canEdit);

    return {
      training: {
        id: training.id,
        startDate: training.startDate,
        status: training.status,
        result: training.result,
        createdAt: training.createdAt,
        updatedAt: training.updatedAt,
      },

      collaborator: {
        id: training.user.id,
        name: training.user.name,
        email: training.user.email,
        dni: training.user.dni,
        educationLevel: training.user.educationLevel,
        hireDate: training.user.hireDate,
        role: training.user.role,
        status: training.user.status,
      },

      template: {
        id: training.template.id,
        name: training.template.name,
        version: training.template.version,
        periodDurationDays: training.template.periodDurationDays,
        totalPeriods: training.template.totalPeriods,
        minimumPassingScore: training.template.minimumPassingScore,
        status: training.template.status,
      },

      project: training.template.project,
      area: training.template.area,

      summary: {
        totalOperations: operations.length,
        totalPeriods: periods.length,
        minimumPassingScore: training.template.minimumPassingScore ?? 5,
        editablePeriodId: editablePeriod?.id ?? null,
        editablePeriodNumber: editablePeriod?.periodNumber ?? null,
      },

      operations,
      periods,
    };
  }
  private buildPeriodTitle(
    periodNumber: number,
    periodDurationDays: number | null,
  ) {
    if (!periodDurationDays) {
      return `Periodo ${periodNumber}`;
    }

    const totalDays = periodNumber * periodDurationDays;

    if (totalDays % 30 === 0) {
      const months = totalDays / 30;

      return `Después de ${months} ${months === 1 ? 'mes' : 'meses'
        } del ingreso`;
    }

    return `Después de ${totalDays} ${totalDays === 1 ? 'día' : 'días'
      } del ingreso`;
  }
  private isCurrentEditablePeriod(
    startDate: Date | null,
    endDate: Date | null,
    currentDate = new Date(),
  ): boolean {
    if (!startDate || !endDate) {
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return currentDate >= start && currentDate < end;
  }
  async createPeriodProgress(periodId: string, dto: CreatePeriodProgressDto) {
    const period = await this.prisma.trainingPeriod.findFirst({
      where: {
        id: periodId,
        deletedAt: null,
      },
      select: {
        id: true,
        trainingId: true,
        training: {
          select: {
            id: true,
            templateId: true,
          },
        },
      },
    });

    if (!period) {
      throw new NotFoundException('Periodo de capacitación no encontrado');
    }

    const operationIds = dto.scores.map((item) => item.templateOperationId);
    const uniqueOperationIds = new Set(operationIds);

    if (uniqueOperationIds.size !== operationIds.length) {
      throw new BadRequestException(
        'No se puede enviar la misma operación más de una vez en el mismo registro',
      );
    }

    const validOperations = await this.prisma.templateOperation.findMany({
      where: {
        id: {
          in: operationIds,
        },
        templateId: period.training.templateId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (validOperations.length !== operationIds.length) {
      throw new BadRequestException(
        'Una o más operaciones no pertenecen a la plantilla de esta capacitación',
      );
    }

    if (dto.evaluatorId) {
      const evaluator = await this.prisma.user.findFirst({
        where: {
          id: dto.evaluatorId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!evaluator) {
        throw new NotFoundException('Evaluador no encontrado');
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.trainingPeriod.update({
        where: {
          id: periodId,
        },
        data: {
          evaluationDate: dto.evaluationDate
            ? new Date(dto.evaluationDate)
            : undefined,
          evaluatorId: dto.evaluatorId,
          validationNotes: dto.validationNotes,
          reinforcementNotes: dto.reinforcementNotes,
          status: PeriodStatus.IN_PROGRESS,
        },
      });

      await tx.trainingLog.createMany({
        data: dto.scores.map((item) => ({
          trainingPeriodId: periodId,
          templateOperationId: item.templateOperationId,
          score: item.score,
          checklist: item.checklist,
          notes: item.notes,
          evaluatorId: dto.evaluatorId,
        })),
      });
    });

    return this.findMatrix(period.trainingId);
  }
  async findEvaluableTrainings(authUserId: string, dto: ListTrainingsDto) {
    const loggedUser = await this.prisma.user.findFirst({
      where: {
        id: authUserId,
        deletedAt: null,
        status: RecordStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        dni: true,
        role: true,
        projectId: true,
        areaId: true,
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!loggedUser) {
      throw new NotFoundException('Usuario logueado no encontrado');
    }

    if (loggedUser.role === Role.COLLABORATOR) {
      throw new ForbiddenException(
        'No tienes permisos para visualizar entrenamientos evaluables',
      );
    }

    if (!loggedUser.projectId || !loggedUser.areaId) {
      throw new BadRequestException(
        'El usuario logueado debe tener un proyecto y área asignados',
      );
    }

    return this.buildEvaluableTrainings(loggedUser, dto);
  }
  async findMatrixForApp(trainingId: string, dto: AppTrainingIdentityDto) {
    const appUser = await this.resolveAppUser(dto);

    await this.validateAppUserCanAccessTraining(trainingId, appUser);

    return this.findMatrix(trainingId);
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
        name: true,
        email: true,
        dni: true,
        role: true,
        status: true,
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
        'No tienes permisos para visualizar esta matriz de entrenamiento',
      );
    }

    if (!user.projectId || !user.areaId) {
      throw new BadRequestException(
        'El usuario debe tener un proyecto y área asignados',
      );
    }

    return user;
  }

  private async validateAppUserCanAccessTraining(
    trainingId: string,
    appUser: {
      id: string;
      role: Role;
      projectId: string | null;
      areaId: string | null;
    },
  ) {
    const training = await this.prisma.training.findFirst({
      where: {
        id: trainingId,
        deletedAt: null,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            role: true,
            status: true,
            projectId: true,
            areaId: true,
          },
        },
        template: {
          select: {
            id: true,
            projectId: true,
            areaId: true,
          },
        },
      },
    });

    if (!training) {
      throw new NotFoundException('Capacitación no encontrada');
    }

    const sameUserArea =
      training.user.projectId === appUser.projectId &&
      training.user.areaId === appUser.areaId;

    const sameTemplateArea =
      training.template.projectId === appUser.projectId &&
      training.template.areaId === appUser.areaId;

    if (!sameUserArea || !sameTemplateArea) {
      throw new ForbiddenException(
        'No tienes permisos para visualizar esta matriz de entrenamiento',
      );
    }
  }

  async findEvaluableTrainingsForApp(
    identity: AppTrainingIdentityDto,
    dto: ListTrainingsDto,
  ) {
    const appUser = await this.resolveAppUser(identity);

    return this.buildEvaluableTrainings(appUser, dto);
  }
  private async buildEvaluableTrainings(
    loggedUser: {
      id: string;
      name: string;
      email: string | null;
      dni: string | null;
      role: Role;
      projectId: string | null;
      areaId: string | null;
    },
    dto: ListTrainingsDto,
  ) {
    const where = {
      deletedAt: null,

      ...(dto.status && {
        status: dto.status,
      }),

      ...(dto.result && {
        result: dto.result,
      }),

      user: {
        deletedAt: null,
        status: RecordStatus.ACTIVE,
        role: Role.COLLABORATOR,
        projectId: loggedUser.projectId,
        areaId: loggedUser.areaId,
      },

      template: {
        deletedAt: null,
        projectId: loggedUser.projectId,
        areaId: loggedUser.areaId,
      },
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.training.findMany({
        where,
        select: {
          id: true,
          startDate: true,
          status: true,
          result: true,
          createdAt: true,
          updatedAt: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              dni: true,
              educationLevel: true,
              hireDate: true,
              role: true,
              status: true,
              projectId: true,
              areaId: true,
            },
          },

          template: {
            select: {
              id: true,
              name: true,
              version: true,
              periodDurationDays: true,
              totalPeriods: true,
              minimumPassingScore: true,
              status: true,
              project: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                },
              },
              area: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                },
              },
            },
          },

          periods: {
            where: {
              deletedAt: null,
            },
            select: {
              id: true,
              periodNumber: true,
              status: true,
            },
            orderBy: {
              periodNumber: 'asc',
            },
          },
        },
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),

      this.prisma.training.count({
        where,
      }),
    ]);

    const rows = data.map((training) => {
      const totalPeriods = training.periods.length;

      const completedPeriods = training.periods.filter(
        (period) => period.status === PeriodStatus.COMPLETED,
      ).length;

      const progressPercentage =
        totalPeriods === 0
          ? 0
          : Number(((completedPeriods / totalPeriods) * 100).toFixed(2));

      return {
        id: training.id,
        startDate: training.startDate,
        status: training.status,
        result: training.result,
        createdAt: training.createdAt,
        updatedAt: training.updatedAt,

        collaborator: {
          id: training.user.id,
          name: training.user.name,
          email: training.user.email,
          dni: training.user.dni,
          educationLevel: training.user.educationLevel,
          hireDate: training.user.hireDate,
          status: training.user.status,
        },

        template: {
          id: training.template.id,
          name: training.template.name,
          version: training.template.version,
          periodDurationDays: training.template.periodDurationDays,
          totalPeriods: training.template.totalPeriods,
          minimumPassingScore: training.template.minimumPassingScore,
          status: training.template.status,
        },

        project: training.template.project,
        area: training.template.area,

        progress: {
          totalPeriods,
          completedPeriods,
          pendingPeriods: totalPeriods - completedPeriods,
          percentage: progressPercentage,
        },
      };
    });

    return buildPaginatedResponse(rows, total, dto);
  }
}

