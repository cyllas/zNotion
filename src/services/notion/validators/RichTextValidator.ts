import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { BaseValidator } from './BaseValidator';

export class RichTextValidator extends BaseValidator {
  private static instance: RichTextValidator;

  private constructor() {
    super();
  }

  public static getInstance(): RichTextValidator {
    if (!RichTextValidator.instance) {
      RichTextValidator.instance = new RichTextValidator();
    }
    return RichTextValidator.instance;
  }

  public validateRichText(richText: RichTextItemResponse): void {
    BaseValidator.validateString(richText.type, 'Tipo do texto');

    if (richText.type === 'text') {
      if (!richText.text || typeof richText.text.content !== 'string' || richText.text.content.trim() === '') {
        throw new Error('O texto deve ter um conteúdo válido');
      }
    }

    if (!richText.annotations) {
      throw new Error('O texto deve ter anotações definidas');
    }

    const validColors = ['default', 'gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red', 'gray_background', 'brown_background', 'orange_background', 'yellow_background', 'green_background', 'blue_background', 'purple_background', 'pink_background', 'red_background'];

    if (!validColors.includes(richText.annotations.color)) {
      throw new Error('A cor do texto deve ser válida');
    }

    if (typeof richText.annotations.bold !== 'boolean' ||
        typeof richText.annotations.italic !== 'boolean' ||
        typeof richText.annotations.strikethrough !== 'boolean' ||
        typeof richText.annotations.underline !== 'boolean' ||
        typeof richText.annotations.code !== 'boolean') {
      throw new Error('As anotações do texto devem ter valores booleanos válidos');
    }
  }
}
