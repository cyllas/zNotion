import { 
  CreatePageParameters, 
  UpdatePageParameters,
  EmojiRequest,
  PageObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

/**
 * Tipo para ícone externo do Notion
 */
export type NotionExternalIcon = {
  type: 'external';
  external: { url: string };
};

/**
 * Tipo para ícone emoji do Notion
 */
export type NotionEmojiIcon = {
  type: 'emoji';
  emoji: EmojiRequest;
};

/**
 * Tipo para capa externa do Notion
 */
export type NotionExternalCover = {
  type: 'external';
  external: { url: string };
};

/**
 * Interface para parâmetros de criação de página
 */
export interface CreatePageParams extends Omit<CreatePageParameters, 'icon' | 'cover'> {
  icon?: NotionEmojiIcon | NotionExternalIcon;
  cover?: NotionExternalCover;
}

/**
 * Interface para parâmetros de atualização de página
 */
export interface UpdatePageParams {
  properties?: PageObjectResponse['properties'];
  icon?: NotionEmojiIcon | NotionExternalIcon;
  cover?: NotionExternalCover;
  archived?: boolean;
}
