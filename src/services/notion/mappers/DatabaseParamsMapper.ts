import { CreateDatabaseParameters, UpdateDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { NotionIconAdapter } from '../adapters/NotionIconAdapter';
import { CreateDatabaseParams, UpdateDatabaseParams } from '../types/ServiceParams';

/**
 * Mapeador para parâmetros de banco de dados
 */
export class DatabaseParamsMapper {
  constructor(private readonly iconAdapter: NotionIconAdapter) {}

  /**
   * Converte parâmetros de criação para o formato da API
   */
  mapCreateParams(params: CreateDatabaseParams): CreateDatabaseParameters {
    return {
      ...params,
      parent: {
        page_id: params.parent.id,
        type: 'page_id'
      },
      icon: params.icon ? this.iconAdapter.toNotionIcon(params.icon) : undefined
    };
  }

  /**
   * Converte parâmetros de atualização para o formato da API
   */
  mapUpdateParams(params: UpdateDatabaseParams): Omit<UpdateDatabaseParameters, 'database_id'> {
    return {
      ...params,
      icon: params.icon ? this.iconAdapter.toNotionIcon(params.icon) : undefined
    };
  }
}
