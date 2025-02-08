import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionPage } from '../../../domain/entities/NotionPage';
import { NotionEmojiIcon, NotionExternalIcon, NotionExternalCover } from '../types/NotionPageTypes';
import { Adapter } from './types';
import { RichTextAdapter } from './RichTextAdapter';

/**
 * Adaptador para converter páginas da API do Notion para o domínio
 */
export class PageAdapter implements Adapter<PageObjectResponse, NotionPage> {
  private readonly richTextAdapter: RichTextAdapter;

  constructor() {
    this.richTextAdapter = new RichTextAdapter();
  }

  /**
   * Converte uma página da API para o formato do domínio
   */
  adapt(from: PageObjectResponse): NotionPage {
    return {
      id: from.id,
      parent: {
        type: from.parent.type,
        [from.parent.type]: from.parent[from.parent.type as keyof typeof from.parent]
      },
      archived: from.archived,
      properties: this.convertProperties(from.properties),
      url: from.url,
      createdTime: from.created_time,
      lastEditedTime: from.last_edited_time,
      createdBy: {
        id: from.created_by.id,
        name: from.created_by.name,
        avatarUrl: from.created_by.avatar_url,
        type: from.created_by.type
      },
      lastEditedBy: {
        id: from.last_edited_by.id,
        name: from.last_edited_by.name,
        avatarUrl: from.last_edited_by.avatar_url,
        type: from.last_edited_by.type
      },
      icon: this.adaptIcon(from.icon),
      cover: this.adaptCover(from.cover)
    };
  }

  /**
   * Adapta um ícone da API para o formato do domínio
   */
  private adaptIcon(icon: PageObjectResponse['icon']): NotionEmojiIcon | NotionExternalIcon | null {
    if (!icon) return null;

    if (icon.type === 'emoji') {
      return {
        type: 'emoji',
        emoji: icon.emoji
      };
    }

    if (icon.type === 'external') {
      return {
        type: 'external',
        external: {
          url: icon.external.url
        }
      };
    }

    return null;
  }

  /**
   * Adapta uma capa da API para o formato do domínio
   */
  private adaptCover(cover: PageObjectResponse['cover']): NotionExternalCover | null {
    if (!cover || cover.type !== 'external') return null;

    return {
      type: 'external',
      external: {
        url: cover.external.url
      }
    };
  }

  /**
   * Converte as propriedades de uma página
   */
  private convertProperties(properties: PageObjectResponse['properties']): Record<string, any> {
    return Object.entries(properties).reduce((acc, [key, value]) => {
      acc[key] = this.convertProperty(value);
      return acc;
    }, {} as Record<string, any>);
  }

  /**
   * Converte uma propriedade específica
   */
  private convertProperty(property: PageObjectResponse['properties'][string]): any {
    switch (property.type) {
      case 'title':
      case 'rich_text':
        return property[property.type].map(rt => this.richTextAdapter.adapt(rt));
      case 'number':
        return property.number;
      case 'select':
        return property.select ? {
          id: property.select.id,
          name: property.select.name,
          color: property.select.color
        } : null;
      case 'multi_select':
        return property.multi_select.map(option => ({
          id: option.id,
          name: option.name,
          color: option.color
        }));
      case 'date':
        return property.date ? {
          start: property.date.start,
          end: property.date.end,
          timeZone: property.date.time_zone
        } : null;
      case 'formula':
        return {
          type: property.formula.type,
          value: property.formula[property.formula.type]
        };
      case 'relation':
        return property.relation.map(rel => rel.id);
      case 'rollup':
        return {
          type: property.rollup.type,
          value: property.rollup[property.rollup.type]
        };
      case 'people':
        return property.people.map(person => ({
          id: person.id,
          name: person.name,
          avatarUrl: person.avatar_url,
          type: person.type
        }));
      case 'files':
        return property.files.map(file => ({
          name: file.name,
          type: file.type,
          ...(file.type === 'external' ? { external: file.external } : { file: file.file })
        }));
      case 'checkbox':
        return property.checkbox;
      case 'url':
        return property.url;
      case 'email':
        return property.email;
      case 'phone_number':
        return property.phone_number;
      case 'created_time':
        return property.created_time;
      case 'created_by':
        return {
          id: property.created_by.id,
          name: property.created_by.name,
          avatarUrl: property.created_by.avatar_url,
          type: property.created_by.type
        };
      case 'last_edited_time':
        return property.last_edited_time;
      case 'last_edited_by':
        return {
          id: property.last_edited_by.id,
          name: property.last_edited_by.name,
          avatarUrl: property.last_edited_by.avatar_url,
          type: property.last_edited_by.type
        };
      default:
        return null;
    }
  }

  /**
   * Adapta uma lista de páginas
   */
  adaptList(pages: PageObjectResponse[]): NotionPage[] {
    return pages.map(page => this.adapt(page));
  }
}
