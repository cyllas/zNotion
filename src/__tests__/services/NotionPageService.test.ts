import { NotionService } from '../../services/NotionService';
import { MockedClient } from '../mocks/NotionClientMock';
import type {
  PageObjectResponse,
  UpdatePageParameters,
  CreatePageParameters,
  SearchResponse
} from '@notionhq/client/build/src/api-endpoints';
import { Client } from '@notionhq/client';

describe('NotionService - Operações com Páginas', () => {
  let notionService: NotionService;
  let mockClient: MockedClient;

  beforeEach(() => {
    mockClient = new MockedClient();
    notionService = new NotionService(mockClient as unknown as Client);
  });

  describe('listPages', () => {
    const mockResponse: SearchResponse = {
      object: 'list',
      results: [
        {
          object: 'page',
          id: 'page1',
          created_time: '2024-02-07T00:00:00.000Z',
          last_edited_time: '2024-02-07T00:00:00.000Z',
          created_by: { object: 'user', id: 'user1' },
          last_edited_by: { object: 'user', id: 'user1' },
          cover: null,
          icon: null,
          parent: { type: 'database_id', database_id: 'database1' },
          archived: false,
          properties: {},
          url: 'https://notion.so/page1',
          public_url: null
        }
      ],
      next_cursor: null,
      has_more: false,
      type: 'page_or_database',
      page_or_database: {}
    };

    it('deve listar páginas sem parâmetros', async () => {
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listPages();

      expect(mockClient.search).toHaveBeenCalledWith({
        filter: {
          property: 'object',
          value: 'page'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar páginas com parâmetros sem filter', async () => {
      const params = { page_size: 10, start_cursor: 'cursor1' };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listPages(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        page_size: 10,
        start_cursor: 'cursor1',
        filter: {
          property: 'object',
          value: 'page'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar páginas com parâmetros incluindo filter', async () => {
      const params = {
        page_size: 10,
        filter: {
          property: 'title',
          text: { contains: 'Test' }
        }
      };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listPages(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        page_size: 10,
        filter: {
          property: 'object',
          value: 'page',
          text: { contains: 'Test' }
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar páginas com ordenação', async () => {
      const params = {
        sort: {
          direction: 'ascending',
          timestamp: 'last_edited_time'
        }
      };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listPages(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        sort: {
          direction: 'ascending',
          timestamp: 'last_edited_time'
        },
        filter: {
          property: 'object',
          value: 'page'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve validar a estrutura da resposta', async () => {
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listPages();

      expect(response).toHaveProperty('object', 'list');
      expect(response).toHaveProperty('results');
      expect(Array.isArray(response.results)).toBe(true);
      if (response.results && response.results.length > 0) {
        const page = response.results[0];
        expect(page).toHaveProperty('object', 'page');
        expect(page).toHaveProperty('id');
        expect(page).toHaveProperty('created_time');
        expect(page).toHaveProperty('last_edited_time');
        expect(page).toHaveProperty('properties');
        expect(page).toHaveProperty('url');
      }
    });
  });

  /**
   * ✓ Teste aprovado
   */
  it('deve atualizar uma página corretamente', async () => {
    const pageId = 'test-page-id';
    const properties: UpdatePageParameters['properties'] = {
      title: [
        {
          type: 'text',
          text: {
            content: 'Updated Page',
            link: null
          }
        }
      ]
    };

    const mockResponse: PageObjectResponse = {
      object: 'page',
      id: pageId,
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
      cover: null,
      icon: null,
      parent: {
        type: 'database_id',
        database_id: 'database1'
      },
      archived: false,
      properties: {
        'Title': {
          id: 'title',
          type: 'title',
          title: [{
            type: 'text',
            text: {
              content: 'Updated Page',
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
            plain_text: 'Updated Page',
            href: null
          }]
        }
      },
      url: 'https://notion.so/page1',
      public_url: null,
      in_trash: false
    };

    mockClient.pages?.update?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.updatePage(pageId, properties);

    expect(mockClient.pages?.update).toHaveBeenCalledWith({
      page_id: pageId,
      properties
    });
    expect(result).toEqual(mockResponse);
  });

  it('deve obter uma página corretamente', async () => {
    const pageId = 'test-page-id';
    const mockResponse: PageObjectResponse = {
      object: 'page',
      id: pageId,
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
      cover: null,
      icon: null,
      parent: {
        type: 'database_id',
        database_id: 'database1'
      },
      archived: false,
      properties: {},
      url: 'https://notion.so/page1',
      public_url: null,
      in_trash: false
    };

    mockClient.pages?.retrieve?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.getPage(pageId);

    expect(mockClient.pages?.retrieve).toHaveBeenCalledWith({
      page_id: pageId
    });
    expect(result).toEqual(mockResponse);
  });

  it('deve criar uma página corretamente', async () => {
    const params: CreatePageParameters = {
      parent: {
        database_id: 'database1'
      },
      properties: {
        title: [
          {
            type: 'text',
            text: {
              content: 'New Page',
              link: null
            }
          }
        ]
      }
    };

    const mockResponse: PageObjectResponse = {
      object: 'page',
      id: 'new-page-id',
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
      cover: null,
      icon: null,
      parent: {
        type: 'database_id',
        database_id: 'database1'
      },
      archived: false,
      properties: {
        'Title': {
          id: 'title',
          type: 'title',
          title: [{
            type: 'text',
            text: {
              content: 'New Page',
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
            plain_text: 'New Page',
            href: null
          }]
        }
      },
      url: 'https://notion.so/new-page',
      public_url: null,
      in_trash: false
    };

    mockClient.pages?.create?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.createPage(params);

    expect(mockClient.pages?.create).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockResponse);
  });

  it('deve arquivar uma página corretamente', async () => {
    const pageId = 'test-page-id';
    const mockResponse: PageObjectResponse = {
      object: 'page',
      id: pageId,
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
      cover: null,
      icon: null,
      parent: {
        type: 'database_id',
        database_id: 'database1'
      },
      archived: true,
      properties: {},
      url: 'https://notion.so/page1',
      public_url: null,
      in_trash: false
    };

    mockClient.pages?.update?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.archivePage(pageId);

    expect(mockClient.pages?.update).toHaveBeenCalledWith({
      page_id: pageId,
      archived: true
    });
    expect(result).toEqual(mockResponse);
  });
});
