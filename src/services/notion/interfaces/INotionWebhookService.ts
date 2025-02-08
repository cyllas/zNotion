import { NotionWebhook } from '../../../domain/entities/NotionWebhook';
import { PaginationOptions } from '../../../utils/PaginationHandler';
import { CreateWebhookParams, UpdateWebhookParams } from '../types/ServiceParams';

/**
 * Interface para o serviço de webhooks do Notion
 */
export interface INotionWebhookService {
  /**
   * Cria um novo webhook
   * @param params Parâmetros para criação do webhook
   */
  createWebhook(params: CreateWebhookParams): Promise<NotionWebhook>;

  /**
   * Atualiza um webhook existente
   * @param webhookId ID do webhook
   * @param params Parâmetros para atualização
   */
  updateWebhook(webhookId: string, params: UpdateWebhookParams): Promise<NotionWebhook>;

  /**
   * Recupera um webhook pelo ID
   * @param webhookId ID do webhook
   */
  getWebhook(webhookId: string): Promise<NotionWebhook>;

  /**
   * Lista todos os webhooks com paginação
   * @param options Opções de paginação
   */
  listWebhooks(options?: PaginationOptions): Promise<NotionWebhook[]>;

  /**
   * Remove um webhook
   * @param webhookId ID do webhook
   */
  deleteWebhook(webhookId: string): Promise<void>;
}
