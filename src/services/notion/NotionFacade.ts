import { Client } from '@notionhq/client';
import { AppendBlockChildrenParameters, SearchParameters } from '@notionhq/client/build/src/api-endpoints';
import { NotionBlock } from '../../domain/entities/NotionBlock';
import { NotionComment } from '../../domain/entities/NotionComment';
import { NotionDatabase } from '../../domain/entities/NotionDatabase';
import { NotionPage } from '../../domain/entities/NotionPage';
import { NotionUser } from '../../domain/entities/NotionUser';
import { NotionBlockService } from './NotionBlockService';
import { NotionCommentService } from './NotionCommentService';
import { NotionDatabaseService } from './NotionDatabaseService';
import { NotionPageService } from './NotionPageService';
import { NotionSearchService } from './NotionSearchService';
import { NotionUserService } from './NotionUserService';
import { NotionConfig } from '../../config/NotionConfig';
import { CreateCommentParams, NotionCommentParent } from './types/NotionCommentTypes';
import { NotionPropertyFilter, NotionSort } from './types/NotionTypes';

/**
 * Fachada para os serviços do Notion
 * Fornece uma interface unificada para todos os serviços
 */
export class NotionFacade {
  private readonly client: Client;
  private readonly blockService: NotionBlockService;
  private readonly commentService: NotionCommentService;
  private readonly databaseService: NotionDatabaseService;
  private readonly pageService: NotionPageService;
  private readonly searchService: NotionSearchService;
  private readonly userService: NotionUserService;

  constructor(config: NotionConfig) {
    this.client = new Client({ auth: config.apiKey });

    this.blockService = new NotionBlockService(this.client);
    this.commentService = new NotionCommentService(this.client);
    this.databaseService = new NotionDatabaseService(this.client);
    this.pageService = new NotionPageService(this.client);
    this.searchService = new NotionSearchService(this.client);
    this.userService = new NotionUserService(this.client);
  }

  /**
   * Serviços para manipulação de blocos
   */
  get blocks() {
    return {
      append: (blockId: string, children: AppendBlockChildrenParameters['children']) => 
        this.blockService.appendBlocks(blockId, children),
      getChildren: (blockId: string) => 
        this.blockService.getBlockChildren(blockId)
    };
  }

  /**
   * Serviços para manipulação de comentários
   */
  get comments() {
    return {
      create: (params: CreateCommentParams) => 
        this.commentService.createComment(params),
      list: (parent: NotionCommentParent) => 
        this.commentService.listComments(parent)
    };
  }

  /**
   * Serviços para manipulação de bancos de dados
   */
  get databases() {
    return {
      query: (databaseId: string, params?: {
        filter?: NotionPropertyFilter;
        sorts?: NotionSort[];
      }) => 
        this.databaseService.queryDatabase({
          databaseId,
          filter: params?.filter,
          sorts: params?.sorts
        }),
      get: (databaseId: string) => 
        this.databaseService.getDatabase(databaseId)
    };
  }

  /**
   * Serviços para manipulação de páginas
   */
  get pages() {
    return {
      create: (params: Parameters<NotionPageService['createPage']>[0]) => 
        this.pageService.createPage(params),
      update: (pageId: string, params: Parameters<NotionPageService['updatePage']>[1]) => 
        this.pageService.updatePage(pageId, params),
      get: (pageId: string) => 
        this.pageService.getPage(pageId),
      archive: (pageId: string, archive: boolean) => 
        this.pageService.archivePage(pageId, archive)
    };
  }

  /**
   * Serviços para busca
   */
  get search() {
    return {
      search: (query: string, params?: {
        filter?: SearchParameters['filter'];
        sort?: SearchParameters['sort'];
        startCursor?: string;
        pageSize?: number;
      }) => 
        this.searchService.search({
          query,
          filter: params?.filter,
          sort: params?.sort,
          startCursor: params?.startCursor,
          pageSize: params?.pageSize
        })
    };
  }

  /**
   * Serviços para manipulação de usuários
   */
  get users() {
    return {
      list: () => this.userService.listUsers(),
      get: (userId: string) => this.userService.getUser(userId),
      me: () => this.userService.getMe()
    };
  }
}
