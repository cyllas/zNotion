/**
 * Tipo para ícones do Notion
 */
export interface NotionIcon {
  type: 'emoji' | 'external';
  emoji?: string;
  external?: {
    url: string;
  };
}
