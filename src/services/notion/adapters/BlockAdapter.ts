import { 
  BlockObjectResponse, 
  RichTextItemResponse 
} from '@notionhq/client/build/src/api-endpoints';
import { NotionBlock } from '../../../domain/entities/NotionBlock';
import { NotionId } from '../../../domain/types/NotionId';
import { TimeStamp } from '../../../domain/types/TimeStamp';
import { NotionUser } from '../../../domain/entities/NotionUser';
import { PaginatedAdapter } from './types';
import { RichTextAdapter } from './RichTextAdapter';
import { UserAdapter } from './UserAdapter';

/**
 * Adaptador para converter blocos entre o formato da API e do domínio
 */
export class BlockAdapter implements PaginatedAdapter<BlockObjectResponse, NotionBlock> {
  private readonly richTextAdapter: RichTextAdapter;
  private readonly userAdapter: UserAdapter;

  constructor() {
    this.richTextAdapter = new RichTextAdapter();
    this.userAdapter = new UserAdapter();
  }

  /**
   * Converte um bloco da API para o formato do domínio
   */
  adapt(from: BlockObjectResponse): NotionBlock {
    const blockType = from.type;
    const blockContent = from[blockType];

    return {
      id: from.id as NotionId,
      type: blockType,
      parent: {
        type: from.parent.type,
        [from.parent.type]: from.parent[from.parent.type]
      },
      createdTime: from.created_time as TimeStamp,
      lastEditedTime: from.last_edited_time as TimeStamp,
      createdBy: this.userAdapter.adapt(from.created_by),
      lastEditedBy: this.userAdapter.adapt(from.last_edited_by),
      hasChildren: from.has_children,
      archived: from.archived,
      content: this.convertContent(from)
    };
  }

  /**
   * Converte uma lista paginada de blocos da API para o formato do domínio
   */
  adaptList(
    items: BlockObjectResponse[],
    nextCursor: string | null,
    hasMore: boolean
  ): {
    items: NotionBlock[];
    nextCursor: string | null;
    hasMore: boolean;
  } {
    return {
      items: items.map(item => this.adapt(item)),
      nextCursor,
      hasMore
    };
  }

  /**
   * Converte o conteúdo específico de cada tipo de bloco
   */
  private convertContent(block: BlockObjectResponse): Record<string, any> {
    const blockType = block.type;
    const content = block[blockType];

    if (!content) return {};

    switch (blockType) {
      case 'paragraph':
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
      case 'bulleted_list_item':
      case 'numbered_list_item':
      case 'quote':
      case 'to_do':
      case 'toggle':
      case 'template':
      case 'callout':
        return {
          ...content,
          text: content.rich_text?.map((rt: RichTextItemResponse) => 
            this.richTextAdapter.adapt(rt)
          ) || []
        };

      case 'code':
        return {
          language: content.language,
          text: content.rich_text?.map((rt: RichTextItemResponse) => 
            this.richTextAdapter.adapt(rt)
          ) || []
        };

      case 'image':
      case 'video':
      case 'file':
      case 'pdf':
        return {
          type: content.type,
          ...(content.type === 'external' 
            ? { external: content.external } 
            : { file: content.file }
          )
        };

      case 'bookmark':
      case 'embed':
      case 'link_preview':
        return {
          url: content.url,
          caption: content.caption?.map((rt: RichTextItemResponse) => 
            this.richTextAdapter.adapt(rt)
          ) || []
        };

      case 'table':
        return {
          tableWidth: content.table_width,
          hasColumnHeader: content.has_column_header,
          hasRowHeader: content.has_row_header
        };

      case 'column_list':
      case 'column':
      case 'table_row':
        return {};

      case 'equation':
        return {
          expression: content.expression
        };

      case 'divider':
      case 'breadcrumb':
        return {};

      default:
        return content;
    }
  }
}
