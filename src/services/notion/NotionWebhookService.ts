import { Client } from '@notionhq/client';
import { WebhookResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionWebhook } from '../../domain/entities/NotionWebhook';
import { WebhookMapper } from './mappers/WebhookMapper';
import { ValidationUtils } from './utils/ValidationUtils';
import { NotionErrors } from './errors/NotionErrors';
import { NotionWebhookEvent } from './types/NotionTypes';

/**
 * Serviço para manipulação de webhooks no Notion
 */
export class NotionWebhookService {
  constructor(private readonly client: Client) {}

  /**
   * Cria um novo webhook
   */
  async createWebhook(params: {
    url: string;
    events: NotionWebhookEvent[];
  }): Promise<NotionWebhook> {
    try {
      ValidationUtils.validateUrl(params.url);
      ValidationUtils.validateWebhookEvents(params.events);

      const response = await this.client.webhooks.create({
        url: params.url,
        events: params.events
      });

      return WebhookMapper.toDomain(response as WebhookResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Atualiza um webhook existente
   */
  async updateWebhook(webhookId: string, params: {
    url?: string;
    active?: boolean;
    events?: NotionWebhookEvent[];
  }): Promise<NotionWebhook> {
    try {
      ValidationUtils.validateId(webhookId);
      if (params.url) ValidationUtils.validateUrl(params.url);
      if (params.events) ValidationUtils.validateWebhookEvents(params.events);

      const response = await this.client.webhooks.update({
        webhook_id: webhookId,
        url: params.url,
        active: params.active,
        events: params.events
      });

      return WebhookMapper.toDomain(response as WebhookResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Recupera um webhook pelo ID
   */
  async getWebhook(webhookId: string): Promise<NotionWebhook> {
    try {
      ValidationUtils.validateId(webhookId);

      const response = await this.client.webhooks.retrieve({
        webhook_id: webhookId
      });

      return WebhookMapper.toDomain(response as WebhookResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Lista todos os webhooks
   */
  async listWebhooks(params?: {
    startCursor?: string;
    pageSize?: number;
  }): Promise<{
    webhooks: NotionWebhook[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      const response = await this.client.webhooks.list({
        start_cursor: params?.startCursor,
        page_size: params?.pageSize
      });

      return {
        webhooks: response.results.map(webhook => 
          WebhookMapper.toDomain(webhook as WebhookResponse)
        ),
        nextCursor: response.next_cursor,
        hasMore: response.has_more
      };
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Remove um webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    try {
      ValidationUtils.validateId(webhookId);

      await this.client.webhooks.delete({
        webhook_id: webhookId
      });
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }
}
