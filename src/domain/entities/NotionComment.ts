import { NotionObject } from './NotionObject';
import { NotionId } from '../valueObjects/NotionId';
import { TimeStamp } from '../valueObjects/TimeStamp';
import { ParentReference } from '../valueObjects/ParentReference';
import { RichText } from '../valueObjects/RichText';
import { NotionParent, NotionRichText, NotionUser } from '../../services/notion/types/NotionTypes';

/**
 * Entidade que representa um comentário no Notion
 */
export class NotionComment extends NotionObject implements NotionComment {
  constructor(
    id: NotionId,
    private readonly parent: ParentReference,
    private readonly discussionId: NotionId,
    createdTime: TimeStamp,
    lastEditedTime: TimeStamp,
    private readonly createdBy: NotionUser,
    private readonly richText: RichText[],
    private readonly resolved: boolean = false
  ) {
    super(id, createdTime, lastEditedTime);
  }

  static create(params: {
    id: string;
    parent: {
      type: 'page_id' | 'block_id';
      id: string;
    };
    discussionId: string;
    createdTime: string;
    lastEditedTime: string;
    createdBy: NotionUser;
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
    resolved?: boolean;
  }): NotionComment {
    return new NotionComment(
      NotionId.create(params.id),
      ParentReference.create(params.parent.type, params.parent.id),
      NotionId.create(params.discussionId),
      TimeStamp.create(params.createdTime),
      TimeStamp.create(params.lastEditedTime),
      params.createdBy,
      params.richText.map(rt => RichText.create(
        rt.type,
        rt.text,
        rt.annotations,
        rt.plainText,
        rt.href
      )),
      params.resolved ?? false
    );
  }

  getParent(): ParentReference {
    return this.parent;
  }

  getDiscussionId(): string {
    return this.discussionId.toString();
  }

  getCreatedBy(): NotionUser {
    return this.createdBy;
  }

  getRichText(): RichText[] {
    return this.richText;
  }

  getResolved(): boolean {
    return this.resolved;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      parent: this.parent.toJSON(),
      discussion_id: this.getDiscussionId(),
      created_time: this.getCreatedTime(),
      last_edited_time: this.getLastEditedTime(),
      created_by: this.createdBy,
      rich_text: this.richText.map(rt => rt.toJSON()),
      resolved: this.resolved
    };
  }
}
