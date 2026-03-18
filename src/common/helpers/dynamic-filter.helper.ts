export type FilterOperator =
  | 'eq'
  | 'not'
  | 'in'
  | 'like'
  | 'null'
  | 'notnull'
  | 'gte'
  | 'lte'
  | 'gt'
  | 'lt';

const SUFFIX_SEP = '__';
const RESERVED_OPERATORS = new Set<string>([
  'eq',
  'not',
  'in',
  'like',
  'null',
  'notnull',
  'gte',
  'lte',
  'gt',
  'lt',
]);

export interface ParsedFilter {
  field: string;
  operator: FilterOperator;
  rawValue: string;
}

/**
 * Parsea el objeto filter={ "status__in": "ACTIVE,PENDING", "name__like": "john" }
 * en un array de filtros estructurados.
 */
export function parseDynamicFilters(
  filter: Record<string, string> = {},
): ParsedFilter[] {
  return Object.entries(filter)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([key, rawValue]) => {
      const idx = key.lastIndexOf(SUFFIX_SEP);
      if (idx === -1)
        return { field: key, operator: 'eq' as FilterOperator, rawValue };

      const maybeSuffix = key.substring(idx + SUFFIX_SEP.length);
      if (RESERVED_OPERATORS.has(maybeSuffix)) {
        return {
          field: key.substring(0, idx),
          operator: maybeSuffix as FilterOperator,
          rawValue,
        };
      }

      // El __ forma parte del nombre del campo (ej: relación anidada futura)
      return { field: key, operator: 'eq' as FilterOperator, rawValue };
    });
}
