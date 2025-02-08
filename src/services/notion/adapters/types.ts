import { 
  BlockObjectResponse, 
  CommentObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
  UserObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import { NotionBlock } from '../../../domain/entities/NotionBlock';
import { NotionComment } from '../../../domain/entities/NotionComment';
import { NotionDatabase } from '../../../domain/entities/NotionDatabase';
import { NotionPage } from '../../../domain/entities/NotionPage';
import { NotionUser } from '../../../domain/entities/NotionUser';

/**
 * Interface base para adaptadores
 */
export interface Adapter<From, To> {
  /**
   * Converte um objeto da API para o domínio
   * @param from Objeto da API
   * @returns Objeto do domínio
   */
  adapt(from: From): To;
}

/**
 * Interface para adaptadores que lidam com paginação
 */
export interface PaginatedAdapter<From, To> extends Adapter<From, To> {
  /**
   * Converte uma lista paginada de objetos da API para o domínio
   * @param items Lista de objetos da API
   * @param nextCursor Cursor para a próxima página
   * @param hasMore Indica se há mais páginas
   * @returns Objeto com a lista convertida e informações de paginação
   */
  adaptList(
    items: From[],
    nextCursor: string | null,
    hasMore: boolean
  ): {
    items: To[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

/**
 * Interface para adaptadores que lidam com conversão bidirecional
 */
export interface BidirectionalAdapter<From, To> extends Adapter<From, To> {
  /**
   * Converte um objeto do domínio para a API
   * @param to Objeto do domínio
   * @returns Objeto da API
   */
  adaptBack(to: To): From;
}

/**
 * Interface para adaptadores de blocos
 */
export interface BlockAdapter extends PaginatedAdapter<BlockObjectResponse, NotionBlock> {}

/**
 * Interface para adaptadores de páginas
 */
export interface PageAdapter extends PaginatedAdapter<PageObjectResponse, NotionPage> {}

/**
 * Interface para adaptadores de bancos de dados
 */
export interface DatabaseAdapter extends PaginatedAdapter<DatabaseObjectResponse, NotionDatabase> {}

/**
 * Interface para adaptadores de comentários
 */
export interface CommentAdapter extends PaginatedAdapter<CommentObjectResponse, NotionComment> {}

/**
 * Interface para adaptadores de usuários
 */
export interface UserAdapter extends PaginatedAdapter<UserObjectResponse, NotionUser> {}

/**
 * Interface para adaptadores de rich text
 */
export interface RichTextAdapter extends Adapter<RichTextItemResponse, string> {
  /**
   * Cria um objeto de rich text simples
   * @param content Conteúdo do texto
   * @returns Objeto de rich text
   */
  createSimpleText(content: string): RichTextItemResponse;
}

/**
 * Interface para ícones da API do Notion
 */
export interface NotionAPIIcon {
  type: 'emoji' | 'external';
  emoji?: string;
  external?: {
    url: string;
  };
}

/**
 * Tipo para resultados de adaptadores paginados
 */
export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
