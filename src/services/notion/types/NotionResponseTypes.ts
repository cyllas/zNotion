import { NotionBlock } from './NotionBlockTypes';
import { NotionDatabaseProperty } from './NotionDatabaseTypes';
import { NotionParent, NotionUser, NotionIcon, NotionCover, NotionRichText } from './NotionTypes';

/**
 * Interface base para respostas paginadas
 */
export interface NotionPaginatedResponse<T> {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
}

/**
 * Interface base para objetos do Notion
 */
export interface NotionObjectResponse {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  archived: boolean;
}

/**
 * Resposta de página
 */
export interface NotionPageResponse extends NotionObjectResponse {
  object: 'page';
  parent: NotionParent;
  properties: Record<string, any>;
  icon: NotionIcon | null;
  cover: NotionCover | null;
  url: string;
}

/**
 * Resposta de banco de dados
 */
export interface NotionDatabaseResponse extends NotionObjectResponse {
  object: 'database';
  parent: NotionParent;
  properties: Record<string, NotionDatabaseProperty>;
  icon: NotionIcon | null;
  cover: NotionCover | null;
  url: string;
  title: NotionRichText[];
  description: NotionRichText[];
  is_inline: boolean;
}

/**
 * Resposta de bloco
 */
export interface NotionBlockResponse extends NotionObjectResponse {
  object: 'block';
  type: string;
  has_children: boolean;
}

/**
 * Resposta de comentário
 */
export interface NotionCommentResponse extends NotionObjectResponse {
  object: 'comment';
  parent: NotionParent;
  discussion_id: string;
  rich_text: NotionRichText[];
}

/**
 * Resposta de usuário
 */
export interface NotionUserResponse extends Omit<NotionUser, 'object'> {
  object: 'user';
  name: string | null;
  avatar_url: string | null;
}

/**
 * Resposta de webhook
 */
export interface NotionWebhookResponse {
  object: 'webhook';
  id: string;
  created_time: string;
  last_success_time: string | null;
  last_failure_time: string | null;
  created_by: NotionUser;
  url: string;
  active: boolean;
  events: string[];
}

/**
 * Resposta de busca
 */
export interface NotionSearchResponse extends NotionPaginatedResponse<
  NotionPageResponse | NotionDatabaseResponse | NotionBlockResponse
> {
  type: 'page_or_database';
  page_or_database: {};
}
