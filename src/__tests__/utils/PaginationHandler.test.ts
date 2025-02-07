import { PaginationHandler } from '../../utils/PaginationHandler';

describe('PaginationHandler', () => {
  let paginationHandler: PaginationHandler;

  beforeEach(() => {
    paginationHandler = new PaginationHandler();
  });

  describe('handlePagination', () => {
    it('deve paginar corretamente através de múltiplas páginas', async () => {
      const mockResponses = [
        {
          results: [{ id: '1' }, { id: '2' }],
          has_more: true,
          next_cursor: 'cursor1'
        },
        {
          results: [{ id: '3' }, { id: '4' }],
          has_more: true,
          next_cursor: 'cursor2'
        },
        {
          results: [{ id: '5' }],
          has_more: false,
          next_cursor: null
        }
      ];

      let currentPage = 0;
      const mockFetch = jest.fn().mockImplementation(() => {
        return Promise.resolve(mockResponses[currentPage++]);
      });

      const results = await paginationHandler.handlePagination(mockFetch);

      expect(results).toHaveLength(5);
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(2, { start_cursor: 'cursor1' });
      expect(mockFetch).toHaveBeenNthCalledWith(3, { start_cursor: 'cursor2' });
    });

    it('deve retornar uma única página quando não há mais resultados', async () => {
      const mockResponse = {
        results: [{ id: '1' }, { id: '2' }],
        has_more: false,
        next_cursor: null
      };

      const mockFetch = jest.fn().mockResolvedValue(mockResponse);

      const results = await paginationHandler.handlePagination(mockFetch);

      expect(results).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com páginas vazias', async () => {
      const mockResponse = {
        results: [],
        has_more: false,
        next_cursor: null
      };

      const mockFetch = jest.fn().mockResolvedValue(mockResponse);

      const results = await paginationHandler.handlePagination(mockFetch);

      expect(results).toHaveLength(0);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('deve respeitar o limite máximo de páginas', async () => {
      const mockResponse = {
        results: [{ id: '1' }],
        has_more: true,
        next_cursor: 'next'
      };

      const mockFetch = jest.fn().mockResolvedValue(mockResponse);
      const maxPages = 3;

      const results = await paginationHandler.handlePagination(mockFetch, maxPages);

      expect(mockFetch).toHaveBeenCalledTimes(maxPages);
      expect(results).toHaveLength(maxPages);
    });

    it('deve propagar erros corretamente', async () => {
      const mockError = new Error('Pagination error');
      const mockFetch = jest.fn().mockRejectedValue(mockError);

      await expect(paginationHandler.handlePagination(mockFetch))
        .rejects
        .toThrow(mockError);
    });
  });
});
