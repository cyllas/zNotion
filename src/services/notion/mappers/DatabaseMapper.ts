import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionDatabase } from '../../../domain/entities/NotionDatabase';
import { BaseMapper } from './BaseMapper';

/**
 * Mapper para conversão de bancos de dados do Notion
 */
export class DatabaseMapper extends BaseMapper {
  /**
   * Converte uma resposta da API para nosso domínio
   */
  static toDomain(response: DatabaseObjectResponse): NotionDatabase {
    return {
      id: response.id,
      createdTime: this.mapTimestamp(response.created_time),
      lastEditedTime: this.mapTimestamp(response.last_edited_time),
      createdBy: response.created_by,
      lastEditedBy: response.last_edited_by,
      parent: {
        type: response.parent.type,
        id: response.parent[response.parent.type]
      },
      title: this.mapRichText(response.title),
      description: this.mapRichText(response.description),
      properties: response.properties,
      archived: response.archived,
      url: response.url,
      icon: response.icon,
      cover: response.cover
    };
  }

  /**
   * Converte um objeto do nosso domínio para o formato da API
   */
  static toApi(database: Partial<NotionDatabase>): Record<string, any> {
    return this.toApiFormat({
      parent: database.parent,
      title: database.title,
      description: database.description,
      properties: database.properties,
      icon: database.icon,
      cover: database.cover,
      archived: database.archived
    });
  }
}
