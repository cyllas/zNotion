import { NotionWebhook, NotionWebhookEvent } from '../types/NotionTypes';
import { BaseValidator } from './BaseValidator';

/**
 * Validador para webhooks do Notion
 */
export class WebhookValidator extends BaseValidator {
  /**
   * Valida um webhook
   */
  static validateWebhook(webhook: NotionWebhook): void {
    this.validateString(webhook.id, 'ID do webhook');
    this.validateBoolean(webhook.active, 'Status do webhook');
    this.validateUrl(webhook.url, 'URL do webhook');
    this.validateEvents(webhook.events);

    if (webhook.createdTime) {
      this.validateDate(webhook.createdTime, 'Data de criação');
    }

    if (webhook.lastSuccessTime) {
      this.validateDate(webhook.lastSuccessTime, 'Data do último sucesso');
    }

    if (webhook.lastFailureTime) {
      this.validateDate(webhook.lastFailureTime, 'Data da última falha');
    }

    if (webhook.createdBy) {
      this.validateObject(webhook.createdBy, 'Criado por');
      this.validateString(webhook.createdBy.id, 'ID do usuário criador');
    }
  }

  /**
   * Valida eventos do webhook
   */
  private static validateEvents(events: NotionWebhookEvent[]): void {
    this.validateArray(events, 'Eventos');

    const validEvents = [
      'page_created',
      'page_updated',
      'page_deleted',
      'database_created',
      'database_updated',
      'database_deleted',
      'block_created',
      'block_updated',
      'block_deleted',
      'comment_created',
      'comment_deleted'
    ];

    events.forEach((event, index) => {
      if (!validEvents.includes(event)) {
        this.throwValidationError(`Evento inválido no índice ${index}: ${event}`);
      }
    });
  }

  /**
   * Valida parâmetros de criação de webhook
   */
  static validateCreateParams(params: { url: string; events: NotionWebhookEvent[] }): void {
    this.validateUrl(params.url, 'URL do webhook');
    this.validateEvents(params.events);
  }

  /**
   * Valida parâmetros de atualização de webhook
   */
  static validateUpdateParams(webhookId: string, params: {
    url?: string;
    active?: boolean;
    events?: NotionWebhookEvent[];
  }): void {
    this.validateId(webhookId, 'ID do webhook');

    if (params.url !== undefined) {
      this.validateUrl(params.url, 'URL do webhook');
    }

    if (params.active !== undefined) {
      this.validateBoolean(params.active, 'Status do webhook');
    }

    if (params.events !== undefined) {
      this.validateEvents(params.events);
    }
  }
}
