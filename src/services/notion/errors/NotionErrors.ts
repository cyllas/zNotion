import { APIResponseError } from '@notionhq/client';

/**
 * Tipos de erro do Notion
 */
export enum NotionErrorType {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL = 'INTERNAL'
}

/**
 * Erro base do Notion
 */
export class NotionError extends Error {
  constructor(
    public readonly type: NotionErrorType,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'NotionError';
  }
}

/**
 * Utilitário para manipulação de erros do Notion
 */
export class NotionErrors {
  /**
   * Cria um erro de validação
   */
  static createValidationError(message: string): NotionError {
    return new NotionError(NotionErrorType.VALIDATION, message);
  }

  /**
   * Cria um erro de não encontrado
   */
  static createNotFoundError(message: string): NotionError {
    return new NotionError(NotionErrorType.NOT_FOUND, message);
  }

  /**
   * Cria um erro de não autorizado
   */
  static createUnauthorizedError(message: string): NotionError {
    return new NotionError(NotionErrorType.UNAUTHORIZED, message);
  }

  /**
   * Cria um erro de limite de taxa
   */
  static createRateLimitedError(message: string): NotionError {
    return new NotionError(NotionErrorType.RATE_LIMITED, message);
  }

  /**
   * Cria um erro interno
   */
  static createInternalError(message: string, cause?: unknown): NotionError {
    return new NotionError(NotionErrorType.INTERNAL, message, cause);
  }

  /**
   * Trata um erro da API do Notion
   */
  static handleError(error: unknown): NotionError {
    if (error instanceof NotionError) {
      return error;
    }

    if (error instanceof APIResponseError) {
      switch (error.code) {
        case 'validation_error':
          return this.createValidationError(error.message);
        case 'object_not_found':
          return this.createNotFoundError(error.message);
        case 'unauthorized':
          return this.createUnauthorizedError(error.message);
        case 'rate_limited':
          return this.createRateLimitedError(error.message);
        default:
          return this.createInternalError(error.message, error);
      }
    }

    if (error instanceof Error) {
      return this.createInternalError(error.message, error);
    }

    return this.createInternalError('Erro desconhecido', error);
  }
}
