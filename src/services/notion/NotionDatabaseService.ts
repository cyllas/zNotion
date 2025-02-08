import { Client } from '@notionhq/client';
import { 
  DatabaseObjectResponse,
  QueryDatabaseParameters,
  CreateDatabaseParameters,
  UpdateDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints';
import { NotionDatabase } from '../../domain/entities/NotionDatabase';
import { DatabaseAdapter } from './adapters/DatabaseAdapter';
import { ValidationUtils } from './utils/ValidationUtils';
import { NotionErrors } from './errors/NotionErrors';
import { NotionPropertyFilter, NotionSort } from './types/NotionTypes';

/**
 * Serviço para manipulação de bancos de dados no Notion
 */
export class NotionDatabaseService {
  private readonly databaseAdapter: DatabaseAdapter;

  constructor(private readonly client: Client) {
    this.databaseAdapter = new DatabaseAdapter();
  }

  /**
   * Cria um novo banco de dados
   */
  async createDatabase(params: {
    parent: { type: 'page_id'; page_id: string };
    title: CreateDatabaseParameters['title'];
    properties: CreateDatabaseParameters['properties'];
    icon?: CreateDatabaseParameters['icon'];
    cover?: CreateDatabaseParameters['cover'];
  }): Promise<NotionDatabase> {
    try {
      ValidationUtils.validateId(params.parent.page_id);
      ValidationUtils.validateTitle(params.title[0]?.plain_text || '');
      
      if (params.icon) {
        ValidationUtils.validateIcon(params.icon);
      }

      const response = await this.client.databases.create({
        parent: params.parent,
        title: params.title,
        properties: params.properties,
        icon: params.icon,
        cover: params.cover
      });

      return this.databaseAdapter.adapt(response);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Atualiza um banco de dados existente
   */
  async updateDatabase(
    databaseId: string,
    params: Omit<UpdateDatabaseParameters, 'database_id'>
  ): Promise<NotionDatabase> {
    try {
      ValidationUtils.validateId(databaseId);
      
      if (params.title) {
        ValidationUtils.validateTitle(params.title[0]?.plain_text || '');
      }
      
      if (params.icon) {
        ValidationUtils.validateIcon(params.icon);
      }

      const response = await this.client.databases.update({
        database_id: databaseId,
        ...params
      });

      return this.databaseAdapter.adapt(response);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Recupera um banco de dados pelo ID
   */
  async getDatabase(databaseId: string): Promise<NotionDatabase> {
    try {
      ValidationUtils.validateId(databaseId);

      const response = await this.client.databases.retrieve({
        database_id: databaseId
      });

      return this.databaseAdapter.adapt(response);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Consulta um banco de dados
   */
  async queryDatabase(params: {
    databaseId: string;
    filter?: NotionPropertyFilter | { and: NotionPropertyFilter[] } | { or: NotionPropertyFilter[] };
    sorts?: NotionSort[];
    startCursor?: string;
    pageSize?: number;
  }): Promise<{
    pages: NotionDatabase[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      ValidationUtils.validateId(params.databaseId);
      
      if (params.pageSize || params.startCursor) {
        ValidationUtils.validatePagination(params.pageSize, params.startCursor);
      }

      const queryParams: QueryDatabaseParameters = {
        database_id: params.databaseId,
        start_cursor: params.startCursor,
        page_size: params.pageSize
      };

      if (params.filter) {
        queryParams.filter = this.convertFilter(params.filter);
      }

      if (params.sorts) {
        queryParams.sorts = params.sorts.map(sort => ({
          property: sort.property,
          direction: sort.direction
        }));
      }

      const response = await this.client.databases.query(queryParams);

      return this.databaseAdapter.adaptList(
        response.results as DatabaseObjectResponse[],
        response.next_cursor,
        response.has_more
      );
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Converte um filtro do domínio para o formato da API
   */
  private convertFilter(
    filter: NotionPropertyFilter | { and: NotionPropertyFilter[] } | { or: NotionPropertyFilter[] }
  ): QueryDatabaseParameters['filter'] {
    if ('and' in filter) {
      return {
        and: filter.and.map(f => this.convertPropertyFilter(f))
      };
    }

    if ('or' in filter) {
      return {
        or: filter.or.map(f => this.convertPropertyFilter(f))
      };
    }

    return this.convertPropertyFilter(filter);
  }

  /**
   * Converte um filtro de propriedade do domínio para o formato da API
   */
  private convertPropertyFilter(filter: NotionPropertyFilter): any {
    return {
      property: filter.property,
      [filter.type]: {
        [filter.operator]: filter.value
      }
    };
  }
}
