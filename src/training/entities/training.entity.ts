import { TrainingResult, TrainingStatus } from '../../../generated/prisma/client';

export class TrainingEntity {
  id: string;
  userId: string;
  templateId: string;
  startDate: Date | null;
  status: TrainingStatus;
  result: TrainingResult | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  /**
   * Campos por los que se puede ordenar.
   * Cualquier campo fuera de esta lista es ignorado silenciosamente.
   */
  static readonly SORTABLE_FIELDS: (keyof TrainingEntity)[] = [
    'createdAt',
    'updatedAt',
    'startDate',
    'status',
    'result',
    'id',
  ];

  /**
   * Campos sobre los que se pueden aplicar filtros dinámicos.
   * Actúa como whitelist de seguridad — nunca exponer campos sensibles.
   */
  static readonly FILTERABLE_FIELDS: (keyof TrainingEntity)[] = [
    'userId',
    'templateId',
    'status',
    'result',
    'startDate',
    'createdAt',
  ];

  /** Campos sobre los que aplica el ?search= global */
  static readonly SEARCH_FIELDS: (keyof TrainingEntity)[] = ['id'];

  static readonly DEFAULT_SELECT = {
    id: true,
    userId: true,
    templateId: true,
    startDate: true,
    status: true,
    result: true,
    createdAt: true,
    updatedAt: true,
    periods: {
      select: {
        id: true,
        periodNumber: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { periodNumber: 'asc' as const },
    },
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        dni: true,
        role: true,
        status: true,
      },
    },
    template: {
      select: {
        id: true,
        name: true,
        version: true,
        status: true,
        project: {
          select: { id: true, name: true, status: true },
        },
        area: {
          select: { id: true, name: true, status: true },
        },
      },
    },
  } as const;
}

