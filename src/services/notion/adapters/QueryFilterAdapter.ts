import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { NotionFilter, NotionPropertyFilter, NotionCompoundFilter } from '../types/NotionTypes';

/**
 * Adaptador para converter filtros de consulta do domínio para o formato da API do Notion
 */
export class QueryFilterAdapter {
  adapt(from?: NotionFilter): QueryDatabaseParameters['filter'] {
    if (!from) return undefined;

    if (this.isCompoundFilter(from)) {
      return this.adaptCompoundFilter(from);
    }

    return this.adaptPropertyFilter(from);
  }

  private isCompoundFilter(filter: NotionFilter): filter is NotionCompoundFilter {
    return 'and' in filter || 'or' in filter;
  }

  private adaptPropertyFilter(filter: NotionPropertyFilter): QueryDatabaseParameters['filter'] {
    const { property, operator, value } = filter;

    // Mapeamento básico de operadores
    switch (operator) {
      case 'equals':
        return {
          property,
          [operator]: value
        };
      case 'does_not_equal':
        return {
          property,
          [operator]: value
        };
      case 'contains':
        return {
          property,
          [operator]: value
        };
      case 'does_not_contain':
        return {
          property,
          [operator]: value
        };
      case 'starts_with':
        return {
          property,
          [operator]: value
        };
      case 'ends_with':
        return {
          property,
          [operator]: value
        };
      case 'greater_than':
        return {
          property,
          [operator]: value
        };
      case 'less_than':
        return {
          property,
          [operator]: value
        };
      case 'greater_than_or_equal_to':
        return {
          property,
          [operator]: value
        };
      case 'less_than_or_equal_to':
        return {
          property,
          [operator]: value
        };
      default:
        throw new Error(`Operador de filtro não suportado: ${operator}`);
    }
  }

  private adaptCompoundFilter(filter: NotionCompoundFilter): QueryDatabaseParameters['filter'] {
    if (filter.and) {
      return {
        and: filter.and.map(f => this.adaptPropertyFilter(f))
      };
    }
    if (filter.or) {
      return {
        or: filter.or.map(f => this.adaptPropertyFilter(f))
      };
    }
    throw new Error('Filtro composto inválido: deve ter "and" ou "or"');
  }
}
