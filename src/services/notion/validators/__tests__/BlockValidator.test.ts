import { BlockValidator } from '../BlockValidator';
import { NotionBlock } from '../../types/NotionBlock';

describe('BlockValidator', () => {
  describe('validateBlock', () => {
    const validParagraphBlock: NotionBlock = {
      type: 'paragraph',
      paragraph: {
        rich_text: [{
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
        }],
        color: 'default'
      },
      id: 'block-id',
      created_time: '2023-01-01T00:00:00.000Z',
      last_edited_time: '2023-01-01T00:00:00.000Z',
      has_children: false,
      archived: false
    };

    it('deve aceitar um bloco de parágrafo válido', () => {
      expect(() => BlockValidator.validateBlock(validParagraphBlock)).not.toThrow();
    });

    const validHeadingBlock: NotionBlock = {
      type: 'heading_1',
      heading_1: {
        rich_text: [{
          type: 'text',
          text: {
            content: 'Título de teste',
            link: null
          },
          plain_text: 'Título de teste',
          href: null,
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          }
        }],
        color: 'default',
        is_toggleable: false
      },
      id: 'block-id',
      created_time: '2023-01-01T00:00:00.000Z',
      last_edited_time: '2023-01-01T00:00:00.000Z',
      has_children: false,
      archived: false
    };

    it('deve aceitar um bloco de título válido', () => {
      expect(() => BlockValidator.validateBlock(validHeadingBlock)).not.toThrow();
    });

    it('deve rejeitar um bloco sem tipo', () => {
      const invalidBlock = { ...validParagraphBlock, type: undefined };
      expect(() => BlockValidator.validateBlock(invalidBlock)).toThrow();
    });

    it('deve rejeitar um bloco com tipo inválido', () => {
      const invalidBlock = { ...validParagraphBlock, type: 'invalid_type' };
      expect(() => BlockValidator.validateBlock(invalidBlock)).toThrow();
    });

    it('deve rejeitar um bloco sem conteúdo', () => {
      const invalidBlock = { ...validParagraphBlock, paragraph: undefined };
      expect(() => BlockValidator.validateBlock(invalidBlock)).toThrow();
    });
  });
});
