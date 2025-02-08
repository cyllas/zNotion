import { NotionObject } from './NotionObject';
import { NotionId } from '../valueObjects/NotionId';
import { TimeStamp } from '../valueObjects/TimeStamp';
import { ParentReference } from '../valueObjects/ParentReference';
import { RichText } from '../valueObjects/RichText';

/**
 * Entidade que representa um bloco no Notion
 */
export class NotionBlock extends NotionObject {
  constructor(
    id: NotionId,
    private readonly parent: ParentReference,
    createdTime: TimeStamp,
    lastEditedTime: TimeStamp,
    private readonly type: string,
    private readonly hasChildren: boolean,
    private readonly archived: boolean,
    private readonly content: Record<string, any>,
    private readonly createdBy: { id: string; object: string },
    private readonly lastEditedBy: { id: string; object: string }
  ) {
    super(id, createdTime, lastEditedTime);
  }

  static create(params: {
    id: string;
    parent: {
      type: 'database_id' | 'page_id' | 'block_id';
      page_id?: string;
      block_id?: string;
      database_id?: string;
    };
    created_time: string;
    last_edited_time: string;
    type: string;
    has_children: boolean;
    archived: boolean;
    [key: string]: any;
  }): NotionBlock {
    const parentType = params.parent.type;
    const parentId = params.parent.page_id || params.parent.block_id || params.parent.database_id || '';

    // Extrair o conteúdo específico do tipo de bloco
    const { id, parent, created_time, last_edited_time, type, has_children, archived, ...content } = params;

    return new NotionBlock(
      NotionId.create(id),
      ParentReference.create(parentType, parentId),
      TimeStamp.create(created_time),
      TimeStamp.create(last_edited_time),
      type,
      has_children,
      archived,
      content[type] || {},
      params.created_by || { id: '', object: '' },
      params.last_edited_by || { id: '', object: '' }
    );
  }

  static createChild(params: {
    parentId: string;
    type: string;
    content: Record<string, any>;
  }): NotionBlock {
    const now = new Date().toISOString();
    
    return new NotionBlock(
      new NotionId(params.parentId),
      { type: 'block_id', block_id: params.parentId },
      now,
      now,
      params.type,
      false, // hasChildren
      false, // archived
      params.content,
      { id: 'system', object: 'user' }, // createdBy
      { id: 'system', object: 'user' }  // lastEditedBy
    );
  }

  getId(): NotionId {
    return this.id;
  }

  getCreatedTime(): string {
    return this.createdTime;
  }

  getLastEditedTime(): string {
    return this.lastEditedTime;
  }

  getParent(): ParentReference {
    return this.parent;
  }

  getType(): string {
    return this.type;
  }

  getHasChildren(): boolean {
    return this.hasChildren;
  }

  getArchived(): boolean {
    return this.archived;
  }

  getContent(): Record<string, any> {
    return this.content;
  }

  getCreatedBy(): { id: string; object: string } {
    return this.createdBy;
  }

  getLastEditedBy(): { id: string; object: string } {
    return this.lastEditedBy;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      parent: this.parent.toJSON(),
      created_time: this.getCreatedTime(),
      last_edited_time: this.getLastEditedTime(),
      type: this.type,
      has_children: this.hasChildren,
      archived: this.archived,
      created_by: this.createdBy,
      last_edited_by: this.lastEditedBy,
      [this.type]: this.content
    };
  }
}
