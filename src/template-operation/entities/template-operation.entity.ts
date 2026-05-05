export class TemplateOperationEntity {
  id: string;
  name: string;
  description: string | null;
  priority: string;
  weightPercent: number | null;
  order: number | null;
  minimumScore: number | null;
  templateId: string;
  areaOperationId: string | null;
  createdAt: Date;
  updatedAt: Date;

  static readonly SORTABLE_FIELDS: (keyof TemplateOperationEntity)[] = [
    'name',
    'id',
    'order',
    'priority',
    'createdAt',
  ];

  static readonly FILTERABLE_FIELDS: (keyof TemplateOperationEntity)[] = [
    'name',
    'priority',
    'templateId',
    'areaOperationId',
  ];

  static readonly SEARCH_FIELDS: (keyof TemplateOperationEntity)[] = [
    'name',
    'templateId',
  ];

  static readonly DEFAULT_SELECT = {
    id: true,
    name: true,
    description: true,
    priority: true,
    weightPercent: true,
    order: true,
    minimumScore: true,
    templateId: true,
    areaOperation: {
      select: {
        id: true,
        name: true,
        description: true,
        priority: true,
        weightPercent: true,
        status: true,
        areaId: true,
      },
    },
    createdAt: true,
  } as const;
}
