import { RichTextAdapter } from '../RichTextAdapter';
import { NotionRichText } from '../../types/NotionTypes';

describe('RichTextAdapter', () => {
  let adapter: RichTextAdapter;

  beforeEach(() => {
    adapter = new RichTextAdapter();
  });

  describe('adapt', () => {
    it('deve adaptar texto simples corretamente', () => {
      const richText = {
        type: 'text',
        text: {
          content: 'Texto de teste',
          link: null
        },
        plain_text: 'Texto de teste',
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

      const result = adapter.adapt(richText);

      expect(result).toEqual({
        type: 'text',
        text: {
          content: 'Texto de teste',
          link: null
        },
        plain_text: 'Texto de teste',
        href: null,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      });
    });

    it('deve adaptar texto com link corretamente', () => {
      const richText = {
        type: 'text',
        text: {
          content: 'Texto com link',
          link: {
            url: 'https://example.com'
          }
        },
        plain_text: 'Texto com link',
        href: 'https://example.com',
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      };

      const result = adapter.adapt(richText);

      expect(result).toEqual({
        type: 'text',
        text: {
          content: 'Texto com link',
          link: null
        },
        plain_text: 'Texto com link',
        href: null,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      });
    });
  });

  describe('adaptWithLink', () => {
    it('deve criar um rich text com link', () => {
      const result = RichTextAdapter.adaptWithLink('Texto com link', 'https://example.com');

      expect(result).toEqual({
        type: 'text',
        text: {
          content: 'Texto com link',
          link: {
            url: 'https://example.com'
          }
        },
        plain_text: 'Texto com link',
        href: 'https://example.com',
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      });
    });
  });

  describe('toPlainText', () => {
    it('deve converter array de rich text para texto plano', () => {
      const richTexts: NotionRichText[] = [
        {
          type: 'text',
          text: {
            content: 'Primeiro ',
            link: null
          },
          plain_text: 'Primeiro ',
          href: null,
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          }
        },
        {
          type: 'text',
          text: {
            content: 'segundo',
            link: null
          },
          plain_text: 'segundo',
          href: null,
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          }
        }
      ];

      const result = RichTextAdapter.toPlainText(richTexts);

      expect(result).toBe('Primeiro segundo');
    });
  });
});
