import { Client } from '@notionhq/client';

export interface NotionResponse<T> {
  object: string;
  results?: T[];
  status?: number;
  message?: string;
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

export type RichTextContent = {
  type: 'text';
  text: {
    content: string;
    link?: { url: string } | null;
  };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
};

export type PropertyValue = {
  id: string;
  type: string;
  [key: string]: any;
};

export type PageProperties = Record<string, PropertyValue>;

export type DatabasePropertyConfig = {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
};

export type DatabaseProperties = Record<string, DatabasePropertyConfig>;

export interface NotionError {
  code: string;
  message: string;
  status: number;
}
