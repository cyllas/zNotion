import { NotionPage } from '../../../domain/entities/NotionPage';
import { PaginationOptions } from '../../../utils/PaginationHandler';
import { CreatePageParams, UpdatePageParams } from '../types/ServiceParams';

/**
 * Interface para o serviço de páginas do Notion
 */
export interface INotionPageService {
  /**
   * Cria uma nova página
   * @param params Parâmetros para criação da página
   */
  createPage(params: CreatePageParams): Promise<NotionPage>;

  /**
   * Atualiza uma página existente
   * @param pageId ID da página
   * @param params Parâmetros para atualização
   */
  updatePage(pageId: string, params: UpdatePageParams): Promise<NotionPage>;

  /**
   * Recupera uma página pelo ID
   * @param pageId ID da página
   */
  getPage(pageId: string): Promise<NotionPage>;

  /**
   * Lista todas as páginas com paginação
   * @param options Opções de paginação
   */
  listPages(options?: PaginationOptions): Promise<NotionPage[]>;

  /**
   * Arquiva ou desarquiva uma página
   * @param pageId ID da página
   * @param archived Status de arquivamento
   */
  archivePage(pageId: string, archived: boolean): Promise<NotionPage>;
}
