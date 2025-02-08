/**
 * Interface para objetos paginados retornados pela API do Notion
 */
export interface PaginatedResponse<T> {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
}

/**
 * Opções para paginação
 */
export interface PaginationOptions {
  /** Tamanho da página */
  pageSize?: number;
  /** Número máximo de itens a serem retornados (0 para todos) */
  maxItems?: number;
  /** Cursor inicial */
  startCursor?: string;
  maxPages?: number;
}

/**
 * Interface para funções que fazem requisições paginadas
 */
export type PaginatedRequest<T> = (
  pageSize: number,
  startCursor?: string
) => Promise<PaginatedResponse<T>>;

import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';

/**
 * Classe responsável por gerenciar paginação automática
 */
export class PaginationHandler {
  /**
   * Obtém todos os resultados de uma requisição paginada
   * @param request Função que faz a requisição paginada
   * @param options Opções de paginação
   * @returns Array com todos os resultados
   */
  static async getAllResults<T>(
    request: PaginatedRequest<T>,
    options: PaginationOptions = {}
  ): Promise<T[]> {
    const {
      pageSize = 100,
      maxItems = 0,
      startCursor
    } = options;

    const results: T[] = [];
    let currentCursor = startCursor;

    while (true) {
      const response = await request(pageSize, currentCursor);
      results.push(...response.results);

      if (!response.has_more || response.next_cursor === null) {
        break;
      }

      if (maxItems > 0 && results.length >= maxItems) {
        results.splice(maxItems);
        break;
      }

      currentCursor = response.next_cursor;
    }

    return results;
  }

  /**
   * Cria um iterador assíncrono para processar resultados página por página
   * @param request Função que faz a requisição paginada
   * @param options Opções de paginação
   */
  static async *getPageIterator<T>(
    request: PaginatedRequest<T>,
    options: PaginationOptions = {}
  ): AsyncGenerator<T[], void, unknown> {
    const {
      pageSize = 100,
      maxItems = 0,
      startCursor
    } = options;

    let totalItems = 0;
    let currentCursor = startCursor;

    while (true) {
      const response = await request(pageSize, currentCursor);
      const pageResults = response.results;

      if (maxItems > 0) {
        const remaining = maxItems - totalItems;
        if (remaining <= 0) break;
        if (remaining < pageResults.length) {
          pageResults.splice(remaining);
        }
      }

      yield pageResults;
      totalItems += pageResults.length;

      if (!response.has_more || response.next_cursor === null) {
        break;
      }

      if (maxItems > 0 && totalItems >= maxItems) {
        break;
      }

      currentCursor = response.next_cursor;
    }
  }

  /**
   * Manipula a paginação de resultados da API do Notion
   * @param fetchFn Função que faz a chamada à API
   * @param maxPages Número máximo de páginas a serem buscadas
   * @param initialParams Parâmetros iniciais para a primeira chamada
   * @returns Array com todos os resultados combinados
   */
  async handlePagination<T>(
    fetchFn: (params?: Record<string, any>) => Promise<{
      results: T[];
      has_more: boolean;
      next_cursor: string | null;
    }>,
    maxPages?: number,
    initialParams?: Record<string, any>
  ): Promise<T[]> {
    const results: T[] = [];
    let hasMore = true;
    let nextCursor: string | null = null;
    let currentPage = 0;

    while (hasMore && (!maxPages || currentPage < maxPages)) {
      const params = {
        ...initialParams,
        ...(nextCursor ? { start_cursor: nextCursor } : {})
      };

      const response = await fetchFn(params);
      results.push(...response.results);
      hasMore = response.has_more;
      nextCursor = response.next_cursor;
      currentPage++;
    }

    return results;
  }
}
