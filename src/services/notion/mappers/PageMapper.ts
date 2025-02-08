import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionPage } from '../../../domain/entities/NotionPage';
import { BaseMapper } from './BaseMapper';

/**
 * Mapper para conversão de páginas do Notion
 */
export class PageMapper extends BaseMapper {
  /**
   * Converte uma resposta da API para nosso domínio
   */
  static toDomain(response: PageObjectResponse): NotionPage {
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
      archived: response.archived,
      properties: this.mapProperties(response.properties),
      url: response.url,
      icon: response.icon,
      cover: response.cover
    };
  }

  /**
   * Converte um objeto do nosso domínio para o formato da API
   */
  static toApi(page: Partial<NotionPage>): Record<string, any> {
    return this.toApiFormat({
      parent: page.parent,
      properties: page.properties,
      icon: page.icon,
      cover: page.cover,
      archived: page.archived
    });
  }
}
