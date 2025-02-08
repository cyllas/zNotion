/**
 * Representa um usuário no Notion
 */
export interface NotionUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  type: 'person' | 'bot';
  person?: {
    email: string;
  };
  bot?: {
    owner: {
      type: 'workspace' | 'user';
      workspace?: boolean;
    };
  };
}
