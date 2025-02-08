import { WebhookValidator } from '../WebhookValidator';
import { NotionWebhook, NotionWebhookEvent, NotionUser } from '../../types/NotionTypes';

describe('WebhookValidator', () => {
  const mockUser: NotionUser = {
    object: 'user',
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Usuário Teste',
    avatarUrl: 'https://example.com/avatar.jpg',
    type: 'person'
  };

  describe('validateWebhook', () => {
    const validWebhook: NotionWebhook = {
      id: 'test-id',
      name: 'Test Webhook',
      active: true,
      url: 'https://example.com/webhook',
      events: ['page.created', 'page.updated', 'page.deleted']
    };

    it('deve aceitar um webhook válido', () => {
      expect(() => WebhookValidator.validateWebhook(validWebhook)).not.toThrow();
    });

    it('deve aceitar um webhook com eventos mínimos', () => {
      const webhook = {
        ...validWebhook,
        events: ['page.created']
      };
      expect(() => WebhookValidator.validateWebhook(webhook)).not.toThrow();
    });

    it('deve aceitar um webhook com todos os eventos possíveis', () => {
      const webhook = {
        ...validWebhook,
        events: [
          'page.created',
          'page.updated',
          'page.deleted',
          'database.created',
          'database.updated',
          'database.deleted',
          'comment.created',
          'comment.updated',
          'comment.deleted'
        ]
      };
      expect(() => WebhookValidator.validateWebhook(webhook)).not.toThrow();
    });

    it('deve rejeitar um webhook sem id', () => {
      const webhook = {
        ...validWebhook,
        id: undefined
      };
      expect(() => WebhookValidator.validateWebhook(webhook)).toThrow();
    });

    it('deve rejeitar um webhook sem eventos', () => {
      const webhook = {
        ...validWebhook,
        events: undefined
      };
      expect(() => WebhookValidator.validateWebhook(webhook)).toThrow();
    });

    it('deve rejeitar um webhook com eventos inválidos', () => {
      const webhook = {
        ...validWebhook,
        events: ['invalid_event']
      };
      expect(() => WebhookValidator.validateWebhook(webhook)).toThrow();
    });
  });

  describe('validateCreateParams', () => {
    it('deve validar parâmetros de criação válidos', () => {
      const params = {
        url: 'https://example.com/webhook',
        events: ['page.created', 'page.updated'] as NotionWebhookEvent[]
      };

      expect(() => WebhookValidator.validateCreateParams(params)).not.toThrow();
    });

    it('deve rejeitar parâmetros sem URL', () => {
      const params: any = {
        events: ['page.created']
      };

      expect(() => WebhookValidator.validateCreateParams(params)).toThrow();
    });

    it('deve rejeitar parâmetros sem eventos', () => {
      const params: any = {
        url: 'https://example.com/webhook'
      };

      expect(() => WebhookValidator.validateCreateParams(params)).toThrow();
    });

    it('deve rejeitar parâmetros com URL inválida', () => {
      const params = {
        url: 'not-a-url',
        events: ['page.created'] as NotionWebhookEvent[]
      };

      expect(() => WebhookValidator.validateCreateParams(params)).toThrow();
    });

    it('deve rejeitar parâmetros com eventos inválidos', () => {
      const params = {
        url: 'https://example.com/webhook',
        events: ['invalid_event'] as NotionWebhookEvent[]
      };

      expect(() => WebhookValidator.validateCreateParams(params)).toThrow();
    });
  });

  describe('validateUpdateParams', () => {
    const webhookId = '123e4567-e89b-12d3-a456-426614174000';

    it('deve validar parâmetros de atualização válidos', () => {
      const params = {
        active: true,
        events: ['page.created', 'page.updated'] as NotionWebhookEvent[]
      };

      expect(() => WebhookValidator.validateUpdateParams(webhookId, params)).not.toThrow();
    });

    it('deve validar atualização parcial apenas com URL', () => {
      const params = {
        url: 'https://example.com/webhook'
      };

      expect(() => WebhookValidator.validateUpdateParams(webhookId, params)).not.toThrow();
    });

    it('deve validar atualização parcial apenas com status', () => {
      const params = {
        active: false
      };

      expect(() => WebhookValidator.validateUpdateParams(webhookId, params)).not.toThrow();
    });

    it('deve validar atualização parcial apenas com eventos', () => {
      const params = {
        events: ['page.created'] as NotionWebhookEvent[]
      };

      expect(() => WebhookValidator.validateUpdateParams(webhookId, params)).not.toThrow();
    });

    it('deve rejeitar ID de webhook inválido', () => {
      const params = {
        url: 'https://example.com/webhook'
      };

      expect(() => WebhookValidator.validateUpdateParams('invalid-id', params)).toThrow();
    });

    it('deve rejeitar URL inválida na atualização', () => {
      const params = {
        url: 'not-a-url'
      };

      expect(() => WebhookValidator.validateUpdateParams(webhookId, params)).toThrow();
    });

    it('deve rejeitar eventos inválidos na atualização', () => {
      const params = {
        events: ['invalid_event'] as NotionWebhookEvent[]
      };

      expect(() => WebhookValidator.validateUpdateParams(webhookId, params)).toThrow();
    });

    it('deve rejeitar parâmetros de atualização com eventos inválidos', () => {
      const params = {
        active: true,
        events: ['invalid_event'] as any[]
      };

      expect(() => WebhookValidator.validateUpdateParams(webhookId, params)).toThrow();
    });
  });
});
