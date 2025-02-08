import { NotionComment } from '../types/NotionTypes';
import { BaseValidator } from './BaseValidator';
import { RichTextValidator } from './RichTextValidator';

/**
 * Validador para comentários do Notion
 */
export class CommentValidator extends BaseValidator {
  private static instance: CommentValidator;

  private constructor() {
    super();
  }

  public static getInstance(): CommentValidator {
    if (!CommentValidator.instance) {
      CommentValidator.instance = new CommentValidator();
    }
    return CommentValidator.instance;
  }

  /**
   * Valida um comentário
   */
  public validateComment(comment: NotionComment): void {
    BaseValidator.validateString(comment.id, 'ID do comentário');

    // Validar richText
    if (!Array.isArray(comment.richText) || comment.richText.length === 0) {
      throw new Error('O comentário deve ter pelo menos um elemento de texto');
    }

    comment.richText.forEach((richText, index) => {
      try {
        RichTextValidator.getInstance().validateRichText(richText);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Erro no texto ${index + 1}: ${error.message}`);
        } else {
          throw new Error(`Erro no texto ${index + 1}: Erro desconhecido`);
        }
      }
    });

    // Validar parent
    if (!comment.parent || !comment.parent.type) {
      throw new Error('O comentário deve ter um parent válido');
    }

    if (comment.parent.type !== 'page_id' && comment.parent.type !== 'block_id') {
      throw new Error('O tipo do parent deve ser page_id ou block_id');
    }

    BaseValidator.validateString(comment.parent.page_id || comment.parent.block_id, 'ID do parent');

    // Validar campos opcionais
    if (comment.discussionId) {
      BaseValidator.validateString(comment.discussionId, 'ID da discussão');
    }

    BaseValidator.validateString(comment.createdTime, 'Data de criação');
    BaseValidator.validateString(comment.lastEditedTime, 'Data de última edição');

    // Validar createdBy
    if (!comment.createdBy || !comment.createdBy.id) {
      throw new Error('O comentário deve ter um autor válido');
    }

    BaseValidator.validateString(comment.createdBy.id, 'ID do autor');
    BaseValidator.validateString(comment.createdBy.name, 'Nome do autor');
    BaseValidator.validateString(comment.createdBy.type, 'Tipo do autor');

    // Validar resolved
    if (typeof comment.resolved !== 'boolean') {
      throw new Error('O campo resolved deve ser um booleano');
    }
  }
}
