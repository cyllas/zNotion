import { WebhookService } from '../../services/WebhookService';
import { NotionError } from '../../errors/NotionError';
import { createMockClient, MockedClient } from '../mocks/NotionClientMock';

describe('WebhookService', () => {
  let service: WebhookService;
  let mockClient: MockedClient;

  beforeEach(() => {
    mockClient = createMockClient();
    service = new WebhookService(mockClient);
  });

  describe('listWebhooks', () => {
    it('deve listar webhooks com sucesso', async () => {
      const mockResponse = {
        results: [{
          id: 'webhook-123',
          url: 'https://test.com/webhook',
          active: true,
          events: ['page_updated'],
          created_time: '2024-01-01T00:00:00.000Z',
          last_success_time: '2024-01-01T00:00:00.000Z',
          last_failure_time: null,
          secret: 'test-secret'
        }]
      };

      mockClient.request.mockResolvedValueOnce(mockResponse);

      const result = await service.listWebhooks();

      expect(result).toEqual([{
        id: 'webhook-123',
        url: 'https://test.com/webhook',
        active: true,
        events: ['page_updated'],
        createdAt: '2024-01-01T00:00:00.000Z',
        lastSuccessAt: '2024-01-01T00:00:00.000Z',
        lastFailureAt: null,
        secret: 'test-secret'
      }]);
    });

    it('deve lançar NotionError quando falhar ao listar webhooks', async () => {
      const error = new Error('Failed to list webhooks');
      mockClient.request.mockRejectedValueOnce(error);

      await expect(service.listWebhooks()).rejects.toThrow(NotionError);
    });
  });

  describe('createWebhook', () => {
    it('deve criar um webhook com sucesso', async () => {
      const mockResponse = {
        id: 'webhook-123',
        url: 'https://test.com/webhook',
        active: true,
        events: ['page_updated'],
        created_time: '2024-01-01T00:00:00.000Z',
        last_success_time: null,
        last_failure_time: null,
        secret: 'test-secret'
      };

      mockClient.request.mockResolvedValueOnce(mockResponse);

      const config = {
        url: 'https://test.com/webhook',
        pageId: 'page-123',
        events: ['page_updated']
      };

      const result = await service.createWebhook(config);

      expect(result).toEqual({
        id: 'webhook-123',
        url: 'https://test.com/webhook',
        active: true,
        events: ['page_updated'],
        createdAt: '2024-01-01T00:00:00.000Z',
        lastSuccessAt: null,
        lastFailureAt: null,
        secret: 'test-secret'
      });
    });

    it('deve lançar NotionError quando falhar ao criar webhook', async () => {
      const error = new Error('Failed to create webhook');
      mockClient.request.mockRejectedValueOnce(error);

      const config = {
        url: 'https://test.com/webhook',
        pageId: 'page-123',
        events: ['page_updated']
      };

      await expect(service.createWebhook(config)).rejects.toThrow(NotionError);
    });
  });

  describe('updateWebhook', () => {
    it('deve atualizar um webhook com sucesso', async () => {
      const mockResponse = {
        id: 'webhook-123',
        url: 'https://test.com/webhook-updated',
        active: true,
        events: ['page_updated', 'page_deleted'],
        created_time: '2024-01-01T00:00:00.000Z',
        last_success_time: '2024-01-01T00:00:00.000Z',
        last_failure_time: null,
        secret: 'test-secret'
      };

      mockClient.request.mockResolvedValueOnce(mockResponse);

      const webhookId = 'webhook-123';
      const config = {
        url: 'https://test.com/webhook-updated',
        pageId: 'page-123',
        events: ['page_updated', 'page_deleted']
      };

      const result = await service.updateWebhook(webhookId, config);

      expect(result).toEqual({
        id: 'webhook-123',
        url: 'https://test.com/webhook-updated',
        active: true,
        events: ['page_updated', 'page_deleted'],
        createdAt: '2024-01-01T00:00:00.000Z',
        lastSuccessAt: '2024-01-01T00:00:00.000Z',
        lastFailureAt: null,
        secret: 'test-secret'
      });
    });

    it('deve lançar NotionError quando falhar ao atualizar webhook', async () => {
      const error = new Error('Failed to update webhook');
      mockClient.request.mockRejectedValueOnce(error);

      const webhookId = 'webhook-123';
      const config = {
        url: 'https://test.com/webhook-updated',
        pageId: 'page-123',
        events: ['page_updated', 'page_deleted']
      };

      await expect(service.updateWebhook(webhookId, config)).rejects.toThrow(NotionError);
    });
  });

  describe('deleteWebhook', () => {
    it('deve deletar um webhook com sucesso', async () => {
      mockClient.request.mockResolvedValueOnce(undefined);

      await expect(service.deleteWebhook('webhook-123')).resolves.toBeUndefined();
    });

    it('deve lançar NotionError quando falhar ao deletar webhook', async () => {
      const error = new Error('Failed to delete webhook');
      mockClient.request.mockRejectedValueOnce(error);

      await expect(service.deleteWebhook('webhook-123')).rejects.toThrow(NotionError);
    });
  });

  describe('getWebhook', () => {
    it('deve obter um webhook com sucesso', async () => {
      const mockResponse = {
        id: 'webhook-123',
        url: 'https://test.com/webhook',
        active: true,
        events: ['page_updated'],
        created_time: '2024-01-01T00:00:00.000Z',
        last_success_time: '2024-01-01T00:00:00.000Z',
        last_failure_time: null,
        secret: 'test-secret'
      };

      mockClient.request.mockResolvedValueOnce(mockResponse);

      const webhookId = 'webhook-123';
      const result = await service.getWebhook(webhookId);

      expect(result).toEqual({
        id: 'webhook-123',
        url: 'https://test.com/webhook',
        active: true,
        events: ['page_updated'],
        createdAt: '2024-01-01T00:00:00.000Z',
        lastSuccessAt: '2024-01-01T00:00:00.000Z',
        lastFailureAt: null,
        secret: 'test-secret'
      });
    });

    it('deve lançar NotionError quando falhar ao obter webhook', async () => {
      const error = new Error('Failed to get webhook');
      mockClient.request.mockRejectedValueOnce(error);

      const webhookId = 'webhook-123';
      await expect(service.getWebhook(webhookId)).rejects.toThrow(NotionError);
    });
  });
});
