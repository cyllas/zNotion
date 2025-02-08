import { Client } from '@notionhq/client';
import { jest } from '@jest/globals';
import { 
  CreatePageResponse,
  CreateCommentResponse,
  QueryDatabaseResponse,
  AppendBlockChildrenResponse
} from '@notionhq/client/build/src/api-endpoints';

export type MockedClient = jest.Mocked<Client>;

export const createMockClient = (): MockedClient => {
  return {
    blocks: {
      retrieve: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      children: {
        append: jest.fn(),
        list: jest.fn()
      }
    },
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
    comments: {
      create: jest.fn(),
      list: jest.fn()
    },
    search: jest.fn(),
    users: {
      retrieve: jest.fn(),
      list: jest.fn()
    },
    request: jest.fn()
  } as unknown as MockedClient;
};

export class NotionClientMock {
  private static defaultPageResponse: CreatePageResponse = {
    id: 'test-page-id',
    object: 'page',
    created_time: '2023-01-01T00:00:00.000Z',
    last_edited_time: '2023-01-01T00:00:00.000Z',
    archived: false,
    properties: {},
    parent: {
      type: 'database_id',
      database_id: 'test-database-id'
    },
    url: 'https://notion.so/test-page',
    public_url: null
  };

  private static defaultDatabaseResponse = {
    object: 'database',
    id: 'test-database-id',
    created_time: '2023-01-01T00:00:00.000Z',
    last_edited_time: '2023-01-01T00:00:00.000Z',
    title: [],
    properties: {},
    parent: {
      type: 'page_id' as const,
      page_id: 'test-page-id'
    },
    url: 'https://notion.so/test-database',
    archived: false,
    is_inline: false
  };

  private static defaultBlockResponse: any = {
    id: 'test-block-id',
    type: 'paragraph',
    created_time: '2023-01-01T00:00:00.000Z',
    last_edited_time: '2023-01-01T00:00:00.000Z',
    has_children: false,
    archived: false,
    in_trash: false,
    parent: {
      type: 'page_id',
      page_id: 'test-page-id'
    },
    paragraph: {
      rich_text: [{
        type: 'text',
        text: { content: 'Test Block', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        },
        plain_text: 'Test Block',
        href: null
      }],
      color: 'default'
    },
    object: 'block',
    created_by: {
      id: 'user-id',
      object: 'user'
    },
    last_edited_by: {
      id: 'user-id',
      object: 'user'
    }
  };

  static createMock(): MockedClient {
    const mock = createMockClient();

    mock.pages.create.mockResolvedValue({ ...this.defaultPageResponse });
    mock.pages.update.mockResolvedValue({ ...this.defaultPageResponse });
    mock.pages.retrieve.mockResolvedValue({ ...this.defaultPageResponse });

    mock.databases.create.mockResolvedValue({ ...this.defaultDatabaseResponse });
    mock.databases.update.mockResolvedValue({ ...this.defaultDatabaseResponse });
    mock.databases.retrieve.mockResolvedValue({ ...this.defaultDatabaseResponse });
    mock.databases.query.mockResolvedValue({
      object: 'list',
      results: [this.defaultPageResponse],
      has_more: false,
      next_cursor: null,
      type: 'page_or_database',
      page_or_database: {}
    });

    mock.blocks.children.list.mockResolvedValue({
      object: 'list',
      results: [this.defaultBlockResponse],
      has_more: false,
      next_cursor: null,
      type: 'block',
      block: {}
    });
    mock.blocks.children.append.mockResolvedValue({
      object: 'list',
      results: [this.defaultBlockResponse],
      type: 'block',
      block: {},
      next_cursor: null,
      has_more: false
    });
    mock.blocks.update.mockResolvedValue({ ...this.defaultBlockResponse });
    mock.blocks.delete.mockResolvedValue({ ...this.defaultBlockResponse });
    mock.blocks.retrieve.mockResolvedValue({ ...this.defaultBlockResponse });

    mock.search.mockResolvedValue({
      object: 'list',
      results: [this.defaultPageResponse],
      has_more: false,
      next_cursor: null,
      type: 'page_or_database',
      page_or_database: {}
    });

    return mock;
  }

  static createErrorMock(error: Error): MockedClient {
    const mock = createMockClient();

    // Mock all methods to reject with the error
    mock.request.mockRejectedValue(error);
    mock.comments.create.mockRejectedValue(error);
    mock.comments.list.mockRejectedValue(error);
    mock.pages.create.mockRejectedValue(error);
    mock.pages.update.mockRejectedValue(error);
    mock.pages.retrieve.mockRejectedValue(error);
    mock.databases.create.mockRejectedValue(error);
    mock.databases.update.mockRejectedValue(error);
    mock.databases.retrieve.mockRejectedValue(error);
    mock.databases.query.mockRejectedValue(error);
    mock.blocks.children.list.mockRejectedValue(error);
    mock.blocks.children.append.mockRejectedValue(error);
    mock.blocks.update.mockRejectedValue(error);
    mock.blocks.delete.mockRejectedValue(error);
    mock.blocks.retrieve.mockRejectedValue(error);
    mock.search.mockRejectedValue(error);

    return mock;
  }
}
