import { 
  CommentObjectResponse,
  RichTextItemResponse,
  CreateCommentParameters
} from '@notionhq/client/build/src/api-endpoints';
import { NotionUser } from './NotionTypes';

/**
 * Interface para o parent de um comentário
 */
export interface NotionCommentParent {
  type: 'page_id' | 'block_id';
  page_id?: string;
  block_id?: string;
}

/**
 * Interface para um comentário do Notion
 */
export interface NotionComment {
  id: string;
  parent: NotionCommentParent;
  discussionId: string;
  createdTime: string;
  lastEditedTime: string;
  createdBy: NotionUser;
  richText: RichTextItemResponse[];
  resolved: boolean;
}

/**
 * Interface para criação de comentário
 */
export interface CreateCommentParams {
  parent: NotionCommentParent;
  discussion_id?: string;
  rich_text: RichTextItemResponse[];
}

/**
 * Interface para resposta da listagem de comentários
 */
export interface ListCommentsResponse {
  comments: NotionComment[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Interface para parâmetros de listagem de comentários
 */
export interface ListCommentsParams {
  parent: NotionCommentParent;
  startCursor?: string;
  pageSize?: number;
}
