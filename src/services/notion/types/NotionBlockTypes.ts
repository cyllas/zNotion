import { NotionRichText, NotionColor, NotionParent } from './NotionTypes';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

/**
 * Interface base para blocos do Notion
 */
export interface NotionBlockBase {
  id: string;
  type: string;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  archived: boolean;
}

/**
 * Bloco do Notion
 */
export interface NotionBlock extends BlockObjectResponse {
  parent: NotionParent;
}

/**
 * Bloco de parágrafo
 */
export interface NotionParagraphBlock extends NotionBlockBase {
  type: 'paragraph';
  paragraph: {
    rich_text: NotionRichText[];
    color: NotionColor;
  };
}

/**
 * Bloco de cabeçalho
 */
export interface NotionHeadingBlock extends NotionBlockBase {
  type: 'heading_1' | 'heading_2' | 'heading_3';
  [key: string]: {
    rich_text: NotionRichText[];
    color: NotionColor;
    is_toggleable?: boolean;
  } | any;
}

/**
 * Bloco de lista
 */
export interface NotionListBlock extends NotionBlockBase {
  type: 'bulleted_list_item' | 'numbered_list_item';
  [key: string]: {
    rich_text: NotionRichText[];
    color: NotionColor;
    children?: NotionBlock[];
  } | any;
}

/**
 * Bloco de tarefa
 */
export interface NotionToDoBlock extends NotionBlockBase {
  type: 'to_do';
  to_do: {
    rich_text: NotionRichText[];
    color: NotionColor;
    checked: boolean;
    children?: NotionBlock[];
  };
}

/**
 * Bloco de alternância
 */
export interface NotionToggleBlock extends NotionBlockBase {
  type: 'toggle';
  toggle: {
    rich_text: NotionRichText[];
    color: NotionColor;
    children?: NotionBlock[];
  };
}

/**
 * Bloco de código
 */
export interface NotionCodeBlock extends NotionBlockBase {
  type: 'code';
  code: {
    rich_text: NotionRichText[];
    caption?: NotionRichText[];
    language: string;
  };
}

/**
 * Bloco de citação
 */
export interface NotionQuoteBlock extends NotionBlockBase {
  type: 'quote';
  quote: {
    rich_text: NotionRichText[];
    color: NotionColor;
    children?: NotionBlock[];
  };
}

/**
 * Bloco de chamada
 */
export interface NotionCalloutBlock extends NotionBlockBase {
  type: 'callout';
  callout: {
    rich_text: NotionRichText[];
    icon?: {
      type: 'emoji' | 'external';
      emoji?: string;
      external?: { url: string };
    };
    color: NotionColor;
    children?: NotionBlock[];
  };
}

/**
 * Bloco de equação
 */
export interface NotionEquationBlock extends NotionBlockBase {
  type: 'equation';
  equation: {
    expression: string;
  };
}

/**
 * Bloco de divisor
 */
export interface NotionDividerBlock extends NotionBlockBase {
  type: 'divider';
  divider: {};
}

/**
 * Bloco de tabela de conteúdo
 */
export interface NotionTableOfContentsBlock extends NotionBlockBase {
  type: 'table_of_contents';
  table_of_contents: {
    color: NotionColor;
  };
}

/**
 * Bloco de breadcrumb
 */
export interface NotionBreadcrumbBlock extends NotionBlockBase {
  type: 'breadcrumb';
  breadcrumb: {};
}

/**
 * Bloco de coluna
 */
export interface NotionColumnBlock extends NotionBlockBase {
  type: 'column';
  column: {
    children: NotionBlock[];
  };
}

/**
 * Bloco de lista de colunas
 */
export interface NotionColumnListBlock extends NotionBlockBase {
  type: 'column_list';
  column_list: {
    children: NotionColumnBlock[];
  };
}

/**
 * Bloco de link preview
 */
export interface NotionLinkPreviewBlock extends NotionBlockBase {
  type: 'link_preview';
  link_preview: {
    url: string;
  };
}

/**
 * Bloco de template
 */
export interface NotionTemplateBlock extends NotionBlockBase {
  type: 'template';
  template: {
    rich_text: NotionRichText[];
    children?: NotionBlock[];
  };
}

/**
 * Bloco de link para página
 */
export interface NotionLinkToPageBlock extends NotionBlockBase {
  type: 'link_to_page';
  link_to_page:
    | { type: 'page_id'; page_id: string }
    | { type: 'database_id'; database_id: string };
}

/**
 * Bloco de tabela
 */
export interface NotionTableBlock extends NotionBlockBase {
  type: 'table';
  table: {
    table_width: number;
    has_column_header: boolean;
    has_row_header: boolean;
    children: NotionTableRowBlock[];
  };
}

/**
 * Bloco de linha de tabela
 */
export interface NotionTableRowBlock extends NotionBlockBase {
  type: 'table_row';
  table_row: {
    cells: NotionRichText[][];
  };
}

/**
 * Bloco de mídia
 */
export interface NotionMediaBlock extends NotionBlockBase {
  type: 'image' | 'video' | 'file' | 'pdf';
  [key: string]: {
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string; expiry_time: string };
    caption?: NotionRichText[];
  } | any;
}

/**
 * Bloco de bookmark
 */
export interface NotionBookmarkBlock extends NotionBlockBase {
  type: 'bookmark';
  bookmark: {
    url: string;
    caption?: NotionRichText[];
  };
}

/**
 * União de todos os tipos de blocos
 */
export type NotionBlockType =
  | NotionParagraphBlock
  | NotionHeadingBlock
  | NotionListBlock
  | NotionToDoBlock
  | NotionToggleBlock
  | NotionCodeBlock
  | NotionQuoteBlock
  | NotionCalloutBlock
  | NotionEquationBlock
  | NotionDividerBlock
  | NotionTableOfContentsBlock
  | NotionBreadcrumbBlock
  | NotionColumnBlock
  | NotionColumnListBlock
  | NotionLinkPreviewBlock
  | NotionTemplateBlock
  | NotionLinkToPageBlock
  | NotionTableBlock
  | NotionTableRowBlock
  | NotionMediaBlock
  | NotionBookmarkBlock;
