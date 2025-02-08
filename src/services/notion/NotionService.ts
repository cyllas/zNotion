import { Client } from '@notionhq/client';
import { 
  CommentObjectResponse,
  CreateCommentParameters,
  SearchParameters
} from '@notionhq/client/build/src/api-endpoints';
import { NotionBlockService } from './NotionBlockService';
import { NotionWebhookService } from './NotionWebhookService';
import { NotionCommentService } from './NotionCommentService';
import { NotionDatabaseService } from './NotionDatabaseService';
import { NotionPageService } from './NotionPageService';
import { NotionSearchService } from './NotionSearchService';
import { NotionUserService } from './NotionUserService';
import { 
  NotionComment, 
  NotionCommentParent, 
  CreateCommentParams,
  ListCommentsResponse 
} from './types/NotionCommentTypes';
import { NotionErrors } from './errors/NotionErrors';
import { NotionPropertyFilter, NotionSort } from './types/NotionTypes';
import { CommentAdapter } from './adapters/CommentAdapter';

/**
 * Serviço principal do Notion que coordena todos os outros serviços
 */
export class NotionService {
  private readonly client: Client;
  private readonly blockService: NotionBlockService;
  private readonly webhookService: NotionWebhookService;
  private readonly commentService: NotionCommentService;
  private readonly databaseService: NotionDatabaseService;
  private readonly pageService: NotionPageService;
  private readonly searchService: NotionSearchService;
  private readonly userService: NotionUserService;
  private readonly commentAdapter: CommentAdapter;

  constructor(authToken: string) {
    this.client = new Client({
      auth: authToken
    });

    this.blockService = new NotionBlockService(this.client);
    this.webhookService = new NotionWebhookService(this.client);
    this.commentService = new NotionCommentService(this.client);
    this.databaseService = new NotionDatabaseService(this.client);
    this.pageService = new NotionPageService(this.client);
    this.searchService = new NotionSearchService(this.client);
    this.userService = new NotionUserService(this.client);
    this.commentAdapter = new CommentAdapter();
  }

  /**
   * Cria um novo comentário
   */
  async createComment(params: CreateCommentParams): Promise<NotionComment> {
    try {
      return await this.commentService.createComment(params);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Lista os comentários de uma página ou bloco
   */
  async listComments(parent: NotionCommentParent): Promise<ListCommentsResponse> {
    try {
      return await this.commentService.listComments(parent);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Busca por páginas e bancos de dados
   */
  async search(params: {
    query: string;
    filter?: SearchParameters['filter'];
    sort?: SearchParameters['sort'];
    startCursor?: string;
    pageSize?: number;
  }): Promise<{
    items: Array<any>;
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      return await this.searchService.search(params);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Consulta um banco de dados
   */
  async queryDatabase(params: {
    databaseId: string;
    filter?: NotionPropertyFilter;
    sorts?: NotionSort[];
    startCursor?: string;
    pageSize?: number;
  }): Promise<{
    pages: any[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      return await this.databaseService.queryDatabase(params);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  // Getters para acesso aos serviços
  get blocks() {
    return this.blockService;
  }

  get webhooks() {
    return this.webhookService;
  }

  get comments() {
    return this.commentService;
  }

  get databases() {
    return this.databaseService;
  }

  get pages() {
    return this.pageService;
  }

  get search() {
    return this.searchService;
  }

  get users() {
    return this.userService;
  }
}
