import { NotionBlock, NotionBlockType, NotionRichText } from '../types/NotionTypes';
import { BaseValidator } from './BaseValidator';

/**
 * Validador para blocos do Notion
 */
export class BlockValidator extends BaseValidator {
  /**
   * Valida um bloco do Notion
   */
  static validateBlock(block: NotionBlock): void {
    this.validateString(block.id, 'ID do bloco');
    this.validateString(block.type, 'Tipo do bloco');
    this.validateString(block.created_time, 'Data de criação');
    this.validateString(block.last_edited_time, 'Data da última edição');
    this.validateBoolean(block.has_children, 'Tem filhos');
    this.validateBoolean(block.archived, 'Arquivado');

    switch (block.type) {
      case 'paragraph':
        this.validateParagraphBlock(block);
        break;
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        this.validateHeadingBlock(block);
        break;
      case 'bulleted_list_item':
      case 'numbered_list_item':
        this.validateListBlock(block);
        break;
      case 'to_do':
        this.validateToDoBlock(block);
        break;
      case 'toggle':
        this.validateToggleBlock(block);
        break;
      case 'code':
        this.validateCodeBlock(block);
        break;
      case 'quote':
        this.validateQuoteBlock(block);
        break;
      case 'callout':
        this.validateCalloutBlock(block);
        break;
      case 'image':
      case 'video':
      case 'file':
      case 'pdf':
        this.validateMediaBlock(block);
        break;
      case 'bookmark':
        this.validateBookmarkBlock(block);
        break;
      // Adicione mais casos conforme necessário
    }
  }

  /**
   * Valida rich text
   */
  private static validateRichText(richText: NotionRichText[]): void {
    this.validateArray(richText, 'Rich text');
    richText.forEach((item, index) => {
      this.validateString(item.type, `Rich text ${index} tipo`);
      this.validateObject(item.text, `Rich text ${index} texto`);
      this.validateString(item.text.content, `Rich text ${index} conteúdo`);
    });
  }

  /**
   * Valida bloco de parágrafo
   */
  private static validateParagraphBlock(block: NotionBlock & { type: 'paragraph' }): void {
    this.validateObject(block.paragraph, 'Conteúdo do parágrafo');
    this.validateRichText(block.paragraph.rich_text);
  }

  /**
   * Valida bloco de cabeçalho
   */
  private static validateHeadingBlock(block: NotionBlock & { type: 'heading_1' | 'heading_2' | 'heading_3' }): void {
    const content = block[block.type];
    this.validateObject(content, `Conteúdo do cabeçalho ${block.type}`);
    this.validateRichText(content.rich_text);
  }

  /**
   * Valida bloco de lista
   */
  private static validateListBlock(block: NotionBlock & { type: 'bulleted_list_item' | 'numbered_list_item' }): void {
    const content = block[block.type];
    this.validateObject(content, `Conteúdo do item de lista ${block.type}`);
    this.validateRichText(content.rich_text);
  }

  /**
   * Valida bloco de tarefa
   */
  private static validateToDoBlock(block: NotionBlock & { type: 'to_do' }): void {
    this.validateObject(block.to_do, 'Conteúdo da tarefa');
    this.validateRichText(block.to_do.rich_text);
    this.validateBoolean(block.to_do.checked, 'Status da tarefa');
  }

  /**
   * Valida bloco de alternância
   */
  private static validateToggleBlock(block: NotionBlock & { type: 'toggle' }): void {
    this.validateObject(block.toggle, 'Conteúdo da alternância');
    this.validateRichText(block.toggle.rich_text);
  }

  /**
   * Valida bloco de código
   */
  private static validateCodeBlock(block: NotionBlock & { type: 'code' }): void {
    this.validateObject(block.code, 'Conteúdo do código');
    this.validateRichText(block.code.rich_text);
    this.validateString(block.code.language, 'Linguagem do código');
  }

  /**
   * Valida bloco de citação
   */
  private static validateQuoteBlock(block: NotionBlock & { type: 'quote' }): void {
    this.validateObject(block.quote, 'Conteúdo da citação');
    this.validateRichText(block.quote.rich_text);
  }

  /**
   * Valida bloco de chamada
   */
  private static validateCalloutBlock(block: NotionBlock & { type: 'callout' }): void {
    this.validateObject(block.callout, 'Conteúdo da chamada');
    this.validateRichText(block.callout.rich_text);
  }

  /**
   * Valida bloco de mídia
   */
  private static validateMediaBlock(block: NotionBlock & { type: 'image' | 'video' | 'file' | 'pdf' }): void {
    const content = block[block.type];
    this.validateObject(content, `Conteúdo da mídia ${block.type}`);
    this.validateString(content.type, 'Tipo da mídia');
    
    if (content.type === 'external') {
      this.validateUrl(content.external.url, 'URL da mídia');
    } else if (content.type === 'file') {
      this.validateUrl(content.file.url, 'URL do arquivo');
      this.validateString(content.file.expiry_time, 'Tempo de expiração');
    }
  }

  /**
   * Valida bloco de bookmark
   */
  private static validateBookmarkBlock(block: NotionBlock & { type: 'bookmark' }): void {
    this.validateObject(block.bookmark, 'Conteúdo do bookmark');
    this.validateUrl(block.bookmark.url, 'URL do bookmark');
  }
}
