import { WebhookService } from '../../services/WebhookService';
import { NotionError } from '../../utils/NotionError';
import crypto from 'crypto';

describe('WebhookService', () => {
  let webhookService: WebhookService;
  const mockSecret = 'test-secret';
  const mockBody = JSON.stringify({ test: 'data' });
  
  beforeEach(() => {
    webhookService = new WebhookService();
  });

  describe('validateWebhookSignature', () => {
    it('deve validar uma assinatura válida', () => {
      const timestamp = Date.now().toString();
      const signatureHeader = generateValidSignature(timestamp, mockBody, mockSecret);

      const isValid = webhookService.validateWebhookSignature(
        signatureHeader,
        mockBody,
        mockSecret
      );

      expect(isValid).toBe(true);
    });

    it('deve rejeitar uma assinatura inválida', () => {
      const invalidSignature = 'v0=invalid_signature';

      const isValid = webhookService.validateWebhookSignature(
        invalidSignature,
        mockBody,
        mockSecret
      );

      expect(isValid).toBe(false);
    });

    it('deve rejeitar uma assinatura com formato inválido', () => {
      const invalidSignature = 'invalid_format';

      const isValid = webhookService.validateWebhookSignature(
        invalidSignature,
        mockBody,
        mockSecret
      );

      expect(isValid).toBe(false);
    });

    it('deve rejeitar uma assinatura com timestamp expirado', () => {
      const oldTimestamp = (Date.now() - 1000 * 60 * 6).toString(); // 6 minutos atrás
      const signatureHeader = generateValidSignature(oldTimestamp, mockBody, mockSecret);

      const isValid = webhookService.validateWebhookSignature(
        signatureHeader,
        mockBody,
        mockSecret
      );

      expect(isValid).toBe(false);
    });
  });
});

// Função auxiliar para gerar assinaturas válidas para teste
function generateValidSignature(timestamp: string, body: string, secret: string): string {
  const signatureData = timestamp + '.' + body;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signatureData)
    .digest('hex');
  return `v0=${timestamp}.${signature}`;
