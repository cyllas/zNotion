import { Client } from '@notionhq/client';
import { notionClient } from '../config/notion.config';
import { NotionError } from '../utils/NotionError';
import { INotionClient } from '../interfaces/INotionClient';
import { DatabaseQuery, NotionResponse } from '../interfaces/INotionTypes';
import { 
  CreatePageParameters, 
  UpdatePageParameters, 
  CreateDatabaseParameters, 
  UpdateDatabaseParameters,
  QueryDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints';

export class NotionService implements INotionClient {
  private client: Client;

  constructor(client: Client = notionClient) {
    this.client = client;
  }

  private handleError(error: any): never {
    if (error.code === 'notionhq_client_response_error') {
      throw new NotionError(
        error.message,
        error.code,
        error.status || 500
      );
    }
    throw new NotionError(error.message);
  }

  async listPages(params?: any): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.search({
        ...params,
        filter: {
          ...params?.filter,
          property: 'object',
          value: 'page'
        }
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getPage(pageId: string): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.pages.retrieve({ page_id: pageId });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createPage(params: CreatePageParameters): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.pages.create(params);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatePage(pageId: string, params: UpdatePageParameters['properties']): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.pages.update({
        page_id: pageId,
        properties: params
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async archivePage(pageId: string): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.pages.update({
        page_id: pageId,
        archived: true
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async listDatabases(params?: any): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.search({
        ...params,
        filter: {
          ...params?.filter,
          property: 'object',
          value: 'database'
        }
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getDatabase(databaseId: string): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.databases.retrieve({
        database_id: databaseId
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async queryDatabase(databaseId: string, params?: Partial<QueryDatabaseParameters>): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        ...(params || {})
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createDatabase(params: CreateDatabaseParameters): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.databases.create(params);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateDatabase(databaseId: string, params: Partial<UpdateDatabaseParameters>): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.databases.update({
        database_id: databaseId,
        ...(params || {})
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async listBlocks(params?: any): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.search({
        ...params,
        filter: {
          ...params?.filter,
          property: 'object',
          value: 'block'
        }
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getBlock(blockId: string): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.blocks.retrieve({
        block_id: blockId
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateBlock(blockId: string, params: any): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.blocks.update({
        block_id: blockId,
        ...params
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteBlock(blockId: string): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.blocks.delete({
        block_id: blockId
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getBlockChildren(blockId: string): Promise<NotionResponse<any>> {
    try {
      const response = await this.client.blocks.children.list({
        block_id: blockId
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }
}
