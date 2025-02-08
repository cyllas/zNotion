import { WebhookResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionWebhook } from '../../../domain/entities/NotionWebhook';
import { BaseMapper } from './BaseMapper';
import { NotionWebhookEvent } from '../types/NotionTypes';

/**
 * Mapper para conversão de webhooks do Notion
 */
export class WebhookMapper extends BaseMapper {
  /**
   * Converte uma resposta da API para nosso domínio
   */
  static toDomain(response: WebhookResponse): NotionWebhook {
    return {
      id: response.id,
      active: response.active,
      url: response.url,
      events: response.events as NotionWebhookEvent[],
      createdTime: this.mapTimestamp(response.created_time),
      lastSuccessTime: this.mapTimestamp(response.last_success_time),
      lastFailureTime: this.mapTimestamp(response.last_failure_time),
      createdBy: response.created_by
    };
  }

  /**
   * Converte um objeto do nosso domínio para o formato da API
   */
  static toApi(webhook: Partial<NotionWebhook>): Record<string, any> {
    return this.toApiFormat({
      url: webhook.url,
      active: webhook.active,
      events: webhook.events
    });
  }
}
