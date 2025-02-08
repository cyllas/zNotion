import { NotionErrors } from '../errors/NotionErrors';
import { 
  NotionEmojiIcon, 
  NotionExternalIcon, 
  NotionExternalCover 
} from '../types/NotionPageTypes';

/**
 * Utilitários para validação de dados do Notion
 */
export class ValidationUtils {
  /**
   * Valida um ID do Notion
   */
  static validateId(id: string | undefined): void {
    if (!id) {
      throw NotionErrors.createValidationError('ID é obrigatório');
    }
    if (typeof id !== 'string') {
      throw NotionErrors.createValidationError('ID deve ser uma string');
    }
    if (id.length === 0) {
      throw NotionErrors.createValidationError('ID não pode estar vazio');
    }
  }

  /**
   * Valida uma URL
   */
  static validateUrl(url: string | undefined): void {
    if (!url) {
      throw NotionErrors.createValidationError('URL é obrigatória');
    }
    if (typeof url !== 'string') {
      throw NotionErrors.createValidationError('URL deve ser uma string');
    }
    try {
      new URL(url);
    } catch {
      throw NotionErrors.createValidationError('URL inválida');
    }
  }

  /**
   * Valida um ícone do Notion
   */
  static validateIcon(icon: NotionEmojiIcon | NotionExternalIcon | null | undefined): void {
    if (!icon) return;

    if (!icon.type || !['emoji', 'external'].includes(icon.type)) {
      throw NotionErrors.createValidationError('Tipo de ícone inválido');
    }

    if (icon.type === 'emoji' && !('emoji' in icon)) {
      throw NotionErrors.createValidationError('Emoji é obrigatório para ícones do tipo emoji');
    }

    if (icon.type === 'external' && (!('external' in icon) || !icon.external.url)) {
      throw NotionErrors.createValidationError('URL é obrigatória para ícones externos');
    }

    if (icon.type === 'external' && icon.external?.url) {
      this.validateUrl(icon.external.url);
    }
  }

  /**
   * Valida uma capa do Notion
   */
  static validateCover(cover: NotionExternalCover | null | undefined): void {
    if (!cover) return;

    if (!cover.type || cover.type !== 'external') {
      throw NotionErrors.createValidationError('Tipo de capa inválido');
    }

    if (!cover.external || !cover.external.url) {
      throw NotionErrors.createValidationError('URL é obrigatória para capas');
    }

    this.validateUrl(cover.external.url);
  }

  /**
   * Valida parâmetros de paginação
   */
  static validatePagination(pageSize?: number, startCursor?: string): void {
    if (pageSize !== undefined) {
      if (typeof pageSize !== 'number') {
        throw NotionErrors.createValidationError('Tamanho da página deve ser um número');
      }
      if (pageSize < 1 || pageSize > 100) {
        throw NotionErrors.createValidationError('Tamanho da página deve estar entre 1 e 100');
      }
    }

    if (startCursor !== undefined && typeof startCursor !== 'string') {
      throw NotionErrors.createValidationError('Cursor deve ser uma string');
    }
  }

  /**
   * Valida um valor booleano
   */
  static validateBoolean(value: boolean | undefined, field: string): void {
    if (value === undefined) return;
    if (typeof value !== 'boolean') {
      throw NotionErrors.createValidationError(`${field} deve ser um booleano`);
    }
  }
}
