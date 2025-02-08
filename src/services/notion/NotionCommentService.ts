import { Client } from '@notionhq/client';
import { 
  CommentObjectResponse, 
  CreateCommentParameters 
} from '@notionhq/client/build/src/api-endpoints';
import { NotionComment } from '../../domain/entities/NotionComment';
import { CommentAdapter } from './adapters/CommentAdapter';
import { ValidationUtils } from './utils/ValidationUtils';
import { NotionErrors } from './errors/NotionErrors';
import { CreateCommentParams, NotionCommentParent } from './types/NotionCommentTypes';

/**
 * Serviço para manipulação de comentários no Notion
 */
export class NotionCommentService {
  private readonly commentAdapter: CommentAdapter;

  constructor(private readonly client: Client) {
    this.commentAdapter = new CommentAdapter();
  }

  /**
   * Cria um novo comentário
   */
  async createComment(params: CreateCommentParams): Promise<NotionComment> {
    try {
      if ('page_id' in params.parent) {
        ValidationUtils.validateId(params.parent.page_id);
      } else {
        ValidationUtils.validateId(params.parent.block_id);
      }
      ValidationUtils.validateRichText(params.rich_text);

      const response = await this.client.comments.create({
        parent: params.parent,
        discussion_id: params.discussion_id,
        rich_text: params.rich_text
      });

      return this.commentAdapter.adapt(response);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Recupera um comentário pelo ID
   */
  async getComment(commentId: string): Promise<NotionComment> {
    try {
      ValidationUtils.validateId(commentId);

      const response = await this.client.comments.retrieve({
        comment_id: commentId
      });

      return this.commentAdapter.adapt(response);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Lista os comentários de uma página ou bloco
   */
  async listComments(parent: NotionCommentParent): Promise<NotionComment[]> {
    try {
      if ('page_id' in parent) {
        ValidationUtils.validateId(parent.page_id);
      } else {
        ValidationUtils.validateId(parent.block_id);
      }

      const response = await this.client.comments.list({
        block_id: 'block_id' in parent ? parent.block_id : parent.page_id
      });

      return this.commentAdapter.adaptList(response.results as CommentObjectResponse[]);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }
}
