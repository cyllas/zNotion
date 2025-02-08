import { Client } from '@notionhq/client';
import { UserObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionUser } from '../../domain/entities/NotionUser';
import { UserAdapter } from './adapters/UserAdapter';
import { ValidationUtils } from './utils/ValidationUtils';
import { NotionErrors } from './errors/NotionErrors';

/**
 * Serviço para manipulação de usuários no Notion
 */
export class NotionUserService {
  private readonly userAdapter: UserAdapter;

  constructor(private readonly client: Client) {
    this.userAdapter = new UserAdapter();
  }

  /**
   * Lista todos os usuários
   */
  async listUsers(params?: {
    startCursor?: string;
    pageSize?: number;
  }): Promise<{
    users: NotionUser[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      if (params?.pageSize || params?.startCursor) {
        ValidationUtils.validatePagination(params.pageSize, params.startCursor);
      }

      const response = await this.client.users.list({
        start_cursor: params?.startCursor,
        page_size: params?.pageSize
      });

      return this.userAdapter.adaptList(
        response.results as UserObjectResponse[],
        response.next_cursor,
        response.has_more
      );
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Recupera um usuário pelo ID
   */
  async getUser(userId: string): Promise<NotionUser> {
    try {
      ValidationUtils.validateId(userId);

      const response = await this.client.users.retrieve({
        user_id: userId
      });

      return this.userAdapter.adapt(response);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Recupera o usuário autenticado
   */
  async getMe(): Promise<NotionUser> {
    try {
      const response = await this.client.users.me();
      return this.userAdapter.adapt(response);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }
}
