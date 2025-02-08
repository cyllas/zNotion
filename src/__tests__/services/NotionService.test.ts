import { NotionService } from '../../services/NotionService';
import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  DatabaseObjectResponse,
  BlockObjectResponse,
  SearchResponse,
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
  AppendBlockChildrenResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';

type EmptyObject = Record<string, never>;

const mockNotionClient = {
  pages: {
    create: jest.fn(),
    update: jest.fn(),
    retrieve: jest.fn()
  },
  databases: {
    create: jest.fn(),
    update: jest.fn(),
    retrieve: jest.fn(),
    query: jest.fn()
  },
  blocks: {
    children: {
      list: jest.fn(),
      append: jest.fn()
    },
    update: jest.fn(),
    delete: jest.fn(),
    retrieve: jest.fn()
  },
  search: jest.fn(),
  request: jest.fn(),
  users: {
    list: jest.fn(),
    retrieve: jest.fn(),
    me: jest.fn()
  },
  comments: {
    create: jest.fn(),
    list: jest.fn()
  },
  oauth: {
    createToken: jest.fn(),
    listPublicBotWorkspaces: jest.fn()
  }
} as unknown as jest.Mocked<Client>;

const notionService = new NotionService(mockNotionClient);

describe('NotionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listAllPages', () => {
    it('deve listar todas as páginas com paginação automática', async () => {
      const mockPage: PageObjectResponse = {
        id: 'page-1',
        object: 'page',
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-01T00:00:00.000Z',
        archived: false,
        icon: null,
        cover: null,
        created_by: {
          id: 'user-1',
          object: 'user'
        },
        last_edited_by: {
          id: 'user-1',
          object: 'user'
        },
        parent: {
          type: 'database_id',
          database_id: 'db-1'
        },
        properties: {},
        url: '',
        in_trash: false,
        public_url: null
      };

      const mockSearchResponse: SearchResponse = {
        type: 'page_or_database',
        object: 'list',
        results: [mockPage],
        has_more: false,
        next_cursor: null,
        page_or_database: {} as EmptyObject
      };

      jest.spyOn(mockNotionClient, 'search').mockResolvedValueOnce(mockSearchResponse);

      const result = await notionService.listAllPages();

      expect(result).toEqual([mockPage]);
      expect(mockNotionClient.search).toHaveBeenCalledWith({
        page_size: 100,
        filter: { property: 'object', value: 'page' }
      });
    });
  });

  describe('listAllDatabases', () => {
    it('deve listar todos os bancos de dados com paginação automática', async () => {
      const mockDatabase: DatabaseObjectResponse = {
        id: 'db-1',
        object: 'database',
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-01T00:00:00.000Z',
        icon: null,
        cover: null,
        created_by: {
          id: 'user-1',
          object: 'user'
        },
        last_edited_by: {
          id: 'user-1',
          object: 'user'
        },
        url: '',
        archived: false,
        title: [{
          type: 'text',
          text: {
            content: 'Test Database',
            link: null
          },
          plain_text: 'Test Database',
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          href: null
        }],
        description: [],
        properties: {},
        parent: {
          type: 'page_id',
          page_id: 'page-1'
        },
        is_inline: false,
        in_trash: false,
        public_url: null
      };

      const mockSearchResponse: SearchResponse = {
        type: 'page_or_database',
        object: 'list',
        results: [mockDatabase],
        has_more: false,
        next_cursor: null,
        page_or_database: {} as EmptyObject
      };

      jest.spyOn(mockNotionClient, 'search').mockResolvedValueOnce(mockSearchResponse);

      const result = await notionService.listAllDatabases();

      expect(result).toEqual([mockDatabase]);
      expect(mockNotionClient.search).toHaveBeenCalledWith({
        page_size: 100,
        filter: { property: 'object', value: 'database' }
      });
    });
  });

  describe('queryDatabaseAll', () => {
    it('deve consultar um banco de dados com paginação automática', async () => {
      const mockPage: PageObjectResponse = {
        id: 'page-1',
        object: 'page',
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-01T00:00:00.000Z',
        archived: false,
        icon: null,
        cover: null,
        created_by: {
          id: 'user-1',
          object: 'user'
        },
        last_edited_by: {
          id: 'user-1',
          object: 'user'
        },
        parent: {
          type: 'database_id',
          database_id: 'db-1'
        },
        properties: {},
        url: '',
        in_trash: false,
        public_url: null
      };

      const mockQueryResponse: QueryDatabaseResponse = {
        type: 'page_or_database',
        object: 'list',
        results: [mockPage],
        has_more: false,
        next_cursor: null,
        page_or_database: {} as EmptyObject
      };

      jest.spyOn(mockNotionClient.databases, 'query').mockResolvedValueOnce(mockQueryResponse);

      const databaseId = 'db-1';
      const filter = {
        property: 'Status',
        select: {
          equals: 'Done'
        }
      };

      const result = await notionService.queryDatabaseAll(databaseId, {
        filter
      });

      expect(result).toEqual([mockPage]);
      expect(mockNotionClient.databases.query).toHaveBeenCalledWith({
        database_id: databaseId,
        filter,
        page_size: 100
      });
    });
  });

  describe('listAllBlocks', () => {
    it('deve listar todos os blocos com paginação automática', async () => {
      const mockBlock: BlockObjectResponse = {
        id: 'block-1',
        object: 'block',
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-01T00:00:00.000Z',
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [],
          color: 'default'
        },
        parent: {
          type: 'page_id',
          page_id: 'page-1'
        },
        created_by: {
          id: 'user-1',
          object: 'user'
        },
        last_edited_by: {
          id: 'user-1',
          object: 'user'
        },
        in_trash: false
      };

      const mockListResponse: ListBlockChildrenResponse = {
        type: 'block',
        object: 'list',
        results: [mockBlock],
        has_more: false,
        next_cursor: null,
        block: {} as EmptyObject
      };

      jest.spyOn(mockNotionClient.blocks.children, 'list').mockResolvedValueOnce(mockListResponse);

      const blockId = 'block-1';
      const result = await notionService.listAllBlocks(blockId);

      expect(result).toEqual([mockBlock]);
      expect(mockNotionClient.blocks.children.list).toHaveBeenCalledWith({
        block_id: blockId,
        page_size: 100
      });
    });
  });

  describe('appendBlockChildren', () => {
    it('deve adicionar blocos filhos a um bloco existente', async () => {
      const mockBlock: BlockObjectResponse = {
        id: 'block-1',
        object: 'block',
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-01T00:00:00.000Z',
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [],
          color: 'default'
        },
        parent: {
          type: 'page_id',
          page_id: 'page-1'
        },
        created_by: {
          id: 'user-1',
          object: 'user'
        },
        last_edited_by: {
          id: 'user-1',
          object: 'user'
        },
        in_trash: false
      };

      const mockAppendResponse: AppendBlockChildrenResponse = {
        type: 'block',
        object: 'list',
        results: [mockBlock],
        next_cursor: null,
        has_more: false,
        block: {} as EmptyObject
      };

      jest.spyOn(mockNotionClient.blocks.children, 'append').mockResolvedValueOnce(mockAppendResponse);

      const blockId = 'block-1';
      const children = [{
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: {
              content: 'Hello World'
            }
          }]
        }
      }];

      const result = await notionService.appendBlockChildren(blockId, children);

      expect(result).toEqual([mockBlock]);
      expect(mockNotionClient.blocks.children.append).toHaveBeenCalledWith({
        block_id: blockId,
        children
      });
    });
  });
});
