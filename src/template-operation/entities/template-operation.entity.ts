export class TemplateOperationEntity {
  id: string;
  name: string;
  description: string | null;
  priority: string;
  weightPercent: number | null;
  order: number | null;
  minimumScore: number | null;
  status: string;
  templateId: string;
  areaOperationId: string | null;
  createdAt: Date;
  updatedAt: Date;
  code: string | null;

  static readonly SORTABLE_FIELDS: (keyof TemplateOperationEntity)[] = [
    'name',
    'id',
    'order',
    'priority',
    'createdAt',
    'code',
  ];

  static readonly FILTERABLE_FIELDS: (keyof TemplateOperationEntity)[] = [
    'name',
    'priority',
    'status',
    'templateId',
    'areaOperationId',
    'code',
  ];

  static readonly SEARCH_FIELDS: (keyof TemplateOperationEntity)[] = [
    'name',
    'templateId',
    'code'
  ];

  static readonly DEFAULT_SELECT = {
    id: true,
    name: true,
    description: true,
    priority: true,
    weightPercent: true,
    order: true,
    minimumScore: true,
    status: true,
    templateId: true,
    areaOperation: {
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        priority: true,
        weightPercent: true,
        status: true,
        areaId: true,
      },
    },
    areaOperationId: true,
    updatedAt: true,
    createdAt: true,
    code: true,
  } as const;
}
