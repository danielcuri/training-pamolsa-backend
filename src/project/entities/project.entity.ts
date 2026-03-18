export class ProjectEntity {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Campos por los que se puede ordenar.
   * Cualquier campo fuera de esta lista es ignorado silenciosamente.
   */
  static readonly SORTABLE_FIELDS: (keyof ProjectEntity)[] = ['name', 'id'];

  /**
   * Campos sobre los que se pueden aplicar filtros dinámicos.
   * Actúa como whitelist de seguridad — nunca exponer campos sensibles.
   */
  static readonly FILTERABLE_FIELDS: (keyof ProjectEntity)[] = [
    'name',
    'status',
  ];

  /** Campos sobre los que aplica el ?search= global */
  static readonly SEARCH_FIELDS: (keyof ProjectEntity)[] = ['name'];

  /**
   * Campos que se retornan por defecto en los listados.
   * Útil para un futuro select dinámico.
   */
  static readonly DEFAULT_SELECT: Partial<Record<keyof ProjectEntity, true>> = {
    id: true,
    name: true,
    status: true,
    createdAt: true,
  };
}
