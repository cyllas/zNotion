import { Client } from '@notionhq/client';
import { EmojiRequest, FileWithCaption } from '@notionhq/client/build/src/api-endpoints';

/**
 * Adaptador para converter ícones entre o formato do domínio e da API
 */
export class NotionIconAdapter {
  /**
   * Converte um ícone do formato do domínio para o formato da API do Notion
   * @param icon Ícone a ser convertido
   * @returns Ícone no formato da API do Notion
   */
  static toNotionIcon(icon: IconObject): EmojiRequest | { external: { url: string } } | { file: FileWithCaption } {
    switch (icon.type) {
      case 'emoji':
        return { emoji: icon.emoji || '' };
      case 'external':
        return { external: { url: icon.external?.url || '' } };
      case 'file':
        return { file: icon.file || { url: '', expiry_time: '' } };
      default:
        throw new Error('Tipo de ícone inválido');
    }
  }
}

export interface IconObject {
  type: 'emoji' | 'external' | 'file';
  emoji?: string;
  external?: {
    url: string;
  };
  file?: FileWithCaption;
}
