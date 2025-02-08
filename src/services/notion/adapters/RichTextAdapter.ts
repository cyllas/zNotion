import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { Adapter } from './types';
import { NotionRichText } from '../types/NotionTypes';

/**
 * Adaptador para converter rich text entre o formato da API e do domínio
 */
export class RichTextAdapter implements Adapter<RichTextItemResponse, NotionRichText> {
  /**
   * Converte um rich text da API para um objeto NotionRichText
   */
  adapt(from: RichTextItemResponse): NotionRichText {
    return {
      type: 'text',
      text: {
        content: from.plain_text || this.extractText(from),
        link: null
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
      },
      plain_text: from.plain_text || this.extractText(from),
      href: null
    };
  }

  /**
   * Cria um objeto de rich text simples
   */
  createSimpleText(content: string): RichTextItemResponse {
    return {
      type: 'text',
      text: {
        content,
        link: null
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
      },
      plain_text: content,
      href: null
    };
  }

  /**
   * Extrai o texto de um objeto rich text
   */
  private extractText(richText: RichTextItemResponse): string {
    switch (richText.type) {
      case 'text':
        return richText.text.content;
      case 'mention':
        if (richText.mention.type === 'user') {
          return `@${richText.mention.user.id}`;
        }
        if (richText.mention.type === 'date') {
          return richText.mention.date.start;
        }
        if (richText.mention.type === 'page') {
          return `[[${richText.mention.page.id}]]`;
        }
        if (richText.mention.type === 'database') {
          return `[[${richText.mention.database.id}]]`;
        }
        return '';
      case 'equation':
        return `$${richText.equation.expression}$`;
      default:
        return '';
    }
  }

  static adaptWithLink(richText: string, url: string): NotionRichText {
    return {
      type: 'text',
      text: {
        content: richText,
        link: {
          url: url
        }
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
      },
      plain_text: richText,
      href: url
    };
  }

  static toPlainText(richText: NotionRichText[]): string {
    return richText.map(item => item.plain_text).join('');
  }
}
