export class OperationEntity {
  id: string;
  name: string;
  description: string;
  priority: string;
  weightPercent: number;
  status: string;
  areaId: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Campos por los que se puede ordenar.
   * Cualquier campo fuera de esta lista es ignorado silenciosamente.
   */
  static readonly SORTABLE_FIELDS: (keyof OperationEntity)[] = ['name', 'id'];

  /**
   * Campos sobre los que se pueden aplicar filtros dinámicos.
   * Actúa como whitelist de seguridad — nunca exponer campos sensibles.
   */
  static readonly FILTERABLE_FIELDS: (keyof OperationEntity)[] = [
    'name',
    'description',
    'priority',
    'areaId',
  ];

  /** Campos sobre los que aplica el ?search= global */
  static readonly SEARCH_FIELDS: (keyof OperationEntity)[] = ['name', 'areaId'];

  /**
   * Campos que se retornan por defecto en los listados.
   * Útil para un futuro select dinámico.
   */
  static readonly DEFAULT_SELECT = {
    id: true,
    name: true,
    description: true,
    weightPercent: true,
    priority: true,
    status: true,
    createdAt: true,
    area: {
      select: {
        id: true,
        name: true,
        status: true,
        projectId: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  } as const;
}
