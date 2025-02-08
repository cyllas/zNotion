import { Client } from '@notionhq/client';
import {
  CreatePageParameters,
  PageObjectResponse,
  UpdatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';
import { NotionPage } from '../../domain/entities/NotionPage';
import { PageAdapter } from './adapters/PageAdapter';
import { ValidationUtils } from './utils/ValidationUtils';
import { NotionErrors } from './errors/NotionErrors';
import { 
  CreatePageParams, 
  UpdatePageParams,
  NotionEmojiIcon,
  NotionExternalIcon,
  NotionExternalCover
} from './types/NotionPageTypes';

/**
 * Serviço para manipulação de páginas no Notion
 */
export class NotionPageService {
  private readonly pageAdapter: PageAdapter;

  constructor(private readonly client: Client) {
    this.pageAdapter = new PageAdapter();
  }

  /**
   * Cria uma nova página
   */
  async createPage(params: CreatePageParams): Promise<NotionPage> {
    try {
      // Valida o parent
      const parentId = 'database_id' in params.parent 
        ? params.parent.database_id 
        : params.parent.page_id;
      ValidationUtils.validateId(parentId);

      // Valida o ícone se existir
      if (params.icon) {
        if (params.icon.type === 'emoji') {
          ValidationUtils.validateIcon({
            type: 'emoji',
            emoji: params.icon.emoji
          });
        } else {
          ValidationUtils.validateIcon({
            type: 'external',
            external: params.icon.external
          });
        }
      }

      // Valida a capa se existir
      if (params.cover) {
        ValidationUtils.validateCover(params.cover);
      }

      // Remove propriedades undefined antes de enviar para a API
      const apiParams: CreatePageParameters = {
        ...params,
        icon: params.icon || null,
        cover: params.cover ? {
          type: 'external',
          external: params.cover.external
        } : null
      };

      const response = await this.client.pages.create(apiParams);
      return this.pageAdapter.adapt(response as PageObjectResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Atualiza uma página existente
   */
  async updatePage(pageId: string, params: UpdatePageParams): Promise<NotionPage> {
    try {
      ValidationUtils.validateId(pageId);

      // Valida o ícone se existir
      if (params.icon) {
        if (params.icon.type === 'emoji') {
          ValidationUtils.validateIcon({
            type: 'emoji',
            emoji: params.icon.emoji
          });
        } else {
          ValidationUtils.validateIcon({
            type: 'external',
            external: params.icon.external
          });
        }
      }

      // Valida a capa se existir
      if (params.cover) {
        ValidationUtils.validateCover(params.cover);
      }

      // Remove propriedades undefined antes de enviar para a API
      const apiParams: UpdatePageParameters = {
        page_id: pageId,
        icon: params.icon || null,
        cover: params.cover ? {
          type: 'external',
          external: params.cover.external
        } : null,
        archived: params.archived,
        properties: params.properties || {}
      };

      const response = await this.client.pages.update(apiParams);
      return this.pageAdapter.adapt(response as PageObjectResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Recupera uma página pelo ID
   */
  async getPage(pageId: string): Promise<NotionPage> {
    try {
      ValidationUtils.validateId(pageId);

      const response = await this.client.pages.retrieve({
        page_id: pageId
      });

      return this.pageAdapter.adapt(response as PageObjectResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Arquiva ou desarquiva uma página
   */
  async archivePage(pageId: string, archive: boolean): Promise<NotionPage> {
    try {
      ValidationUtils.validateId(pageId);
      ValidationUtils.validateBoolean(archive, 'archive');

      const response = await this.client.pages.update({
        page_id: pageId,
        archived: archive
      });

      return this.pageAdapter.adapt(response as PageObjectResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }
}
