import { RichTextValidator } from '../RichTextValidator';
import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

describe('RichTextValidator', () => {
  let validator: RichTextValidator;

  beforeEach(() => {
    validator = RichTextValidator.getInstance();
  });

  describe('Tipos de texto', () => {
    it('deve validar texto simples', () => {
      const richText: RichTextItemResponse = {
        type: 'text',
        text: {
          content: 'Texto simples',
          link: null
        },
        plain_text: 'Texto simples',
        href: null,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      };

      expect(() => validator.validateRichText(richText)).not.toThrow();
    });

    it('deve validar texto com link', () => {
      const richText: RichTextItemResponse = {
        type: 'text',
        text: {
          content: 'Texto com link',
          link: {
            url: 'https://exemplo.com'
          }
        },
        plain_text: 'Texto com link',
        href: 'https://exemplo.com',
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      };

      expect(() => validator.validateRichText(richText)).not.toThrow();
    });

    it('deve rejeitar texto sem conteúdo', () => {
      const richText: RichTextItemResponse = {
        type: 'text',
        text: {
          content: '',
          link: null
        },
        plain_text: '',
        href: null,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      };

      expect(() => validator.validateRichText(richText)).toThrow('O texto deve ter um conteúdo válido');
    });
  });

  describe('Cores', () => {
    const validColors = [
      'default',
      'gray',
      'brown',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
      'pink',
      'red',
      'gray_background',
      'brown_background',
      'orange_background',
      'yellow_background',
      'green_background',
      'blue_background',
      'purple_background',
      'pink_background',
      'red_background'
    ] as const;

    validColors.forEach(color => {
      it(`deve validar texto com cor ${color}`, () => {
        const richText: RichTextItemResponse = {
          type: 'text',
          text: {
            content: 'Texto colorido',
            link: null
          },
          plain_text: 'Texto colorido',
          href: null,
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color
          }
        };

        expect(() => validator.validateRichText(richText)).not.toThrow();
      });
    });

    it('deve rejeitar texto com cor inválida', () => {
      const richText: RichTextItemResponse = {
        type: 'text',
        text: {
          content: 'Texto com cor inválida',
          link: null
        },
        plain_text: 'Texto com cor inválida',
        href: null,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'invalid_color' as any
        }
      };

      expect(() => validator.validateRichText(richText)).toThrow('A cor do texto deve ser válida');
    });
  });

  describe('Anotações', () => {
    it('deve validar texto com todas as anotações', () => {
      const richText: RichTextItemResponse = {
        type: 'text',
        text: {
          content: 'Texto com todas as anotações',
          link: null
        },
        plain_text: 'Texto com todas as anotações',
        href: null,
        annotations: {
          bold: true,
          italic: true,
          strikethrough: true,
          underline: true,
          code: true,
          color: 'default'
        }
      };

      expect(() => validator.validateRichText(richText)).not.toThrow();
    });

    it('deve rejeitar texto sem anotações', () => {
      const richText: RichTextItemResponse = {
        type: 'text',
        text: {
          content: 'Texto sem anotações',
          link: null
        },
        plain_text: 'Texto sem anotações',
        href: null
      } as any;

      expect(() => validator.validateRichText(richText)).toThrow('O texto deve ter anotações definidas');
    });

    it('deve rejeitar texto com anotações inválidas', () => {
      const richText: RichTextItemResponse = {
        type: 'text',
        text: {
          content: 'Texto com anotações inválidas',
          link: null
        },
        plain_text: 'Texto com anotações inválidas',
        href: null,
        annotations: {
          bold: 'true' as any,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      };

      expect(() => validator.validateRichText(richText)).toThrow('As anotações do texto devem ter valores booleanos válidos');
    });
  });
});
