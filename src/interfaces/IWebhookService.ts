import { Client } from '@notionhq/client';

/**
 * Configuração para criação/atualização de webhook
 */
export interface IWebhookConfig {
  /** URL que receberá as notificações do webhook */
  url: string;
  /** ID da página que será monitorada */
  pageId: string;
  /** Lista de eventos que serão monitorados */
  events: string[];
}

/**
 * Resposta da API do Notion para webhooks
 */
export interface IWebhookApiResponse {
  id: string;
  url: string;
  active: boolean;
  events: string[];
  created_time: string;
  last_success_time?: string | null;
  last_failure_time?: string | null;
  secret?: string;
}

/**
 * Resposta mapeada do webhook para uso na aplicação
 */
export interface IWebhookResponse {
  /** ID único do webhook */
  id: string;
  /** URL que recebe as notificações */
  url: string;
  /** Se o webhook está ativo */
  active: boolean;
  /** Lista de eventos monitorados */
  events: string[];
  /** Data de criação */
  createdAt: string;
  /** Data do último sucesso */
  lastSuccessAt?: string | null;
  /** Data da última falha */
  lastFailureAt?: string | null;
  /** Chave secreta para validação */
  secret?: string;
}

/**
 * Interface do serviço de webhooks
 */
export interface IWebhookService {
  /** Lista todos os webhooks */
  listWebhooks(): Promise<IWebhookResponse[]>;
  /** Cria um novo webhook */
  createWebhook(config: IWebhookConfig): Promise<IWebhookResponse>;
  /** Atualiza um webhook existente */
  updateWebhook(webhookId: string, config: IWebhookConfig): Promise<IWebhookResponse>;
  /** Remove um webhook */
  deleteWebhook(webhookId: string): Promise<void>;
  /** Obtém um webhook específico */
  getWebhook(webhookId: string): Promise<IWebhookResponse>;
  /** Valida a assinatura de um webhook */
  validateWebhookSignature(signature: string, body: string, secret: string): boolean;
}
