export class TrainingTemplateEntity {
  id: string;
  name: string;
  version: number;
  periodDurationDays: number | null;
  totalPeriods: number | null;
  minimumPassingScore: number | null;
  certificateTemplatePdf: string | null;
  status: string;
  areaId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Campos por los que se puede ordenar.
   * Cualquier campo fuera de esta lista es ignorado silenciosamente.
   */
  static readonly SORTABLE_FIELDS: (keyof TrainingTemplateEntity)[] = [
    'name',
    'version',
    'id',
    'status',
    'createdAt',
    'periodDurationDays',
    'totalPeriods',
    'minimumPassingScore',
  ];

  /**
   * Campos sobre los que se pueden aplicar filtros dinámicos.
   * Actúa como whitelist de seguridad — nunca exponer campos sensibles.
   */
  static readonly FILTERABLE_FIELDS: (keyof TrainingTemplateEntity)[] = [
    'name',
    'status',
    'projectId',
    'areaId',
    'version',
  ];

  /** Campos sobre los que aplica el ?search= global */
  static readonly SEARCH_FIELDS: (keyof TrainingTemplateEntity)[] = [
    'name',
    'projectId',
  ];

  /**
   * Campos que se retornan por defecto en los listados.
   * Útil para un futuro select dinámico.
   */
  static readonly DEFAULT_SELECT = {
    id: true,
    name: true,
    version: true,
    periodDurationDays: true,
    totalPeriods: true,
    minimumPassingScore: true,
    certificateTemplatePdf: true,
    status: true,
    createdAt: true,
    updatedAt: true,
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
  } as const;
}
