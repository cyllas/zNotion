import { APIErrorCode } from '@notionhq/client';

export interface NotionErrorParams {
  message: string;
  code?: APIErrorCode | string;
  status?: number;
}

/**
 * Classe de erro personalizada para a integração com o Notion
 */
export class NotionError extends Error {
  private code: string;
  private status?: number;

  constructor(params: NotionErrorParams) {
    super(params.message);
    this.name = 'NotionError';
    this.code = params.code || 'generic_error';
    this.status = params.status;
  }

  /**
   * Serializa o erro para JSON
   */
  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        status: this.status
      }
    };
  }
}
