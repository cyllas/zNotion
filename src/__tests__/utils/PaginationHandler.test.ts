import { PaginationHandler } from '../../utils/PaginationHandler';
import { 
  ListBlockChildrenResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

describe('PaginationHandler', () => {
  let paginationHandler: PaginationHandler;

  beforeEach(() => {
    paginationHandler = new PaginationHandler();
  });

  const mockBlock = (id: string): BlockObjectResponse => ({
    id,
    type: 'paragraph',
    paragraph: { 
      rich_text: [],
      color: 'default'
    },
    object: 'block',
    parent: { type: 'page_id', page_id: 'test-page' },
    created_time: '2023-01-01T00:00:00.000Z',
    last_edited_time: '2023-01-01T00:00:00.000Z',
    created_by: { object: 'user', id: 'user-id' },
    last_edited_by: { object: 'user', id: 'user-id' },
    has_children: false,
    archived: false,
    in_trash: false,
  });

  describe('handlePagination', () => {
    it('deve paginar corretamente através de múltiplas páginas', async () => {
      const mockResponses: ListBlockChildrenResponse[] = [
        {
          object: 'list',
          results: [mockBlock('1'), mockBlock('2')],
          has_more: true,
          next_cursor: 'cursor1',
          type: 'block',
          block: {}
        },
        {
          object: 'list',
          results: [mockBlock('3'), mockBlock('4')],
          has_more: true,
          next_cursor: 'cursor2',
          type: 'block',
          block: {}
        },
        {
          object: 'list',
          results: [mockBlock('5')],
          has_more: false,
          next_cursor: null,
          type: 'block',
          block: {}
        }
      ];

      let currentPage = 0;
      const mockFetch = jest.fn().mockImplementation(() => {
        return Promise.resolve(mockResponses[currentPage++]);
      });

      const results = await paginationHandler.handlePagination(mockFetch);

      expect(results.length).toBe(5);
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(2, { start_cursor: 'cursor1' });
      expect(mockFetch).toHaveBeenNthCalledWith(3, { start_cursor: 'cursor2' });
    });

    it('deve retornar uma única página quando não há mais resultados', async () => {
      const mockResponse: ListBlockChildrenResponse = {
        object: 'list',
        results: [mockBlock('1'), mockBlock('2')],
        has_more: false,
        next_cursor: null,
        type: 'block',
        block: {}
      };

      const mockFetch = jest.fn().mockResolvedValue(mockResponse);
      const results = await paginationHandler.handlePagination(mockFetch);

      expect(results.length).toBe(2);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com erros durante a paginação', async () => {
      const mockResponse: ListBlockChildrenResponse = {
        object: 'list',
        results: [mockBlock('1')],
        has_more: true,
        next_cursor: 'cursor1',
        type: 'block',
        block: {}
      };

      const mockFetch = jest.fn()
        .mockResolvedValueOnce(mockResponse)
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(paginationHandler.handlePagination(mockFetch))
        .rejects.toThrow('API Error');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('deve lidar com resposta vazia', async () => {
      const mockResponse: ListBlockChildrenResponse = {
        object: 'list',
        results: [],
        has_more: false,
        next_cursor: null,
        type: 'block',
        block: {}
      };

      const mockFetch = jest.fn().mockResolvedValue(mockResponse);
      const results = await paginationHandler.handlePagination(mockFetch);

      expect(results.length).toBe(0);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com limite máximo de páginas', async () => {
      const mockResponse: ListBlockChildrenResponse = {
        object: 'list',
        results: [mockBlock('1')],
        has_more: true,
        next_cursor: 'cursor1',
        type: 'block',
        block: {}
      };

      const mockFetch = jest.fn().mockResolvedValue(mockResponse);
      const maxPages = 3;
      const results = await paginationHandler.handlePagination(mockFetch, maxPages);

      expect(results.length).toBe(3); // 1 resultado por página * 3 páginas
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('deve preservar os parâmetros iniciais durante a paginação', async () => {
      const initialParams = { filter: { property: 'Status', equals: 'Done' } };
      const mockResponse: ListBlockChildrenResponse = {
        object: 'list',
        results: [mockBlock('1')],
        has_more: true,
        next_cursor: 'cursor1',
        type: 'block',
        block: {}
      };

      const mockFetch = jest.fn()
        .mockImplementation((params) => Promise.resolve(mockResponse));

      await paginationHandler.handlePagination(mockFetch, undefined, initialParams);

      expect(mockFetch).toHaveBeenNthCalledWith(1, initialParams);
      expect(mockFetch).toHaveBeenNthCalledWith(2, {
        ...initialParams,
        start_cursor: 'cursor1'
      });
    });
  });
});
