import { Client } from '@notionhq/client';
import { WebhookService } from './WebhookService';
import { CommentService } from './CommentService';
import { IWebhookConfig, IWebhookResponse } from '../interfaces/INotionWebhook';
import { INotionComment, IDiscussion } from '../interfaces/INotionComment';
import { RetryHandler, RetryConfig } from '../utils/RetryHandler';
import { PaginationHandler, PaginationOptions } from '../utils/PaginationHandler';

export class NotionService {
  private webhookService: WebhookService;
  private commentService: CommentService;
  private retryHandler: RetryHandler;

  constructor(
    private readonly client: Client = new Client({
      auth: process.env.NOTION_API_KEY,
      notionVersion: process.env.NOTION_VERSION || '2022-06-28',
    }),
    retryConfig?: RetryConfig
  ) {
    this.webhookService = new WebhookService(client);
    this.commentService = new CommentService(client);
    this.retryHandler = new RetryHandler(retryConfig);
  }

  /**
   * Lista todas as páginas com paginação automática
   */
  async listAllPages(options?: PaginationOptions): Promise<any[]> {
    return PaginationHandler.getAllResults(
      async (pageSize, startCursor) => {
        return this.retryHandler.execute(() =>
          this.client.search({
            page_size: pageSize,
            start_cursor: startCursor,
            filter: { property: 'object', value: 'page' }
          })
        );
      },
      options
    );
  }

  /**
   * Lista todas as páginas usando um iterador para processamento em lote
   */
  async *listPagesIterator(options?: PaginationOptions): AsyncGenerator<any[], void, unknown> {
    yield* PaginationHandler.getPageIterator(
      async (pageSize, startCursor) => {
        return this.retryHandler.execute(() =>
          this.client.search({
            page_size: pageSize,
            start_cursor: startCursor,
            filter: { property: 'object', value: 'page' }
          })
        );
      },
      options
    );
  }

  /**
   * Lista todos os bancos de dados com paginação automática
   */
  async listAllDatabases(options?: PaginationOptions): Promise<any[]> {
    return PaginationHandler.getAllResults(
      async (pageSize, startCursor) => {
        return this.retryHandler.execute(() =>
          this.client.search({
            page_size: pageSize,
            start_cursor: startCursor,
            filter: { property: 'object', value: 'database' }
          })
        );
      },
      options
    );
  }

  /**
   * Lista todos os bancos de dados usando um iterador para processamento em lote
   */
  async *listDatabasesIterator(options?: PaginationOptions): AsyncGenerator<any[], void, unknown> {
    yield* PaginationHandler.getPageIterator(
      async (pageSize, startCursor) => {
        return this.retryHandler.execute(() =>
          this.client.search({
            page_size: pageSize,
            start_cursor: startCursor,
            filter: { property: 'object', value: 'database' }
          })
        );
      },
      options
    );
  }

  /**
   * Consulta um banco de dados com paginação automática
   */
  async queryDatabaseAll(
    databaseId: string,
    query: any,
    options?: PaginationOptions
  ): Promise<any[]> {
    return PaginationHandler.getAllResults(
      async (pageSize, startCursor) => {
        return this.retryHandler.execute(() =>
          this.client.databases.query({
            database_id: databaseId,
            ...query,
            page_size: pageSize,
            start_cursor: startCursor
          })
        );
      },
      options
    );
  }

  /**
   * Consulta um banco de dados usando um iterador para processamento em lote
   */
  async *queryDatabaseIterator(
    databaseId: string,
    query: any,
    options?: PaginationOptions
  ): AsyncGenerator<any[], void, unknown> {
    yield* PaginationHandler.getPageIterator(
      async (pageSize, startCursor) => {
        return this.retryHandler.execute(() =>
          this.client.databases.query({
            database_id: databaseId,
            ...query,
            page_size: pageSize,
            start_cursor: startCursor
          })
        );
      },
      options
    );
  }

  /**
   * Lista todos os blocos de uma página com paginação automática
   */
  async listAllBlocks(
    blockId: string,
    options?: PaginationOptions
  ): Promise<any[]> {
    return PaginationHandler.getAllResults(
      async (pageSize, startCursor) => {
        return this.retryHandler.execute(() =>
          this.client.blocks.children.list({
            block_id: blockId,
            page_size: pageSize,
            start_cursor: startCursor
          })
        );
      },
      options
    );
  }

  /**
   * Lista todos os blocos de uma página usando um iterador para processamento em lote
   */
  async *listBlocksIterator(
    blockId: string,
    options?: PaginationOptions
  ): AsyncGenerator<any[], void, unknown> {
    yield* PaginationHandler.getPageIterator(
      async (pageSize, startCursor) => {
        return this.retryHandler.execute(() =>
          this.client.blocks.children.list({
            block_id: blockId,
            page_size: pageSize,
            start_cursor: startCursor
          })
        );
      },
      options
    );
  }

