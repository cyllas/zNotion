import { 
  BlockObjectResponse, 
  CommentObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
  UserObjectResponse,
  QueryDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints';

/**
 * Tipos de objetos suportados pela API do Notion
 */
export type NotionObjectType = 'database' | 'page' | 'block' | 'comment' | 'user';

/**
 * Tipos de blocos suportados pela API do Notion
 */
export type NotionBlockType = BlockObjectResponse['type'];

/**
 * Tipos de propriedades suportadas pela API do Notion
 */
export type NotionPropertyType = 
  | 'title' 
  | 'rich_text' 
  | 'number' 
  | 'select' 
  | 'multi_select' 
  | 'date' 
  | 'people' 
  | 'files' 
  | 'checkbox' 
  | 'url' 
  | 'email' 
  | 'phone_number' 
  | 'formula' 
  | 'relation' 
  | 'rollup' 
  | 'created_time' 
  | 'created_by' 
  | 'last_edited_time' 
  | 'last_edited_by';

/**
 * Tipos de operadores de filtro suportados
 */
export type NotionFilterOperator = 
  | 'equals' 
  | 'does_not_equal' 
  | 'contains' 
  | 'does_not_contain' 
  | 'starts_with' 
  | 'ends_with' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal_to' 
  | 'less_than_or_equal_to' 
  | 'is_empty' 
  | 'is_not_empty';

/**
 * Tipos de ordenação suportados
 */
export type NotionSortDirection = 'ascending' | 'descending';

/**
 * Interface para filtros de consulta
 */
export interface NotionFilter {
  property: string;
  type?: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than' | 'greater_than_or_equal_to' | 'less_than_or_equal_to' | 'contains' | 'does_not_contain' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty';
  value?: string | number | boolean | string[] | null;
}

/**
 * Interface para filtros de propriedade
 */
export interface NotionPropertyFilter {
  property: string;
  type: NotionPropertyType;
  operator: NotionFilterOperator;
  value: any;
}

/**
 * Interface para filtros compostos
 */
export interface NotionCompoundFilter {
  operator: 'and' | 'or';
  filters: Array<NotionPropertyFilter | NotionCompoundFilter>;
}

/**
 * Interface para ordenação
 */
export interface NotionSort {
  property: string;
  direction: NotionSortDirection;
  timestamp?: 'created_time' | 'last_edited_time';
}

/**
 * Interface para paginação
 */
export interface NotionPagination {
  startCursor?: string;
  pageSize?: number;
}

/**
 * Interface para referência de parent
 */
export interface NotionParent {
  type: 'database_id' | 'page_id' | 'block_id' | 'workspace';
  [key: string]: any;
}

/**
 * Interface para rich text
 */
export interface NotionRichText {
  type: 'text' | 'mention' | 'equation';
  text?: {
    content: string;
    link: { url: string } | null;
  };
  plain_text: string;
  href: string | null;
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: NotionColor;
  };
}

/**
 * Interface para ícones
 */
export interface NotionIcon {
  type: 'emoji' | 'external';
  emoji?: string;
  external?: {
    url: string;
  };
}

/**
 * Interface para covers
 */
export interface NotionCover {
  type: 'external';
  external: {
    url: string;
  };
}

/**
 * Interface para usuários
 */
export interface NotionUser {
  object: 'user';
  id: string;
  type: 'person' | 'bot';
  name: string | null;
  avatarUrl: string | null;
  person?: {
    email: string;
  };
  bot?: {
    workspace_name?: string;
    owner?: {
      type: 'workspace' | 'user';
      workspace?: boolean;
      user?: NotionUser;
    };
  };
}

/**
 * Interface para blocos do Notion
 */
export interface NotionBlock {
  id: string;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  archived: boolean;
  type: NotionBlockType;
  paragraph?: {
    rich_text: NotionRichText[];
    color: string;
  };
  heading_1?: {
    rich_text: NotionRichText[];
    color: string;
    is_toggleable: boolean;
  };
  heading_2?: {
    rich_text: NotionRichText[];
    color: string;
    is_toggleable: boolean;
  };
  heading_3?: {
    rich_text: NotionRichText[];
    color: string;
    is_toggleable: boolean;
  };
  bulleted_list_item?: {
    rich_text: NotionRichText[];
    color: string;
  };
  numbered_list_item?: {
    rich_text: NotionRichText[];
    color: string;
  };
  to_do?: {
    rich_text: NotionRichText[];
    color: string;
    checked: boolean;
  };
  toggle?: {
    rich_text: NotionRichText[];
    color: string;
  };
  code?: {
    rich_text: NotionRichText[];
    language: string;
    caption: NotionRichText[];
  };
  quote?: {
    rich_text: NotionRichText[];
    color: string;
  };
  callout?: {
    rich_text: NotionRichText[];
    icon: NotionIcon;
    color: string;
  };
}

/**
 * Interface para propriedades de banco de dados
 */
export interface NotionDatabaseProperty {
  id: string;
  type: 'title' | 'rich_text' | 'number' | 'select' | 'multi_select' | 'date' | 'people' | 'files' | 'checkbox' | 'url' | 'email' | 'phone_number' | 'formula' | 'relation' | 'rollup' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by';
  name?: string;
}

/**
 * Cores disponíveis no Notion
 */
export type NotionColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';

/**
 * Resposta de erro da API do Notion
 */
export interface NotionErrorResponse {
  code: string;
  message: string;
  status: number;
  headers?: Record<string, string>;
  body?: string;
}

/**
 * Tipos de eventos do webhook
 */
export type NotionWebhookEvent =
  | 'page.created'
  | 'page.updated'
  | 'page.deleted'
  | 'database.created'
  | 'database.updated'
  | 'database.deleted'
  | 'comment.created'
  | 'comment.updated'
  | 'comment.deleted';

/**
 * Interface para webhooks do Notion
 */
export interface NotionWebhook {
  id: string;
  name?: string;
  active: boolean;
  url: string;
  events: NotionWebhookEvent[];
  secret?: string;
  createdTime?: string;
  lastSuccessTime?: string;
  lastFailureTime?: string;
  createdBy?: NotionUser;
}

/**
 * Comentário do Notion
 */
export interface NotionComment {
  id: string;
  parent: NotionParent;
  discussionId: string;
  createdTime: string;
  lastEditedTime: string;
  createdBy: NotionUser;
  richText: RichTextItemResponse[];
  resolved: boolean;
}
