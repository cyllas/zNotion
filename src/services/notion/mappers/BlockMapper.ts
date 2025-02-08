import { BlockObjectResponse, BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';
import { NotionBlock } from '../../../domain/entities/NotionBlock';
import { NotionId } from '../../../domain/valueObjects/NotionId';
import { ParentReference } from '../../../domain/valueObjects/ParentReference';
import { BaseMapper } from './BaseMapper';

/**
 * Mapper para conversão de blocos do Notion
 */
export class BlockMapper extends BaseMapper {
  /**
   * Converte uma resposta da API para nosso domínio
   */
  static toDomain(response: BlockObjectResponse): NotionBlock {
    return NotionBlock.create({
      id: response.id,
      parent: {
        type: response.parent.type as 'database_id' | 'page_id' | 'block_id',
        page_id: 'page_id' in response.parent ? response.parent.page_id : undefined,
        block_id: 'block_id' in response.parent ? response.parent.block_id : undefined,
        database_id: 'database_id' in response.parent ? response.parent.database_id : undefined
      },
      created_time: response.created_time,
      last_edited_time: response.last_edited_time,
      type: response.type,
      has_children: response.has_children,
      archived: response.archived,
      content: this.mapBlockContent(response),
      created_by: response.created_by,
      last_edited_by: response.last_edited_by
    });
  }

  /**
   * Converte um objeto do nosso domínio para o formato da API
   */
  static toApi(domain: NotionBlock): BlockObjectRequest {
    if (!domain.getType()) {
      throw new Error('Block type is required');
    }

    const blockType = domain.getType();
    const content = domain.getContent();

    // Cria um objeto base com o tipo específico requerido pela API
    const baseBlock = {
      object: 'block' as const,
      type: blockType as any, // Necessário devido à tipagem estrita do Notion
    } as BlockObjectRequest;

    // Adiciona o conteúdo específico do tipo de bloco
    if (content) {
      switch (blockType) {
        case 'paragraph':
          (baseBlock as any).paragraph = {
            rich_text: content.text || []
          };
          break;
        case 'heading_1':
          (baseBlock as any).heading_1 = {
            rich_text: content.text || []
          };
          break;
        case 'heading_2':
          (baseBlock as any).heading_2 = {
            rich_text: content.text || []
          };
          break;
        case 'heading_3':
          (baseBlock as any).heading_3 = {
            rich_text: content.text || []
          };
          break;
        case 'bulleted_list_item':
          (baseBlock as any).bulleted_list_item = {
            rich_text: content.text || []
          };
          break;
        case 'numbered_list_item':
          (baseBlock as any).numbered_list_item = {
            rich_text: content.text || []
          };
          break;
        case 'quote':
          (baseBlock as any).quote = {
            rich_text: content.text || []
          };
          break;
        case 'equation':
          (baseBlock as any).equation = {
            expression: content.expression || ''
          };
          break;
        case 'divider':
          (baseBlock as any).divider = {};
          break;
        case 'code':
          (baseBlock as any).code = {
            language: content.language || 'plain text',
            rich_text: content.text || []
          };
          break;
        default:
          // Para outros tipos de blocos, mantém o conteúdo original
          (baseBlock as any)[blockType] = content;
      }
    }

    return baseBlock;
  }

  /**
   * Mapeia o conteúdo específico do tipo de bloco
   */
  private static mapBlockContent(block: BlockObjectResponse): Record<string, any> {
    // Usando type assertion para informar ao TypeScript que a propriedade existe
    const content = (block as any)[block.type];
    
    switch (block.type) {
      case 'paragraph':
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
      case 'bulleted_list_item':
      case 'numbered_list_item':
      case 'quote':
      case 'to_do':
      case 'toggle':
        return {
          ...content,
          text: this.mapRichText(content.rich_text)
        };

      case 'image':
      case 'video':
      case 'file':
      case 'pdf':
        return {
          type: content.type,
          [content.type]: content[content.type]
        };

      case 'code':
        return {
          language: content.language,
          text: this.mapRichText(content.rich_text)
        };

      case 'equation':
        return {
          expression: content.expression
        };

      case 'divider':
      case 'breadcrumb':
        return {};

      default:
        return content || {};
    }
  }

  private static getParentId(parent: BlockObjectResponse['parent']): NotionId {
    switch (parent.type) {
      case 'database_id':
        return NotionId.create(parent.database_id);
      case 'page_id':
        return NotionId.create(parent.page_id);
      case 'block_id':
        return NotionId.create(parent.block_id);
      default:
        throw new Error(`Tipo de parent não suportado: ${parent.type}`);
    }
  }
}
