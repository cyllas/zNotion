import { NotionDatabase } from '../../../domain/entities/NotionDatabase';
import { NotionPage } from '../../../domain/entities/NotionPage';
import { PaginationOptions } from '../../../utils/PaginationHandler';
import { 
  CreateDatabaseParams, 
  UpdateDatabaseParams, 
  QueryDatabaseParams 
} from '../types/ServiceParams';

/**
 * Interface para o serviço de bancos de dados do Notion
 */
export interface INotionDatabaseService {
  /**
   * Cria um novo banco de dados
   * @param params Parâmetros para criação do banco de dados
   */
  createDatabase(params: CreateDatabaseParams): Promise<NotionDatabase>;

  /**
   * Atualiza um banco de dados existente
   * @param databaseId ID do banco de dados
   * @param params Parâmetros para atualização
   */
  updateDatabase(databaseId: string, params: UpdateDatabaseParams): Promise<NotionDatabase>;

  /**
   * Recupera um banco de dados pelo ID
   * @param databaseId ID do banco de dados
   */
  getDatabase(databaseId: string): Promise<NotionDatabase>;

  /**
   * Lista todos os bancos de dados com paginação
   * @param options Opções de paginação
   */
  listDatabases(options?: PaginationOptions): Promise<NotionDatabase[]>;

  /**
   * Consulta páginas em um banco de dados
   * @param databaseId ID do banco de dados
   * @param query Parâmetros da consulta
   */
  queryDatabase(databaseId: string, query: QueryDatabaseParams): Promise<NotionPage[]>;
}
