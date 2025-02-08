import { NotionObject } from './NotionObject';
import { NotionId } from '../valueObjects/NotionId';
import { TimeStamp } from '../valueObjects/TimeStamp';
import { ParentReference } from '../valueObjects/ParentReference';
import { RichText } from '../valueObjects/RichText';

/**
 * Entidade que representa um banco de dados no Notion
 */
export class NotionDatabase extends NotionObject {
  constructor(
    id: NotionId,
    private readonly parent: ParentReference,
    createdTime: TimeStamp,
    lastEditedTime: TimeStamp,
    private readonly title: RichText[],
    private readonly properties: Record<string, any>,
    private readonly archived: boolean,
    private readonly icon?: { type: string; emoji?: string; external?: { url: string } },
    private readonly cover?: { type: string; external?: { url: string } }
  ) {
    super(id, createdTime, lastEditedTime);
  }

  static create(params: {
    id: string;
    parent: {
      type: 'page_id' | 'workspace';
      page_id?: string;
    };
    created_time: string;
    last_edited_time: string;
    title: Array<{
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
      plain_text?: string;
      href?: string | null;
    }>;
    properties: Record<string, any>;
    archived: boolean;
    icon?: { type: string; emoji?: string; external?: { url: string } };
    cover?: { type: string; external?: { url: string } };
  }): NotionDatabase {
    return new NotionDatabase(
      NotionId.create(params.id),
      params.parent.type === 'workspace'
        ? ParentReference.create('page_id', 'workspace')
        : ParentReference.create('page_id', params.parent.page_id!),
      TimeStamp.create(params.created_time),
      TimeStamp.create(params.last_edited_time),
      params.title.map(t => RichText.create(
        t.type,
        t.text,
        t.annotations,
        t.plain_text,
        t.href
      )),
      params.properties,
      params.archived,
      params.icon,
      params.cover
    );
  }

  getParent(): ParentReference {
    return this.parent;
  }

  getTitle(): RichText[] {
    return [...this.title];
  }

  getProperties(): Record<string, any> {
    return { ...this.properties };
  }

  isArchived(): boolean {
    return this.archived;
  }

  getIcon(): { type: string; emoji?: string; external?: { url: string } } | undefined {
    return this.icon ? { ...this.icon } : undefined;
  }

  getCover(): { type: string; external?: { url: string } } | undefined {
    return this.cover ? { ...this.cover } : undefined;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      parent: this.parent.toJSON(),
      created_time: this.getCreatedTime(),
      last_edited_time: this.getLastEditedTime(),
      title: this.title.map(t => t.toJSON()),
      properties: this.properties,
      archived: this.archived,
      icon: this.icon,
      cover: this.cover
    };
  }
}
