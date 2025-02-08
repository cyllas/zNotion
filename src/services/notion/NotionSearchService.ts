import { Client } from '@notionhq/client';
import { SearchParameters } from '@notionhq/client/build/src/api-endpoints';
import { NotionPage } from '../../domain/entities/NotionPage';
import { NotionDatabase } from '../../domain/entities/NotionDatabase';
import { PageAdapter } from './adapters/PageAdapter';
import { DatabaseAdapter } from './adapters/DatabaseAdapter';
import { ValidationUtils } from './utils/ValidationUtils';
import { NotionErrors } from './errors/NotionErrors';

/**
 * Serviço para busca no Notion
 */
export class NotionSearchService {
  private readonly pageAdapter: PageAdapter;
  private readonly databaseAdapter: DatabaseAdapter;

  constructor(private readonly client: Client) {
    this.pageAdapter = new PageAdapter();
    this.databaseAdapter = new DatabaseAdapter();
  }

  /**
   * Realiza uma busca no Notion
   */
  async search(params: {
    query?: string;
    filter?: SearchParameters['filter'];
    sort?: SearchParameters['sort'];
    startCursor?: string;
    pageSize?: number;
  }): Promise<{
    items: (NotionPage | NotionDatabase)[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      if (params.pageSize || params.startCursor) {
        ValidationUtils.validatePagination(params.pageSize, params.startCursor);
      }

      const response = await this.client.search({
        query: params.query,
        filter: params.filter,
        sort: params.sort,
        start_cursor: params.startCursor,
        page_size: params.pageSize
      });

      return {
        items: response.results.map(item => {
          if (item.object === 'page') {
            return this.pageAdapter.adapt(item);
          }
          if (item.object === 'database') {
            return this.databaseAdapter.adapt(item);
          }
          throw new Error(`Tipo de objeto não suportado: ${item.object}`);
        }),
        nextCursor: response.next_cursor,
        hasMore: response.has_more
      };
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Busca páginas no Notion
   */
  async searchPages(params: {
    query?: string;
    sort?: SearchParameters['sort'];
    startCursor?: string;
    pageSize?: number;
  }): Promise<{
    pages: NotionPage[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      const { items, nextCursor, hasMore } = await this.search({
        ...params,
        filter: { property: 'object', value: 'page' }
      });

      return {
        pages: items.filter((item): item is NotionPage => 'properties' in item),
        nextCursor,
        hasMore
      };
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Busca bancos de dados no Notion
   */
  async searchDatabases(params: {
    query?: string;
    sort?: SearchParameters['sort'];
    startCursor?: string;
    pageSize?: number;
  }): Promise<{
    databases: NotionDatabase[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      const { items, nextCursor, hasMore } = await this.search({
        ...params,
        filter: { property: 'object', value: 'database' }
      });

      return {
        databases: items.filter((item): item is NotionDatabase => !('properties' in item)),
        nextCursor,
        hasMore
      };
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }
}
