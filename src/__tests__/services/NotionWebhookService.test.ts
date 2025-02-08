import { NotionClientMock } from '../mocks/NotionClientMock';
import { WebhookService } from '../../services/WebhookService';
import { IWebhookConfig } from '../../interfaces/IWebhookService';
import { createHmac } from 'crypto';

describe('WebhookService', () => {
  const mockNotionClient = NotionClientMock.createMock();
  let webhookService: WebhookService;

  beforeEach(() => {
    jest.clearAllMocks();
    webhookService = new WebhookService(mockNotionClient);
  });

  describe('createWebhook', () => {
    it('deve criar um webhook corretamente', async () => {
      const mockResponse = {
        id: 'webhook-1',
        url: 'https://example.com/webhook',
        active: true,
        events: ['page', 'comment'] as const,
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-01T00:00:00.000Z'
      };

      mockNotionClient.request.mockResolvedValueOnce(mockResponse);

      const config: IWebhookConfig = {
        url: 'https://example.com/webhook',
        pageId: 'page-1',
        events: ['page', 'comment']
      };

      const response = await webhookService.createWebhook(config);

      expect(response).toEqual({
        id: mockResponse.id,
        url: mockResponse.url,
        active: mockResponse.active,
        pageId: config.pageId,
        events: config.events,
        createdAt: mockResponse.created_time,
        updatedAt: mockResponse.last_edited_time
      });

      expect(mockNotionClient.request).toHaveBeenCalledWith({
        path: 'webhooks',
        method: 'post',
        body: {
          url: config.url,
          page_id: config.pageId,
          events: config.events
        }
      });
    });

    it('deve propagar erros ao criar webhook', async () => {
      const mockError = new Error('Failed to create webhook');
      const errorMock = NotionClientMock.createErrorMock(mockError);
      const errorWebhookService = new WebhookService(errorMock);

      const config: IWebhookConfig = {
        url: 'https://example.com/webhook',
        pageId: 'page-1',
        events: ['page']
      };

      await expect(errorWebhookService.createWebhook(config))
        .rejects
        .toThrow(mockError);
    });
  });

  describe('listWebhooks', () => {
    it('deve listar webhooks corretamente', async () => {
      const mockResponse = {
        results: [
          {
            id: 'webhook-1',
            url: 'https://example.com/webhook1',
            active: true,
            events: ['page'] as const,
            created_time: '2023-01-01T00:00:00.000Z',
            last_edited_time: '2023-01-01T00:00:00.000Z'
          },
          {
            id: 'webhook-2',
            url: 'https://example.com/webhook2',
            active: false,
            events: ['comment', 'discussion'] as const,
            created_time: '2023-01-02T00:00:00.000Z',
            last_edited_time: '2023-01-02T00:00:00.000Z'
          }
        ]
      };

      mockNotionClient.request.mockResolvedValueOnce(mockResponse);

      const response = await webhookService.listWebhooks();

      expect(response).toEqual(mockResponse.results.map(webhook => ({
        id: webhook.id,
        url: webhook.url,
        active: webhook.active,
        events: webhook.events,
        createdAt: webhook.created_time,
        updatedAt: webhook.last_edited_time
      })));

      expect(mockNotionClient.request).toHaveBeenCalledWith({
        path: 'webhooks',
        method: 'get'
      });
    });

    it('deve propagar erros ao listar webhooks', async () => {
      const mockError = new Error('Failed to list webhooks');
      const errorMock = NotionClientMock.createErrorMock(mockError);
      const errorWebhookService = new WebhookService(errorMock);

      await expect(errorWebhookService.listWebhooks())
        .rejects
        .toThrow(mockError);
    });
  });

  describe('deleteWebhook', () => {
    it('deve deletar um webhook corretamente', async () => {
      mockNotionClient.request.mockResolvedValueOnce({});

      await webhookService.deleteWebhook('webhook-1');

      expect(mockNotionClient.request).toHaveBeenCalledWith({
        path: 'webhooks/webhook-1',
        method: 'delete'
      });
    });

    it('deve propagar erros ao deletar webhook', async () => {
      const mockError = new Error('Failed to delete webhook');
      const errorMock = NotionClientMock.createErrorMock(mockError);
      const errorWebhookService = new WebhookService(errorMock);

      await expect(errorWebhookService.deleteWebhook('webhook-1'))
        .rejects
        .toThrow(mockError);
    });
  });

  describe('updateWebhook', () => {
    it('deve atualizar um webhook corretamente', async () => {
      const mockResponse = {
        id: 'webhook-1',
        url: 'https://example.com/webhook-updated',
        active: true,
        events: ['page', 'database'] as const,
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-03T00:00:00.000Z'
      };

      mockNotionClient.request.mockResolvedValueOnce(mockResponse);

      const config: IWebhookConfig = {
        url: 'https://example.com/webhook-updated',
        pageId: 'page-2',
        events: ['page', 'database']
      };

      const response = await webhookService.updateWebhook('webhook-1', config);

      expect(response).toEqual({
        id: mockResponse.id,
        url: mockResponse.url,
        active: mockResponse.active,
        pageId: config.pageId,
        events: config.events,
        createdAt: mockResponse.created_time,
        updatedAt: mockResponse.last_edited_time
      });

      expect(mockNotionClient.request).toHaveBeenCalledWith({
        path: 'webhooks/webhook-1',
        method: 'patch',
        body: {
          url: config.url,
          page_id: config.pageId,
          events: config.events
        }
      });
    });

    it('deve propagar erros ao atualizar webhook', async () => {
      const mockError = new Error('Failed to update webhook');
      const errorMock = NotionClientMock.createErrorMock(mockError);
      const errorWebhookService = new WebhookService(errorMock);

      const config: IWebhookConfig = {
        url: 'https://example.com/webhook-updated',
        pageId: 'page-2',
        events: ['page']
      };

      await expect(errorWebhookService.updateWebhook('webhook-1', config))
        .rejects
        .toThrow(mockError);
    });
  });

  describe('validateWebhookSignature', () => {
    it('deve validar a assinatura do webhook corretamente', async () => {
      const secret = 'test-secret';
      const body = JSON.stringify({ event: 'test' });
      const signature = createHmac('sha256', secret)
        .update(body)
        .digest('hex');

      const isValid = await webhookService.validateWebhookSignature(signature, body, secret);

      expect(isValid).toBe(true);
    });

    it('deve rejeitar assinaturas inválidas', async () => {
      const secret = 'test-secret';
      const body = JSON.stringify({ event: 'test' });
      const signature = 'invalid-signature';

      const isValid = await webhookService.validateWebhookSignature(signature, body, secret);

      expect(isValid).toBe(false);
    });
  });
});
