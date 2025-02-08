import { CommentObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionComment } from '../../../domain/entities/NotionComment';
import { Adapter } from './types';
import { RichTextAdapter } from './RichTextAdapter';

/**
 * Adaptador para converter comentários entre o formato da API e do domínio
 */
export class CommentAdapter implements Adapter<CommentObjectResponse, NotionComment> {
  private readonly richTextAdapter: RichTextAdapter;

  constructor() {
    this.richTextAdapter = new RichTextAdapter();
  }

  /**
   * Converte um comentário da API para o formato do domínio
   */
  adapt(from: CommentObjectResponse): NotionComment {
    return NotionComment.create({
      id: from.id,
      parent: {
        type: from.parent.type,
        id: from.parent[from.parent.type as keyof typeof from.parent] as string
      },
      discussionId: from.discussion_id,
      createdTime: from.created_time,
      lastEditedTime: from.last_edited_time,
      createdBy: {
        object: 'user',
        id: from.created_by.id,
        name: null,
        avatarUrl: null,
        type: 'person'
      },
      richText: from.rich_text.map(rt => ({
        type: rt.type,
        text: {
          content: rt.plain_text,
          link: rt.href || null
        },
        annotations: rt.annotations,
        plainText: rt.plain_text,
        href: rt.href
      })),
      resolved: false
    });
  }

  /**
   * Converte uma lista de comentários
   */
  adaptList(comments: CommentObjectResponse[]): NotionComment[] {
    return comments.map(comment => this.adapt(comment));
  }
}
