import { createHmac } from 'crypto';
import { Client } from '@notionhq/client';
import {
  IWebhookConfig,
  IWebhookResponse,
  IWebhookService,
  INotionWebhookPayload
} from '../interfaces/INotionWebhook';

export class WebhookService implements IWebhookService {
  constructor(private readonly client: Client) {}

  async createWebhook(config: IWebhookConfig): Promise<IWebhookResponse> {
    try {
      const response = await this.client.request({
        method: 'POST',
        path: 'webhooks',
        body: {
          url: config.url,
          events: config.events,
          secret: config.secret
        }
      });

      return response as IWebhookResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listWebhooks(): Promise<IWebhookResponse[]> {
    try {
      const response = await this.client.request({
        method: 'GET',
        path: 'webhooks'
      });

      return (response as { webhooks: IWebhookResponse[] }).webhooks;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    try {
      await this.client.request({
        method: 'DELETE',
        path: `webhooks/${webhookId}`
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateWebhook(
    webhookId: string,
    config: Partial<IWebhookConfig>
  ): Promise<IWebhookResponse> {
    try {
      const response = await this.client.request({
        method: 'PATCH',
        path: `webhooks/${webhookId}`,
        body: config
      });

      return response as IWebhookResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  validateWebhookSignature(
    signature: string,
    body: string,
    secret: string
  ): boolean {
    const hmac = createHmac('sha256', secret);
    const expectedSignature = hmac.update(body).digest('hex');
    return signature === expectedSignature;
  }

  private handleError(error: any): Error {
    if (error.status) {
      return new Error(`Notion API Error: ${error.message} (${error.status})`);
    }
    return new Error(`Webhook Service Error: ${error.message}`);
  }
}
