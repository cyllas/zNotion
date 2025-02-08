import { NotionComment } from '../domain/entities/NotionComment';
import { INotionCommentService } from '../services/notion/interfaces/INotionCommentService';

/**
 * Fachada para funcionalidades de colaboração do Notion
 * Agrupa serviços relacionados a comentários, discussões e outros recursos colaborativos
 */
export class NotionCollaborationFacade {
  constructor(
    private readonly commentService: INotionCommentService
  ) {}

  /**
   * Cria um novo comentário em uma página
   */
  async criarComentario(paginaId: string, texto: string): Promise<NotionComment> {
    return this.commentService.createComment(paginaId, texto);
  }

  /**
   * Lista todos os comentários de uma página
   */
  async listarComentarios(paginaId: string): Promise<NotionComment[]> {
    return this.commentService.listComments(paginaId);
  }

  /**
   * Atualiza um comentário existente
   */
  async atualizarComentario(comentarioId: string, novoTexto: string): Promise<NotionComment> {
    return this.commentService.updateComment(comentarioId, novoTexto);
  }

  /**
   * Remove um comentário
   */
  async removerComentario(comentarioId: string): Promise<void> {
    return this.commentService.deleteComment(comentarioId);
  }
}
