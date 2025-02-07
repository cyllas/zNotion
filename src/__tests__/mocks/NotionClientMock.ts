import { Client } from '@notionhq/client';
import type { 
  CreatePageParameters,
  UpdatePageParameters,
  GetPageParameters,
  PageObjectResponse,
  CreateDatabaseParameters,
  UpdateDatabaseParameters,
  GetDatabaseParameters,
  DatabaseObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
  GetBlockResponse,
  UpdateBlockParameters,
  DeleteBlockResponse,
  BlockObjectResponse,
  CreateCommentParameters,
  CreateCommentResponse,
  ListCommentsParameters,
  ListCommentsResponse,
  SearchParameters,
  ListUsersResponse,
  SearchResponse
} from '@notionhq/client/build/src/api-endpoints';

type FunctionLike = (...args: any[]) => any;
type MockedFunction<T extends FunctionLike> = jest.MockedFunction<T>;

/**
 * Interface base para o cliente mockado do Notion
 * Esta interface define todos os métodos e propriedades que podem ser mockados nos testes
 */
export interface BaseMockedClient {
  pages?: {
    create?: MockedFunction<(args: CreatePageParameters) => Promise<PageObjectResponse>>;
    update?: MockedFunction<(args: UpdatePageParameters) => Promise<PageObjectResponse>>;
    retrieve?: MockedFunction<(args: GetPageParameters) => Promise<PageObjectResponse>>;
    properties?: {
      retrieve?: MockedFunction<(args: { page_id: string }) => Promise<any>>;
    }
  };
  databases?: {
    create?: MockedFunction<(args: CreateDatabaseParameters) => Promise<DatabaseObjectResponse>>;
    update?: MockedFunction<(args: UpdateDatabaseParameters) => Promise<DatabaseObjectResponse>>;
    retrieve?: MockedFunction<(args: GetDatabaseParameters) => Promise<DatabaseObjectResponse>>;
    query?: MockedFunction<(args: QueryDatabaseParameters) => Promise<QueryDatabaseResponse>>;
    list?: MockedFunction<() => Promise<any>>;
  };
  blocks?: {
    retrieve?: MockedFunction<(args: { block_id: string }) => Promise<GetBlockResponse>>;
    update?: MockedFunction<(args: UpdateBlockParameters) => Promise<BlockObjectResponse>>;
    delete?: MockedFunction<(args: { block_id: string }) => Promise<DeleteBlockResponse>>;
    children?: {
      list?: MockedFunction<(args: ListBlockChildrenParameters) => Promise<ListBlockChildrenResponse>>;
      append?: MockedFunction<(args: { block_id: string; children: Array<any> }) => Promise<{ results: BlockObjectResponse[] }>>;
    };
  };
  search?: MockedFunction<(args: SearchParameters) => Promise<SearchResponse>>;
  users?: {
    retrieve?: MockedFunction<(args: { user_id: string }) => Promise<any>>;
    list?: MockedFunction<() => Promise<ListUsersResponse>>;
    me?: MockedFunction<() => Promise<any>>;
  };
  comments?: {
    create?: MockedFunction<(args: CreateCommentParameters) => Promise<CreateCommentResponse>>;
    list?: MockedFunction<(args: ListCommentsParameters) => Promise<ListCommentsResponse>>;
  };
}

/**
 * Implementação do cliente mockado do Notion
 * Esta classe implementa todos os métodos mockados necessários para os testes
 */
export class MockedClient implements Partial<Client> {
  pages = {
    create: jest.fn(),
    update: jest.fn(),
    retrieve: jest.fn(),
    properties: {
      retrieve: jest.fn()
    }
  };

  blocks = {
    retrieve: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    children: {
      list: jest.fn(),
      append: jest.fn()
    }
  };

  databases = {
    create: jest.fn(),
    update: jest.fn(),
    retrieve: jest.fn(),
    query: jest.fn(),
    list: jest.fn()
  };

  search = jest.fn();

  users = {
    retrieve: jest.fn(),
    list: jest.fn(),
    me: jest.fn()
  };

  comments = {
    create: jest.fn(),
    list: jest.fn()
  };

  request = jest.fn().mockImplementation(async <ResponseBody>({ 
    path,
    method,
    query,
    body,
    auth
  }: {
    path: string;
    method: string;
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
    auth?: string;
  }): Promise<ResponseBody> => {
    return {} as ResponseBody;
  });
}
