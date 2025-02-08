import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionRichText, NotionIcon, NotionCover } from '../types/NotionTypes';
import { TimeStamp } from '../../../domain/valueObjects/TimeStamp';

/**
 * Classe base para mappers do Notion
 */
export abstract class BaseMapper {
  /**
   * Converte um timestamp para TimeStamp
   */
  protected static mapTimestamp(timestamp: string | null | undefined): TimeStamp {
    if (!timestamp) {
      return TimeStamp.now();
    }
    return TimeStamp.create(timestamp);
  }

  /**
   * Converte rich text da API para nosso formato
   */
  protected static mapRichText(richText: RichTextItemResponse[] | undefined): NotionRichText[] {
    if (!richText) return [];

    return richText.map(item => ({
      type: item.type,
      text: {
        content: item.plain_text,
        link: item.href ? { url: item.href } : null
      },
      annotations: item.annotations,
      plainText: item.plain_text,
      href: item.href
    }));
  }

  /**
   * Converte um ícone da API para nosso formato
   */
  protected static mapIcon(icon: NotionIcon | null | undefined): NotionIcon | null {
    if (!icon) return null;

    return {
      type: icon.type,
      ...(icon.type === 'emoji' ? { emoji: icon.emoji } : { external: icon.external })
    };
  }

  /**
   * Converte uma capa da API para nosso formato
   */
  protected static mapCover(cover: NotionCover | null | undefined): NotionCover | null {
    if (!cover) return null;

    return {
      type: cover.type,
      external: cover.external
    };
  }

  /**
   * Converte um objeto para o formato da API
   */
  protected static toApiFormat(data: Record<string, any>): Record<string, any> {
    const apiData: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;

      if (key === 'richText') {
        apiData.rich_text = value;
      } else if (key === 'createdTime') {
        apiData.created_time = value instanceof Date ? value.toISOString() : value;
      } else if (key === 'lastEditedTime') {
        apiData.last_edited_time = value instanceof Date ? value.toISOString() : value;
      } else if (key === 'lastSuccessTime') {
        apiData.last_success_time = value instanceof Date ? value.toISOString() : value;
      } else if (key === 'lastFailureTime') {
        apiData.last_failure_time = value instanceof Date ? value.toISOString() : value;
      } else {
        apiData[key] = value;
      }
    }

    return apiData;
  }
}
