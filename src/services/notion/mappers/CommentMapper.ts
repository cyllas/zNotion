import { CommentObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionComment } from '../../../domain/entities/NotionComment';
import { BaseMapper } from './BaseMapper';
import { NotionParent } from '../types/NotionTypes';

/**
 * Mapper para conversão de comentários do Notion
 */
export class CommentMapper extends BaseMapper {
  /**
   * Converte uma resposta da API para nosso domínio
   */
  static toDomain(response: CommentObjectResponse): NotionComment {
    return {
      id: response.id,
      parent: this.mapParent(response.parent),
      discussionId: response.discussion_id,
      createdTime: this.mapTimestamp(response.created_time),
      lastEditedTime: this.mapTimestamp(response.last_edited_time),
      createdBy: response.created_by,
      richText: this.mapRichText(response.rich_text)
    };
  }

  /**
   * Converte um objeto do nosso domínio para o formato da API
   */
  static toApi(comment: Partial<NotionComment>): Record<string, any> {
    return this.toApiFormat({
      parent: comment.parent && this.mapParentToApi(comment.parent),
      rich_text: comment.richText,
      discussion_id: comment.discussionId
    });
  }

  /**
   * Mapeia o parent da API para nosso formato
   */
  private static mapParent(parent: CommentObjectResponse['parent']): NotionParent {
    return {
      type: parent.type,
      id: parent[parent.type]
    };
  }

  /**
   * Mapeia nosso formato de parent para o formato da API
   */
  private static mapParentToApi(parent: NotionParent): Record<string, any> {
    return {
      type: parent.type,
      [parent.type]: parent.id
    };
  }
}
