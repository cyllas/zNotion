import { NotionObject } from './NotionObject';
import { NotionId } from '../valueObjects/NotionId';
import { TimeStamp } from '../valueObjects/TimeStamp';
import { ParentReference } from '../valueObjects/ParentReference';
import { RichText } from '../valueObjects/RichText';
import { 
  PageObjectResponse, 
  PartialPageObjectResponse 
} from '@notionhq/client/build/src/api-endpoints';
import { NotionEmojiIcon, NotionExternalIcon, NotionExternalCover } from '../../services/notion/types/NotionPageTypes';

/**
 * Entidade que representa uma página no Notion
 */
export class NotionPage extends NotionObject {
  constructor(
    id: NotionId,
    private readonly parent: ParentReference,
    createdTime: TimeStamp,
    lastEditedTime: TimeStamp,
    private readonly archived: boolean,
    private readonly properties: Record<string, any>,
    private readonly icon?: NotionEmojiIcon | NotionExternalIcon | null,
    private readonly cover?: NotionExternalCover | null
  ) {
    super(id, createdTime, lastEditedTime);
  }

  static create(params: {
    id: string;
    parent: {
      type: 'database_id' | 'page_id' | 'workspace';
      database_id?: string;
      page_id?: string;
    };
    created_time: string;
    last_edited_time: string;
    archived: boolean;
    properties: Record<string, any>;
    icon?: NotionEmojiIcon | NotionExternalIcon | null;
    cover?: NotionExternalCover | null;
  }): NotionPage {
    const parentType = params.parent.type;
    const parentId = params.parent.database_id || params.parent.page_id || '';

    return new NotionPage(
      NotionId.create(params.id),
      parentType === 'workspace' 
        ? ParentReference.create('page_id', 'workspace')
        : ParentReference.create(parentType as 'database_id' | 'page_id', parentId),
      TimeStamp.create(params.created_time),
      TimeStamp.create(params.last_edited_time),
      params.archived,
      params.properties,
      params.icon,
      params.cover
    );
  }

  getParent(): ParentReference {
    return this.parent;
  }

  isArchived(): boolean {
    return this.archived;
  }

  getProperties(): Record<string, any> {
    return { ...this.properties };
  }

  getIcon(): NotionEmojiIcon | NotionExternalIcon | null | undefined {
    return this.icon ? { ...this.icon } : undefined;
  }

  getCover(): NotionExternalCover | null | undefined {
    return this.cover ? { ...this.cover } : undefined;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      parent: this.parent.toJSON(),
      created_time: this.getCreatedTime(),
      last_edited_time: this.getLastEditedTime(),
      archived: this.archived,
      properties: this.properties,
      icon: this.icon,
      cover: this.cover
    };
  }
}
