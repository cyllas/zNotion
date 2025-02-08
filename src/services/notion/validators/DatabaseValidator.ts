import { NotionDatabaseProperty, NotionFilter, NotionSort } from '../types/NotionTypes';
import { BaseValidator } from './BaseValidator';

/**
 * Validador para propriedades de banco de dados do Notion
 */
export class DatabaseValidator extends BaseValidator {
  /**
   * Valida uma propriedade de banco de dados
   */
  static validateDatabaseProperty(property: NotionDatabaseProperty): void {
    this.validateString(property.id, 'ID da propriedade');
    this.validateString(property.name, 'Nome da propriedade');
    this.validateString(property.type, 'Tipo da propriedade');

    this.validateProperty(property);
  }

  private static validateProperty(property: NotionDatabaseProperty): void {
    this.validateString(property.type, 'Tipo da propriedade');

    switch (property.type) {
      case 'title':
        // Título não tem validações adicionais
        break;

      case 'rich_text':
        // Rich text não tem validações adicionais
        break;

      case 'number':
        if ('format' in property) {
          this.validateString(property.format, 'Formato do número');
        }
        break;

      case 'select':
        if ('options' in property) {
          this.validateArray(property.options, 'Opções de seleção');
          property.options.forEach((option: { name: string; color?: string }, index: number) => {
            this.validateString(option.name, `Nome da opção ${index + 1}`);
            if (option.color) {
              this.validateString(option.color, `Cor da opção ${index + 1}`);
            }
          });
        }
        break;

      case 'multi_select':
        if ('options' in property) {
          this.validateArray(property.options, 'Opções de múltipla seleção');
          property.options.forEach((option: { name: string; color?: string }, index: number) => {
            this.validateString(option.name, `Nome da opção ${index + 1}`);
            if (option.color) {
              this.validateString(option.color, `Cor da opção ${index + 1}`);
            }
          });
        }
        break;

      case 'date':
        // Data não tem validações adicionais
        break;

      case 'formula':
        if ('expression' in property) {
          this.validateString(property.expression, 'Expressão da fórmula');
        }
        break;

      case 'relation':
        if ('database_id' in property) {
          this.validateString(property.database_id, 'ID do banco de dados relacionado');
        }
        break;

      case 'rollup':
        if ('relation_property_name' in property && 'rollup_property_name' in property && 'function' in property) {
          this.validateString(property.relation_property_name, 'Nome da propriedade de relação');
          this.validateString(property.rollup_property_name, 'Nome da propriedade de rollup');
          this.validateString(property.function, 'Função de rollup');
        }
        break;

      case 'files':
      case 'checkbox':
      case 'url':
      case 'email':
      case 'phone_number':
      case 'created_time':
      case 'created_by':
      case 'last_edited_time':
      case 'last_edited_by':
        // Esses tipos não têm validações adicionais
        break;

      default:
        throw new Error(`Tipo de propriedade inválido: ${property.type}`);
    }
  }

  /**
   * Valida um filtro de consulta
   */
  static validateFilter(filter: NotionFilter): void {
    if (!filter || typeof filter !== 'object') {
      throw new Error('Filtro inválido');
    }

    // Validar operadores de filtro
    const validOperators = [
      'equals',
      'does_not_equal',
      'contains',
      'does_not_contain',
      'starts_with',
      'ends_with',
      'greater_than',
      'less_than',
      'greater_than_or_equal_to',
      'less_than_or_equal_to',
      'is_empty',
      'is_not_empty'
    ];

    const operator = Object.keys(filter).find(key => validOperators.includes(key));
    if (operator) {
      const value = filter[operator];
      if (value === undefined) {
        throw new Error(`Valor inválido para o operador ${operator}`);
      }
    }
  }

  /**
   * Valida uma ordenação de consulta
   */
  static validateSort(sort: NotionSort): void {
    if (sort.property) {
      this.validateString(sort.property, 'Propriedade de ordenação');
    }

    if (sort.timestamp) {
      const validTimestamps = ['created_time', 'last_edited_time'];
      if (!validTimestamps.includes(sort.timestamp)) {
        this.throwValidationError('Timestamp de ordenação inválido');
      }
    }

    const validDirections = ['ascending', 'descending'];
    if (!validDirections.includes(sort.direction)) {
      this.throwValidationError('Direção de ordenação inválida');
    }
  }
}
