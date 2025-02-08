import { BlockAdapter } from '../BlockAdapter';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionBlock } from '../../types/NotionTypes';

describe('BlockAdapter', () => {
  let adapter: BlockAdapter;

  beforeEach(() => {
    adapter = new BlockAdapter();
  });

  it('deve converter blocos corretamente', () => {
    const input: BlockObjectResponse[] = [
      {
        object: 'block',
        id: 'block-1',
        type: 'paragraph',
        created_time: '2024-02-08T19:00:00.000Z',
        last_edited_time: '2024-02-08T19:01:00.000Z',
        has_children: false,
        archived: false,
        paragraph: {
          rich_text: [{ 
            type: 'text', 
            text: { 
              content: 'Teste', 
              link: null 
            },
            plain_text: 'Teste',
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
        }
      }
    ];

    const expected: NotionBlock[] = [{
      id: 'block-1',
      type: 'paragraph',
      created_time: '2024-02-08T19:00:00.000Z',
      last_edited_time: '2024-02-08T19:01:00.000Z',
      has_children: false,
      archived: false,
      paragraph: {
        rich_text: [{ 
          type: 'text', 
          text: { 
            content: 'Teste', 
            link: null 
          },
          plain_text: 'Teste',
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
      }
    }];

    const result = adapter.adapt(input);

    expect(result).toEqual({
      blocks: expected,
      nextCursor: null,
      hasMore: false
    });
  });

  it('deve lidar com array vazio de blocos', () => {
    const result = adapter.adapt([]);

    expect(result).toEqual({
      blocks: [],
      nextCursor: null,
      hasMore: false
    });
  });

  it('deve converter bloco de título corretamente', () => {
    const input: BlockObjectResponse[] = [
      {
        object: 'block',
        id: 'block-2',
        type: 'heading_1',
        created_time: '2024-02-08T19:00:00.000Z',
        last_edited_time: '2024-02-08T19:01:00.000Z',
        has_children: false,
        archived: false,
        heading_1: {
          rich_text: [{ 
            type: 'text', 
            text: { 
              content: 'Título', 
              link: null 
            },
            plain_text: 'Título',
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
        }
      }
    ];

    const expected: NotionBlock[] = [{
      id: 'block-2',
      type: 'heading_1',
      created_time: '2024-02-08T19:00:00.000Z',
      last_edited_time: '2024-02-08T19:01:00.000Z',
      has_children: false,
      archived: false,
      heading_1: {
        rich_text: [{ 
          type: 'text', 
          text: { 
            content: 'Título', 
            link: null 
          },
          plain_text: 'Título',
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
      }
    }];

    const result = adapter.adapt(input);

    expect(result).toEqual({
      blocks: expected,
      nextCursor: null,
      hasMore: false
    });
  });
});