  // Métodos existentes com retry mechanism
  async createPage(params: any): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.pages.create(params)
    );
  }

  async updatePage(pageId: string, params: any): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.pages.update({
        page_id: pageId,
        ...params
      })
    );
  }

  async getPage(pageId: string): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.pages.retrieve({ page_id: pageId })
    );
  }

  async listPages(params?: any): Promise<any[]> {
    return this.retryHandler.execute(() =>
      this.client.search({
        ...params,
        filter: {
          ...params?.filter,
          property: 'object',
          value: 'page'
        }
      })
    );
  }

  async archivePage(pageId: string): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.pages.update({
        page_id: pageId,
        archived: true
      })
    );
  }

  async listDatabases(params?: any): Promise<any[]> {
    return this.retryHandler.execute(() =>
      this.client.search({
        ...params,
        filter: {
          ...params?.filter,
          property: 'object',
          value: 'database'
        }
      })
    );
  }

  async getDatabase(databaseId: string): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.databases.retrieve({
        database_id: databaseId
      })
    );
  }

  async queryDatabase(databaseId: string, params?: any): Promise<any[]> {
    return this.retryHandler.execute(() =>
      this.client.databases.query({
        database_id: databaseId,
        ...params
      })
    );
  }

  async createDatabase(params: any): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.databases.create(params)
    );
  }

  async updateDatabase(databaseId: string, params: any): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.databases.update({
        database_id: databaseId,
        ...params
      })
    );
  }

  async listBlocks(params?: any): Promise<any[]> {
    return this.retryHandler.execute(() =>
      this.client.search({
        ...params,
        filter: {
          ...params?.filter,
          property: 'object',
          value: 'block'
        }
      })
    );
  }

  async getBlock(blockId: string): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.blocks.retrieve({
        block_id: blockId
      })
    );
  }

  async updateBlock(blockId: string, params: any): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.blocks.update({
        block_id: blockId,
        ...params
      })
    );
  }

  async deleteBlock(blockId: string): Promise<any> {
    return this.retryHandler.execute(() =>
      this.client.blocks.delete({
        block_id: blockId
      })
    );
  }

  async getBlockChildren(blockId: string): Promise<any[]> {
    return this.retryHandler.execute(() =>
      this.client.blocks.children.list({
        block_id: blockId
      })
    );
  }

  // Webhooks com retry
  async createWebhook(config: IWebhookConfig): Promise<IWebhookResponse> {
    return this.retryHandler.execute(() =>
      this.webhookService.createWebhook(config)
    );
  }

  async listWebhooks(): Promise<IWebhookResponse[]> {
    return this.retryHandler.execute(() =>
      this.webhookService.listWebhooks()
    );
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    return this.retryHandler.execute(() =>
      this.webhookService.deleteWebhook(webhookId)
    );
  }

  async updateWebhook(
    webhookId: string,
    config: Partial<IWebhookConfig>
  ): Promise<IWebhookResponse> {
    return this.retryHandler.execute(() =>
      this.webhookService.updateWebhook(webhookId, config)
    );
  }

  async validateWebhookSignature(
    signature: string,
    body: string,
    secret: string
  ): Promise<boolean> {
    return this.retryHandler.execute(() =>
      this.webhookService.validateWebhookSignature(signature, body, secret)
    );
  }

  // Comentários com retry
  async createComment(
    parentId: string,
    content: string,
    discussionId?: string,
    mentions?: Array<{ id: string; type: 'user' | 'page' | 'database' }>
  ): Promise<INotionComment> {
    return this.retryHandler.execute(() =>
      this.commentService.createComment(parentId, content, discussionId, mentions)
    );
  }

  async getComment(commentId: string): Promise<INotionComment> {
    return this.retryHandler.execute(() =>
      this.commentService.getComment(commentId)
    );
  }

  async updateComment(
    commentId: string,
    content: string,
    mentions?: Array<{ id: string; type: 'user' | 'page' | 'database' }>
  ): Promise<INotionComment> {
    return this.retryHandler.execute(() =>
      this.commentService.updateComment(commentId, content, mentions)
    );
  }

  async deleteComment(commentId: string): Promise<void> {
    return this.retryHandler.execute(() =>
      this.commentService.deleteComment(commentId)
    );
  }

  // Discussões com retry
  async createDiscussion(
    parentId: string,
    title?: string,
    initialComment?: string
  ): Promise<IDiscussion> {
    return this.retryHandler.execute(() =>
      this.commentService.createDiscussion(parentId, title, initialComment)
    );
  }

  async getDiscussion(discussionId: string): Promise<IDiscussion> {
    return this.retryHandler.execute(() =>
      this.commentService.getDiscussion(discussionId)
    );
  }

  async listDiscussions(
    parentId: string,
    options?: {
      page_size?: number;
      start_cursor?: string;
    }
  ): Promise<{
    discussions: IDiscussion[];
    has_more: boolean;
    next_cursor: string | null;
  }> {
    return this.retryHandler.execute(() =>
      this.commentService.listDiscussions(parentId, options)
    );
  }

  async updateDiscussion(
    discussionId: string,
    title: string
  ): Promise<IDiscussion> {
    return this.retryHandler.execute(() =>
      this.commentService.updateDiscussion(discussionId, title)
    );
  }

  async deleteDiscussion(discussionId: string): Promise<void> {
    return this.retryHandler.execute(() =>
      this.commentService.deleteDiscussion(discussionId)
    );
  }
}
