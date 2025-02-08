import { Client } from '@notionhq/client';
import { NotionCommentService } from '../services/notion/NotionCommentService';
import { NotionPageService } from '../services/notion/NotionPageService';
import { NotionDatabaseService } from '../services/notion/NotionDatabaseService';
import { NotionBlockService } from '../services/notion/NotionBlockService';
import { NotionWebhookService } from '../services/notion/NotionWebhookService';
import { NotionCollaborationFacade } from '../facades/NotionCollaborationFacade';
import { RetryConfig } from '../utils/RetryHandler';

/**
 * Factory para criar instâncias dos serviços do Notion
 */
export class NotionServiceFactory {
  private static instance: NotionServiceFactory;
  private client: Client;

  private constructor(apiKey: string) {
    this.client = new Client({
      auth: apiKey
    });
  }

  static initialize(apiKey: string): NotionServiceFactory {
    if (!NotionServiceFactory.instance) {
      NotionServiceFactory.instance = new NotionServiceFactory(apiKey);
    }
    return NotionServiceFactory.instance;
  }

  static getInstance(): NotionServiceFactory {
    if (!NotionServiceFactory.instance) {
      throw new Error('NotionServiceFactory não foi inicializado. Chame initialize() primeiro.');
    }
    return NotionServiceFactory.instance;
  }

  /**
   * Cria uma instância do serviço de comentários
   */
  createCommentService(retryConfig?: RetryConfig): NotionCommentService {
    return new NotionCommentService(this.client, retryConfig);
  }

  /**
   * Cria uma instância do serviço de páginas
   */
  createPageService(retryConfig?: RetryConfig): NotionPageService {
    return new NotionPageService(this.client, retryConfig);
  }

  /**
   * Cria uma instância do serviço de bancos de dados
   */
  createDatabaseService(retryConfig?: RetryConfig): NotionDatabaseService {
    return new NotionDatabaseService(this.client, retryConfig);
  }

  /**
   * Cria uma instância do serviço de blocos
   */
  createBlockService(retryConfig?: RetryConfig): NotionBlockService {
    return new NotionBlockService(this.client, retryConfig);
  }

  /**
   * Cria uma instância do serviço de webhooks
   */
  createWebhookService(retryConfig?: RetryConfig): NotionWebhookService {
    return new NotionWebhookService(this.client, retryConfig);
  }

  /**
   * Cria uma instância da fachada de colaboração
   */
  createCollaborationFacade(retryConfig?: RetryConfig): NotionCollaborationFacade {
    const commentService = this.createCommentService(retryConfig);
    return new NotionCollaborationFacade(commentService);
  }
}
