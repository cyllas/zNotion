import { Client } from '@notionhq/client';
import {
  ICommentService,
  INotionComment,
  IDiscussion
} from '../interfaces/INotionComment';

export class CommentService implements ICommentService {
  constructor(private readonly client: Client) {}

  async createComment(
    parentId: string,
    content: string,
    discussionId?: string,
    mentions?: Array<{ id: string; type: 'user' | 'page' | 'database' }>
  ): Promise<INotionComment> {
    try {
      const richText = this.buildRichText(content, mentions);
      
      const response = await this.client.request({
        method: 'POST',
        path: 'comments',
        body: {
          parent: {
            type: parentId.includes('-') ? 'page_id' : 'block_id',
            id: parentId
          },
          discussion_id: discussionId,
          rich_text: richText
        }
      });

      return response as INotionComment;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getComment(commentId: string): Promise<INotionComment> {
    try {
      const response = await this.client.request({
        method: 'GET',
        path: `comments/${commentId}`
      });

      return response as INotionComment;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateComment(
    commentId: string,
    content: string,
    mentions?: Array<{ id: string; type: 'user' | 'page' | 'database' }>
  ): Promise<INotionComment> {
    try {
      const richText = this.buildRichText(content, mentions);

      const response = await this.client.request({
        method: 'PATCH',
        path: `comments/${commentId}`,
        body: {
          rich_text: richText
        }
      });

      return response as INotionComment;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    try {
      await this.client.request({
        method: 'DELETE',
        path: `comments/${commentId}`
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDiscussion(
    parentId: string,
    title?: string,
    initialComment?: string
  ): Promise<IDiscussion> {
    try {
      const response = await this.client.request({
        method: 'POST',
        path: 'discussions',
        body: {
          parent: {
            type: parentId.includes('-') ? 'page_id' : 'block_id',
            id: parentId
          },
          title,
          ...(initialComment && {
            comments: [
              {
                rich_text: [{ text: { content: initialComment } }]
              }
            ]
          })
        }
      });

      return response as IDiscussion;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDiscussion(discussionId: string): Promise<IDiscussion> {
    try {
      const response = await this.client.request({
        method: 'GET',
        path: `discussions/${discussionId}`
      });

      return response as IDiscussion;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listDiscussions(
    parentId: string,
    options: {
      page_size?: number;
      start_cursor?: string;
    } = {}
  ): Promise<{
    discussions: IDiscussion[];
    has_more: boolean;
    next_cursor: string | null;
  }> {
    try {
      const response = await this.client.request({
        method: 'GET',
        path: `blocks/${parentId}/discussions`,
        params: options
      });

      return response as {
        discussions: IDiscussion[];
        has_more: boolean;
        next_cursor: string | null;
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDiscussion(
    discussionId: string,
    title: string
  ): Promise<IDiscussion> {
    try {
      const response = await this.client.request({
        method: 'PATCH',
        path: `discussions/${discussionId}`,
        body: {
          title
        }
      });

      return response as IDiscussion;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteDiscussion(discussionId: string): Promise<void> {
    try {
      await this.client.request({
        method: 'DELETE',
        path: `discussions/${discussionId}`
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private buildRichText(
    content: string,
    mentions?: Array<{ id: string; type: 'user' | 'page' | 'database' }>
  ) {
    const richText: any[] = [
      {
        text: { content }
      }
    ];

    if (mentions?.length) {
      mentions.forEach(mention => {
        richText.push({
          type: 'mention',
          mention: {
            type: mention.type,
            [mention.type]: { id: mention.id }
          }
        });
      });
    }

    return richText;
  }

  private handleError(error: any): Error {
    if (error.status) {
      return new Error(`Notion API Error: ${error.message} (${error.status})`);
    }
    return new Error(`Comment Service Error: ${error.message}`);
  }
}
