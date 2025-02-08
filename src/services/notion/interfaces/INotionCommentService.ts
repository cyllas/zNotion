import { NotionComment } from '../../../domain/entities/NotionComment';

/**
 * Interface para o serviço de comentários do Notion
 */
export interface INotionCommentService {
  /**
   * Cria um novo comentário em uma página
   * @param pageId ID da página onde o comentário será criado
   * @param comment Texto do comentário
   */
  createComment(pageId: string, comment: string): Promise<NotionComment>;

  /**
   * Lista todos os comentários de uma página
   * @param pageId ID da página
   */
  listComments(pageId: string): Promise<NotionComment[]>;

  /**
   * Atualiza um comentário existente
   * @param commentId ID do comentário
   * @param content Novo conteúdo do comentário
   */
  updateComment(commentId: string, content: string): Promise<NotionComment>;

  /**
   * Remove um comentário
   * @param commentId ID do comentário
   */
  deleteComment(commentId: string): Promise<void>;
}
