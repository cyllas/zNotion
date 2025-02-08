import { NotionBlock } from '../../../domain/entities/NotionBlock';
import { PaginationOptions } from '../../../utils/PaginationHandler';
import { CreateBlockParams, UpdateBlockParams } from '../types/ServiceParams';

/**
 * Interface para o serviço de blocos do Notion
 */
export interface INotionBlockService {
  /**
   * Cria um novo bloco
   * @param params Parâmetros para criação do bloco
   */
  createBlock(params: CreateBlockParams): Promise<NotionBlock>;

  /**
   * Atualiza um bloco existente
   * @param blockId ID do bloco
   * @param params Parâmetros para atualização
   */
  updateBlock(blockId: string, params: UpdateBlockParams): Promise<NotionBlock>;

  /**
   * Recupera um bloco pelo ID
   * @param blockId ID do bloco
   */
  getBlock(blockId: string): Promise<NotionBlock>;

  /**
   * Lista os blocos filhos de um bloco ou página
   * @param blockId ID do bloco ou página pai
   * @param options Opções de paginação
   */
  listChildren(blockId: string, options?: PaginationOptions): Promise<NotionBlock[]>;

  /**
   * Anexa blocos como filhos de um bloco ou página
   * @param blockId ID do bloco ou página pai
   * @param children Blocos filhos para anexar
   */
  appendChildren(blockId: string, children: CreateBlockParams[]): Promise<NotionBlock[]>;

  /**
   * Remove um bloco (arquiva)
   * @param blockId ID do bloco
   */
  deleteBlock(blockId: string): Promise<void>;
}
