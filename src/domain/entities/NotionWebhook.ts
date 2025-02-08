import { NotionUser } from '../../services/notion/types/NotionTypes';

/**
 * Representa um webhook no Notion
 */
export interface NotionWebhook {
  /**
   * ID único do webhook
   */
  id: string;

  /**
   * URL do endpoint que receberá as notificações
   */
  url: string;

  /**
   * Lista de eventos que o webhook irá monitorar
   */
  events: string[];

  /**
   * Indica se o webhook está ativo
   */
  active: boolean;

  /**
   * Data de criação
   */
  createdTime: Date;

  /**
   * Data do último sucesso
   */
  lastSuccessTime: Date | null;

  /**
   * Data da última falha
   */
  lastFailureTime: Date | null;

  /**
   * Usuário que criou o webhook
   */
  createdBy: NotionUser;
}
