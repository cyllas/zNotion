import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionDatabase } from '../../../domain/entities/NotionDatabase';
import { PaginatedAdapter } from './types';
import { RichTextAdapter } from './RichTextAdapter';

/**
 * Adaptador para converter bancos de dados entre o formato da API e do domínio
 */
export class DatabaseAdapter implements PaginatedAdapter<DatabaseObjectResponse, NotionDatabase> {
  private readonly richTextAdapter: RichTextAdapter;

  constructor() {
    this.richTextAdapter = new RichTextAdapter();
  }

  /**
   * Converte um banco de dados da API para o formato do domínio
   */
  adapt(from: DatabaseObjectResponse): NotionDatabase {
    return {
      id: from.id,
      title: from.title.map(t => this.richTextAdapter.adapt(t)),
      description: from.description?.map(d => this.richTextAdapter.adapt(d)) || [],
      icon: from.icon ? {
        type: from.icon.type,
        ...(from.icon.type === 'emoji' ? { emoji: from.icon.emoji } : { external: from.icon.external })
      } : null,
      cover: from.cover ? {
        type: from.cover.type,
        external: from.cover.external
      } : null,
      parent: {
        type: from.parent.type,
        [from.parent.type]: from.parent[from.parent.type as keyof typeof from.parent]
      },
      url: from.url,
      archived: from.archived,
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
      properties: this.convertProperties(from.properties)
    };
  }

  /**
   * Converte uma lista paginada de bancos de dados da API para o formato do domínio
   */
  adaptList(
    items: DatabaseObjectResponse[],
    nextCursor: string | null,
    hasMore: boolean
  ): {
    items: NotionDatabase[];
    nextCursor: string | null;
    hasMore: boolean;
  } {
    return {
      items: items.map(item => this.adapt(item)),
      nextCursor,
      hasMore
    };
  }

  /**
   * Converte as propriedades de um banco de dados
   */
  private convertProperties(properties: DatabaseObjectResponse['properties']): Record<string, any> {
    return Object.entries(properties).reduce((acc, [key, value]) => {
      acc[key] = {
        id: value.id,
        name: value.name,
        type: value.type,
        ...this.convertPropertyConfiguration(value)
      };
      return acc;
    }, {} as Record<string, any>);
  }

  /**
   * Converte a configuração de uma propriedade
   */
  private convertPropertyConfiguration(property: DatabaseObjectResponse['properties'][string]): Record<string, any> {
    switch (property.type) {
      case 'select':
        return {
          options: property.select.options.map(option => ({
            id: option.id,
            name: option.name,
            color: option.color
          }))
        };
      case 'multi_select':
        return {
          options: property.multi_select.options.map(option => ({
            id: option.id,
            name: option.name,
            color: option.color
          }))
        };
      case 'relation':
        return {
          databaseId: property.relation.database_id,
          syncedPropertyId: property.relation.synced_property_id,
          syncedPropertyName: property.relation.synced_property_name
        };
      case 'rollup':
        return {
          relationPropertyId: property.rollup.relation_property_id,
          relationPropertyName: property.rollup.relation_property_name,
          function: property.rollup.function,
          rollupPropertyId: property.rollup.rollup_property_id,
          rollupPropertyName: property.rollup.rollup_property_name
        };
      case 'formula':
        return {
          expression: property.formula.expression
        };
      default:
        return {};
    }
  }
}
