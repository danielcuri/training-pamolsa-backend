import { parseDynamicFilters } from './dynamic-filter.helper';

function castValue(v: string): number | Date | string {
  if (!isNaN(Number(v))) return Number(v);
  const d = new Date(v);
  if (!isNaN(d.getTime()) && v.includes('-')) return d;
  return v;
}

/**
 * Convierte filter={ ... } del DTO en un objeto where de Prisma.
 * Solo se procesan los campos presentes en whitelist.
 */
export function buildDynamicWhere(
  filter: Record<string, string> = {},
  whitelist: string[] = [],
): Record<string, any> {
  const where: Record<string, any> = {};
  const parsed = parseDynamicFilters(filter);

  for (const { field, operator, rawValue } of parsed) {
    if (!whitelist.includes(field)) continue;

    switch (operator) {
      case 'eq':
        where[field] = castValue(rawValue);
        break;

      case 'not':
        where[field] = { not: castValue(rawValue) };
        break;

      case 'in': {
        const values = rawValue.split(',').map((v) => castValue(v.trim()));
        where[field] = { in: values };
        break;
      }

      case 'like':
        where[field] = { contains: rawValue, mode: 'insensitive' };
        break;

      case 'null':
        // "true"  → IS NULL
        // "false" → IS NOT NULL
        where[field] = rawValue === 'true' ? null : { not: null };
        break;

      case 'notnull':
        where[field] = { not: null };
        break;

      case 'gte':
        where[field] = { ...(where[field] ?? {}), gte: castValue(rawValue) };
        break;

      case 'lte':
        where[field] = { ...(where[field] ?? {}), lte: castValue(rawValue) };
        break;

      case 'gt':
        where[field] = { ...(where[field] ?? {}), gt: castValue(rawValue) };
        break;

      case 'lt':
        where[field] = { ...(where[field] ?? {}), lt: castValue(rawValue) };
        break;
    }
  }

  return where;
}
