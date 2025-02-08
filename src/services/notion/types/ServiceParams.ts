import {
  NotionParent,
  NotionIcon,
  NotionCover,
  NotionRichTextItem,
  NotionPageProperties,
  NotionDatabaseProperties,
  NotionEventTypes,
  NotionFilter,
  NotionSort
} from './NotionTypes';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

export interface CreatePageParams {
  parent: {
    type: 'database_id' | 'page_id';
    id: string;
  };
  properties: NotionPageProperties;
  icon?: NotionIcon;
  cover?: NotionCover;
}

export interface UpdatePageParams {
  properties?: NotionPageProperties;
  archived?: boolean;
  icon?: NotionIcon;
  cover?: NotionCover;
}

export interface CreateDatabaseParams {
  parent: {
    type: 'page_id';
    id: string;
  };
  title: NotionRichTextItem[];
  properties: NotionDatabaseProperties;
  icon?: NotionIcon;
  cover?: NotionCover;
}

export interface UpdateDatabaseParams {
  title?: NotionRichTextItem[];
  properties?: NotionDatabaseProperties;
  archived?: boolean;
  icon?: NotionIcon;
  cover?: NotionCover;
}

/**
 * Parâmetros para consulta de banco de dados
 */
export interface QueryDatabaseParams {
  filter?: NotionFilter;
  sorts?: NotionSort[];
  start_cursor?: string;
  page_size?: number;
}

export interface CreateBlockParams {
  parent: {
    type: 'page_id' | 'block_id';
    id: string;
  };
  type: string;
  content: Record<string, any>;
}

export interface UpdateBlockParams {
  type?: string;
  content?: Record<string, any>;
  archived?: boolean;
}

export interface CreateWebhookParams {
  url: string;
  events: NotionEventTypes[];
}

export interface UpdateWebhookParams {
  url?: string;
  active?: boolean;
  events?: NotionEventTypes[];
}
