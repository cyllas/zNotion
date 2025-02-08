import { Client } from '@notionhq/client';
import {
  CreatePageParameters,
  UpdatePageParameters,
  CreateDatabaseParameters,
  UpdateDatabaseParameters,
  QueryDatabaseParameters,
  PageObjectResponse,
  DatabaseObjectResponse,
  BlockObjectResponse,
  ListBlockChildrenResponse,
  SearchResponse,
  QueryDatabaseResponse,
  ListCommentsResponse
} from '@notionhq/client/build/src/api-endpoints';

export interface PaginatedResponse<T> {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface NotionResponse<T> extends PaginatedResponse<T> {
  type?: string;
  page_or_database?: Record<string, any>;
  block?: Record<string, any>;
}

export interface DatabaseQuery {
  filter?: Record<string, any>;
  sorts?: Array<{
    property: string;
    direction: 'ascending' | 'descending';
  } | {
    timestamp: 'created_time' | 'last_edited_time';
    direction: 'ascending' | 'descending';
  }>;
  page_size?: number;
  start_cursor?: string;
}

export interface NotionPage extends Omit<PageObjectResponse, keyof Record<string, unknown>> {}
export interface NotionDatabase extends Omit<DatabaseObjectResponse, keyof Record<string, unknown>> {}
export interface NotionBlock extends Omit<BlockObjectResponse, keyof Record<string, unknown>> {}

export interface NotionError {
  code: string;
  message: string;
  status: number;
}

export interface SearchParams {
  query?: string;
  filter?: {
    property: 'object';
    value: 'page' | 'database' | 'block';
  };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'last_edited_time';
  };
  page_size?: number;
  start_cursor?: string;
}

export interface BlockChildrenParams {
  block_id: string;
  page_size?: number;
  start_cursor?: string;
}

export interface CreatePageParams extends CreatePageParameters {}
export interface UpdatePageParams extends UpdatePageParameters {}
export interface CreateDatabaseParams extends CreateDatabaseParameters {}
export interface UpdateDatabaseParams extends UpdateDatabaseParameters {}
export interface QueryDatabaseParams extends QueryDatabaseParameters {}

export interface INotionComment {
  id: string;
  parent: {
    type: string;
    pageId: string;
  };
  discussionId: string;
  createdTime: string;
  lastEditedTime: string;
  createdBy: {
    object: string;
    id: string;
  };
  richText: Array<{
    type: string;
    text: {
      content: string;
      link: string | null;
    };
    annotations?: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plainText?: string;
    href?: string | null;
  }>;
}

export interface IDiscussion {
  id: string;
  parent: {
    type: string;
    pageId: string;
  };
  comments: INotionComment[];
}

export interface ICommentResponse {
  parent?: {
    type?: string;
    pageId?: string;
  };
  discussionId?: string;
  createdTime?: string;
  lastEditedTime?: string;
  createdBy?: {
    object?: string;
    id?: string;
  };
  richText?: Array<{
    type: string;
    text: {
      content: string;
      link: string | null;
    };
    annotations?: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plainText?: string;
    href?: string | null;
  }>;
}
