import { NotionService } from '../../services/NotionService';
import { MockedClient } from '../mocks/NotionClientMock';
import type {
  QueryDatabaseParameters,
  CreateDatabaseParameters,
  UpdateDatabaseParameters,
  DatabaseObjectResponse,
  QueryDatabaseResponse,
  SearchResponse
} from '@notionhq/client/build/src/api-endpoints';
import { Client } from '@notionhq/client';

describe('NotionService - Operações com Bancos de Dados', () => {
  let notionService: NotionService;
  let mockClient: MockedClient;

  beforeEach(() => {
    mockClient = new MockedClient();
    notionService = new NotionService(mockClient as unknown as Client);
  });

  /**
   * ✓ Teste aprovado
   */
  it('deve consultar um banco de dados corretamente', async () => {
    const databaseId = 'test-database-id';
    const params: Partial<QueryDatabaseParameters> = {
      filter: {
        property: 'Status',
        select: {
          equals: 'Done'
        }
      }
    };

    const mockResponse: QueryDatabaseResponse = {
      object: 'list',
      results: [
        {
          object: 'page',
          id: 'page1',
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
            database_id: databaseId
          },
          archived: false,
          properties: {},
          url: 'https://notion.so/page1',
          public_url: null,
          in_trash: false
        }
      ],
      has_more: false,
      next_cursor: null,
      type: 'page_or_database',
      page_or_database: {}
    };

    mockClient.databases?.query?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.queryDatabase(databaseId, params);

    expect(mockClient.databases?.query).toHaveBeenCalledWith({
      database_id: databaseId,
      ...params
    });
    expect(result).toEqual(mockResponse);
  });

  describe('NotionService', () => {
    it('deve criar instância com cliente padrão', () => {
      const service = new NotionService();
      expect(service).toBeInstanceOf(NotionService);
    });

    it('deve criar instância com cliente customizado', () => {
      const customClient = new MockedClient() as unknown as Client;
      const service = new NotionService(customClient);
      expect(service).toBeInstanceOf(NotionService);
    });
  });

  describe('queryDatabase', () => {
    const databaseId = 'test-database-id';

    it('deve consultar banco de dados sem parâmetros', async () => {
      const expectedResponse = { results: [] };
      mockClient.databases.query.mockResolvedValueOnce(expectedResponse);

      const response = await notionService.queryDatabase(databaseId);

      expect(mockClient.databases.query).toHaveBeenCalledWith({
        database_id: databaseId
      });
      expect(response).toEqual(expectedResponse);
    });

    it('deve consultar banco de dados com parâmetros', async () => {
      const params = {
        page_size: 10,
        sorts: [{ property: 'name', direction: 'ascending' as const }]
      };
      const expectedResponse = { results: [] };
      mockClient.databases.query.mockResolvedValueOnce(expectedResponse);

      const response = await notionService.queryDatabase(databaseId, params);

      expect(mockClient.databases.query).toHaveBeenCalledWith({
        database_id: databaseId,
        page_size: 10,
        sorts: [{ property: 'name', direction: 'ascending' }]
      });
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('updateDatabase', () => {
    const databaseId = 'test-database-id';

    it('deve atualizar banco de dados com parâmetros mínimos', async () => {
      const params = {};
      const expectedResponse = { id: databaseId };
      mockClient.databases.update.mockResolvedValueOnce(expectedResponse);

      const response = await notionService.updateDatabase(databaseId, params);

      expect(mockClient.databases.update).toHaveBeenCalledWith({
        database_id: databaseId
      });
      expect(response).toEqual(expectedResponse);
    });

    it('deve atualizar banco de dados com parâmetros completos', async () => {
      const params = {
        title: [{ text: { content: 'Novo Título' } }],
        description: [{ text: { content: 'Nova Descrição' } }]
      };
      const expectedResponse = { id: databaseId };
      mockClient.databases.update.mockResolvedValueOnce(expectedResponse);

      const response = await notionService.updateDatabase(databaseId, params);

      expect(mockClient.databases.update).toHaveBeenCalledWith({
        database_id: databaseId,
        title: [{ text: { content: 'Novo Título' } }],
        description: [{ text: { content: 'Nova Descrição' } }]
      });
      expect(response).toEqual(expectedResponse);
    });

    it('deve atualizar banco de dados com parâmetros vazios', async () => {
      const params = {} as Partial<UpdateDatabaseParameters>;
      const expectedResponse = { id: databaseId };
      mockClient.databases.update.mockResolvedValueOnce(expectedResponse);

      const response = await notionService.updateDatabase(databaseId, params);

      expect(mockClient.databases.update).toHaveBeenCalledWith({
        database_id: databaseId
      });
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('listDatabases', () => {
    const mockResponse: SearchResponse = {
      object: 'list',
      results: [
        {
          object: 'database',
          id: 'database1',
          created_time: '2024-02-07T00:00:00.000Z',
          last_edited_time: '2024-02-07T00:00:00.000Z',
          created_by: { object: 'user', id: 'user1' },
          last_edited_by: { object: 'user', id: 'user1' },
          cover: null,
          icon: null,
          parent: { type: 'workspace', workspace: true },
          archived: false,
          properties: {},
          url: 'https://notion.so/database1',
          public_url: null,
          title: [{ 
            type: 'text', 
            text: { 
              content: 'Test Database',
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
            plain_text: 'Test Database',
            href: null
          }]
        }
      ],
      next_cursor: null,
      has_more: false,
      type: 'page_or_database',
      page_or_database: {}
    };

    it('deve listar bancos de dados sem parâmetros', async () => {
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listDatabases();

      expect(mockClient.search).toHaveBeenCalledWith({
        filter: {
          property: 'object',
          value: 'database'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar bancos de dados com parâmetros sem filter', async () => {
      const params = { page_size: 10, start_cursor: 'cursor1' };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listDatabases(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        page_size: 10,
        start_cursor: 'cursor1',
        filter: {
          property: 'object',
          value: 'database'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar bancos de dados com parâmetros incluindo filter', async () => {
      const params = {
        page_size: 10,
        filter: {
          property: 'title',
          text: { contains: 'Test' }
        }
      };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listDatabases(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        page_size: 10,
        filter: {
          property: 'object',
          value: 'database',
          text: { contains: 'Test' }
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve listar bancos de dados com ordenação', async () => {
      const params = {
        sort: {
          direction: 'ascending',
          timestamp: 'last_edited_time'
        }
      };
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listDatabases(params);

      expect(mockClient.search).toHaveBeenCalledWith({
        sort: {
          direction: 'ascending',
          timestamp: 'last_edited_time'
        },
        filter: {
          property: 'object',
          value: 'database'
        }
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve validar a estrutura da resposta', async () => {
      mockClient.search.mockResolvedValueOnce(mockResponse);

      const response = await notionService.listDatabases();

      expect(response).toHaveProperty('object', 'list');
      expect(response).toHaveProperty('results');
      expect(Array.isArray(response.results)).toBe(true);
      if (response.results && response.results.length > 0) {
        const database = response.results[0];
        expect(database).toHaveProperty('object', 'database');
        expect(database).toHaveProperty('id');
        expect(database).toHaveProperty('created_time');
        expect(database).toHaveProperty('last_edited_time');
        expect(database).toHaveProperty('properties');
        expect(database).toHaveProperty('url');
        expect(database).toHaveProperty('title');
      }
    });
  });

  it('deve obter um banco de dados corretamente', async () => {
    const databaseId = 'test-database-id';
    const mockResponse: DatabaseObjectResponse = {
      object: 'database',
      id: databaseId,
      created_time: '2024-02-07T00:00:00.000Z',
      last_edited_time: '2024-02-07T00:00:00.000Z',
      icon: null,
      cover: null,
      title: [],
      description: [],
      properties: {
        Name: {
          id: 'title',
          name: 'Name',
          type: 'title',
          title: {},
          description: null
        }
      },
      parent: {
        type: 'page_id',
        page_id: 'page1'
      },
      url: 'https://notion.so/database1',
      public_url: null,
      archived: false,
      is_inline: false,
      created_by: {
        object: 'user',
        id: 'user1'
      },
      last_edited_by: {
        object: 'user',
        id: 'user1'
      },
      in_trash: false
    };

    mockClient.databases?.retrieve?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.getDatabase(databaseId);

    expect(mockClient.databases?.retrieve).toHaveBeenCalledWith({
      database_id: databaseId
    });
    expect(result).toEqual(mockResponse);
  });

  it('deve criar um banco de dados corretamente', async () => {
    const params: CreateDatabaseParameters = {
      parent: {
        page_id: 'page1'
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'New Database',
            link: null
          }
        }
      ],
      properties: {
        Name: {
          title: {},
          type: 'title'
        }
      }
    };

    const mockResponse: DatabaseObjectResponse = {
      object: 'database',
      id: 'new-database-id',
      created_time: '2024-02-07T00:00:00.000Z',
      last_edited_time: '2024-02-07T00:00:00.000Z',
      icon: null,
      cover: null,
      title: [
        {
          type: 'text',
          text: {
            content: 'New Database',
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
          plain_text: 'New Database',
          href: null
        }
      ],
      description: [],
      properties: {
        Name: {
          id: 'title',
          name: 'Name',
          type: 'title',
          title: {},
          description: null
        }
      },
      parent: {
        type: 'page_id',
        page_id: 'page1'
      },
      url: 'https://notion.so/new-database',
      public_url: null,
      archived: false,
      is_inline: false,
      created_by: {
        object: 'user',
        id: 'user1'
      },
      last_edited_by: {
        object: 'user',
        id: 'user1'
      },
      in_trash: false
    };

    mockClient.databases?.create?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.createDatabase(params);

    expect(mockClient.databases?.create).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockResponse);
  });

  it('deve atualizar um banco de dados corretamente', async () => {
    const databaseId = 'test-database-id';
    const params: Partial<UpdateDatabaseParameters> = {
      title: [
        {
          type: 'text',
          text: {
            content: 'Updated Database',
            link: null
          }
        }
      ]
    };

    const mockResponse: DatabaseObjectResponse = {
      object: 'database',
      id: databaseId,
      created_time: '2024-02-07T00:00:00.000Z',
      last_edited_time: '2024-02-07T00:00:00.000Z',
      icon: null,
      cover: null,
      title: [
        {
          type: 'text',
          text: {
            content: 'Updated Database',
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
          plain_text: 'Updated Database',
          href: null
        }
      ],
      description: [],
      properties: {
        Name: {
          id: 'title',
          name: 'Name',
          type: 'title',
          title: {},
          description: null
        }
      },
      parent: {
        type: 'page_id',
        page_id: 'page1'
      },
      url: 'https://notion.so/database1',
      public_url: null,
      archived: false,
      is_inline: false,
      created_by: {
        object: 'user',
        id: 'user1'
      },
      last_edited_by: {
        object: 'user',
        id: 'user1'
      },
      in_trash: false
    };

    mockClient.databases?.update?.mockResolvedValueOnce(mockResponse);

    const result = await notionService.updateDatabase(databaseId, params);

    expect(mockClient.databases?.update).toHaveBeenCalledWith({
      database_id: databaseId,
      ...params
    });
    expect(result).toEqual(mockResponse);
  });
});
