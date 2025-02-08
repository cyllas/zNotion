import { UserObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionUser } from '../../../domain/entities/NotionUser';
import { PaginatedAdapter } from './types';

/**
 * Adaptador para converter usuários entre o formato da API e do domínio
 */
export class UserAdapter implements PaginatedAdapter<UserObjectResponse, NotionUser> {
  /**
   * Converte um usuário da API para o formato do domínio
   */
  adapt(from: UserObjectResponse): NotionUser {
    return {
      id: from.id,
      name: from.name,
      avatarUrl: from.avatar_url,
      type: from.type,
      person: from.type === 'person' ? {
        email: from.person.email
      } : undefined,
      bot: from.type === 'bot' ? {
        owner: {
          type: from.bot.owner.type,
          workspace: from.bot.owner.type === 'workspace'
        }
      } : undefined
    };
  }

  /**
   * Converte uma lista paginada de usuários da API para o formato do domínio
   */
  adaptList(
    items: UserObjectResponse[],
    nextCursor: string | null,
    hasMore: boolean
  ): {
    items: NotionUser[];
    nextCursor: string | null;
    hasMore: boolean;
  } {
    return {
      items: items.map(item => this.adapt(item)),
      nextCursor,
      hasMore
    };
  }
}
