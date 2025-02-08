import { Client } from '@notionhq/client';
import {
  SearchParams,
  CreatePageParams,
  UpdatePageParams,
  CreateDatabaseParams,
  UpdateDatabaseParams,
  QueryDatabaseParams,
  NotionPage,
  NotionDatabase,
  NotionBlock,
  NotionResponse
} from './INotionTypes';

export interface INotionClient extends Client {
  request<ResponseBody>({
    path,
    method,
    query,
    body,
    auth,
  }: {
    path: string;
    method?: string;
    query?: Record<string, any>;
    body?: Record<string, any>;
    auth?: string | { client_id: string; client_secret: string; };
  }): Promise<ResponseBody>;
}
