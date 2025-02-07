import { CreatePageParameters, UpdatePageParameters, CreateDatabaseParameters, UpdateDatabaseParameters, QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { NotionResponse } from './INotionTypes';

export interface INotionClient {
  // Métodos para Páginas
  listPages(params?: any): Promise<NotionResponse<any>>;
  getPage(pageId: string): Promise<NotionResponse<any>>;
  createPage(params: CreatePageParameters): Promise<NotionResponse<any>>;
  updatePage(pageId: string, params: UpdatePageParameters['properties']): Promise<NotionResponse<any>>;
  archivePage(pageId: string): Promise<NotionResponse<any>>;

  // Métodos para Bancos de Dados
  listDatabases(params?: any): Promise<NotionResponse<any>>;
  getDatabase(databaseId: string): Promise<NotionResponse<any>>;
  queryDatabase(databaseId: string, params?: Partial<QueryDatabaseParameters>): Promise<NotionResponse<any>>;
  createDatabase(params: CreateDatabaseParameters): Promise<NotionResponse<any>>;
  updateDatabase(databaseId: string, params: Partial<UpdateDatabaseParameters>): Promise<NotionResponse<any>>;

  // Métodos para Blocos
  listBlocks(params?: any): Promise<NotionResponse<any>>;
  getBlock(blockId: string): Promise<NotionResponse<any>>;
  updateBlock(blockId: string, params: any): Promise<NotionResponse<any>>;
  deleteBlock(blockId: string): Promise<NotionResponse<any>>;
  getBlockChildren(blockId: string): Promise<NotionResponse<any>>;
}
