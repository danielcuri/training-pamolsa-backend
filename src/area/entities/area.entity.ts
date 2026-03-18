export class AreaEntity {
  id: string;
  name: string;
  status: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Campos por los que se puede ordenar.
   * Cualquier campo fuera de esta lista es ignorado silenciosamente.
   */
  static readonly SORTABLE_FIELDS: (keyof AreaEntity)[] = ['name', 'id'];

  /**
   * Campos sobre los que se pueden aplicar filtros dinámicos.
   * Actúa como whitelist de seguridad — nunca exponer campos sensibles.
   */
  static readonly FILTERABLE_FIELDS: (keyof AreaEntity)[] = ['name', 'status'];

  /** Campos sobre los que aplica el ?search= global */
  static readonly SEARCH_FIELDS: (keyof AreaEntity)[] = ['name', 'projectId'];

  /**
   * Campos que se retornan por defecto en los listados.
   * Útil para un futuro select dinámico.
   */
  static readonly DEFAULT_SELECT = {
    id: true,
    name: true,
    status: true,
    createdAt: true,
    project: {
      select: {
        id: true,
        name: true,
        status: true,
      },
    },
  } as const;
}
