import { NotionService } from '../../services/NotionService';
import { MockedClient } from '../mocks/NotionClientMock';
import type {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  SearchResponse,
  PartialBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import { Client } from '@notionhq/client';

describe('NotionService - Operações com Blocos', () => {
  let notionService: NotionService;
  let mockClient: MockedClient;

  beforeEach(() => {
    mockClient = new MockedClient();
    notionService = new NotionService(mockClient as unknown as Client);
  });

  /**
   * ✓ Teste aprovado
   */
  it('deve listar os blocos filhos corretamente', async () => {
    const blockId = 'test-block-id';
    const mockResponse: ListBlockChildrenResponse = {
      object: 'list',
      results: [
        {
          object: 'block',
          id: 'block1',
          parent: {
            type: 'page_id',
            page_id: 'page1'
          },
          created_time: '2024-02-07T00:00:00.000Z',
          last_edited_time: '2024-02-07T00:00:00.000Z',
          created_by: {
            object: 'user',
            id: 'user1'
          },
          last_edited_by: {
            object: 'user',
            id: 'user1'
          },
          has_children: false,
          archived: false,
          type: 'paragraph',
          paragraph: {
            rich_text: [],
            color: 'default'
          },
          in_trash: false
        }
      ],
      next_cursor: null,
      has_more: false,
      type: 'block',
      block: {}
    };

    mockClient.blocks?.children.list?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.getBlockChildren(blockId);

    expect(mockClient.blocks?.children.list).toHaveBeenCalledWith({
      block_id: blockId
    });
    expect(result).toEqual(mockResponse);
  });

  describe('listBlocks', () => {
    const mockResponse: SearchResponse = {
      object: 'list',
      results: [
        {
          object: 'page',
          id: 'block1',
          created_time: '2024-02-07T00:00:00.000Z',
          last_edited_time: '2024-02-07T00:00:00.000Z',
          created_by: { object: 'user', id: 'user1' },
          last_edited_by: { object: 'user', id: 'user1' },
          cover: null,
          icon: null,
          parent: { type: 'page_id', page_id: 'page1' },
          archived: false,
          properties: {},
          url: 'https://notion.so/block1',
          public_url: null
        }
      ],
      next_cursor: null,
      has_more: false,
      type: 'page_or_database',
      page_or_database: {}
    };

    it('deve listar blocos sem parâmetros', async () => {
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listBlocks();

      expect(mockClient.search).toHaveBeenCalledWith({
        filter: {
          property: 'object',
          value: 'block'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar blocos com parâmetros sem filter', async () => {
      const params = { page_size: 10, start_cursor: 'cursor1' };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listBlocks(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        page_size: 10,
        start_cursor: 'cursor1',
        filter: {
          property: 'object',
          value: 'block'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar blocos com parâmetros incluindo filter', async () => {
      const params = {
        page_size: 10,
        filter: {
          property: 'type',
          value: 'paragraph'
        }
      };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listBlocks(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        page_size: 10,
        filter: {
          property: 'object',
          value: 'block'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar blocos com ordenação', async () => {
      const params = {
        sort: {
          direction: 'ascending',
          timestamp: 'last_edited_time'
        }
      };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listBlocks(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        sort: {
          direction: 'ascending',
          timestamp: 'last_edited_time'
        },
        filter: {
          property: 'object',
          value: 'block'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve validar a estrutura da resposta', async () => {
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listBlocks();

      expect(response).toHaveProperty('object', 'list');
      expect(response).toHaveProperty('results');
      expect(Array.isArray(response.results)).toBe(true);
      if (response.results && response.results.length > 0) {
        const block = response.results[0];
        expect(block).toHaveProperty('object');
        expect(block).toHaveProperty('id');
        expect(block).toHaveProperty('created_time');
        expect(block).toHaveProperty('last_edited_time');
        expect(block).toHaveProperty('archived');
      }
    });
  });

  it('deve obter um bloco corretamente', async () => {
    const blockId = 'test-block-id';
    const mockResponse: BlockObjectResponse = {
      object: 'block',
      id: blockId,
      parent: {
        type: 'page_id',
        page_id: 'page1'
      },
      created_time: '2024-02-07T00:00:00.000Z',
      last_edited_time: '2024-02-07T00:00:00.000Z',
      created_by: {
        object: 'user',
        id: 'user1'
      },
      last_edited_by: {
        object: 'user',
        id: 'user1'
      },
      has_children: false,
      archived: false,
      type: 'paragraph',
      paragraph: {
        rich_text: [],
        color: 'default'
      },
      in_trash: false
    };

    mockClient.blocks?.retrieve?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.getBlock(blockId);

    expect(mockClient.blocks?.retrieve).toHaveBeenCalledWith({
      block_id: blockId
    });
    expect(result).toEqual(mockResponse);
  });

  it('deve atualizar um bloco corretamente', async () => {
    const blockId = 'test-block-id';
    const params = {
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Updated content',
              link: null
            }
          }
        ]
      }
    };

    const mockResponse: BlockObjectResponse = {
      object: 'block',
      id: blockId,
      parent: {
        type: 'page_id',
        page_id: 'page1'
      },
      created_time: '2024-02-07T00:00:00.000Z',
      last_edited_time: '2024-02-07T00:00:00.000Z',
      created_by: {
        object: 'user',
        id: 'user1'
      },
      last_edited_by: {
        object: 'user',
        id: 'user1'
      },
      has_children: false,
      archived: false,
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Updated content',
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
            plain_text: 'Updated content',
            href: null
          }
        ],
        color: 'default'
      },
      in_trash: false
    };

    mockClient.blocks?.update?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.updateBlock(blockId, params);

    expect(mockClient.blocks?.update).toHaveBeenCalledWith({
      block_id: blockId,
      ...params
    });
    expect(result).toEqual(mockResponse);
  });

  it('deve deletar um bloco corretamente', async () => {
    const blockId = 'test-block-id';
    const mockResponse: BlockObjectResponse = {
      object: 'block',
      id: blockId,
      parent: {
        type: 'page_id',
        page_id: 'page1'
      },
      created_time: '2024-02-07T00:00:00.000Z',
      last_edited_time: '2024-02-07T00:00:00.000Z',
      created_by: {
        object: 'user',
        id: 'user1'
      },
      last_edited_by: {
        object: 'user',
        id: 'user1'
      },
      has_children: false,
      archived: true,
      type: 'paragraph',
      paragraph: {
        rich_text: [],
        color: 'default'
      },
      in_trash: false
    };

    mockClient.blocks?.delete?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.deleteBlock(blockId);

    expect(mockClient.blocks?.delete).toHaveBeenCalledWith({
      block_id: blockId
    });
    expect(result).toEqual(mockResponse);
  });
});
