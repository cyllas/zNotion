import { Client } from '@notionhq/client';
import {
  BlockObjectResponse,
  AppendBlockChildrenParameters,
  UpdateBlockParameters
} from '@notionhq/client/build/src/api-endpoints';
import { NotionBlock } from '../../domain/entities/NotionBlock';
import { BlockAdapter } from './adapters/BlockAdapter';
import { ValidationUtils } from './utils/ValidationUtils';
import { NotionErrors } from './errors/NotionErrors';

/**
 * Serviço para manipulação de blocos no Notion
 */
export class NotionBlockService {
  private readonly blockAdapter: BlockAdapter;

  constructor(private readonly client: Client) {
    this.blockAdapter = new BlockAdapter();
  }

  /**
   * Adiciona blocos filhos a um bloco existente
   */
  async appendBlocks(
    blockId: string,
    children: AppendBlockChildrenParameters['children']
  ): Promise<{
    blocks: NotionBlock[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      ValidationUtils.validateId(blockId);

      const response = await this.client.blocks.children.append({
        block_id: blockId,
        children
      });

      const { items, nextCursor, hasMore } = this.blockAdapter.adaptList(
        response.results as BlockObjectResponse[],
        response.next_cursor,
        response.has_more
      );

      return {
        blocks: items,
        nextCursor,
        hasMore
      };
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Recupera um bloco pelo ID
   */
  async getBlock(blockId: string): Promise<NotionBlock> {
    try {
      ValidationUtils.validateId(blockId);

      const response = await this.client.blocks.retrieve({
        block_id: blockId
      });

      return this.blockAdapter.adapt(response as BlockObjectResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Atualiza um bloco existente
   */
  async updateBlock(
    blockId: string,
    params: Omit<UpdateBlockParameters, 'block_id'>
  ): Promise<NotionBlock> {
    try {
      ValidationUtils.validateId(blockId);

      const response = await this.client.blocks.update({
        block_id: blockId,
        ...params
      });

      return this.blockAdapter.adapt(response as BlockObjectResponse);
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Exclui um bloco
   */
  async deleteBlock(blockId: string): Promise<void> {
    try {
      ValidationUtils.validateId(blockId);

      await this.client.blocks.delete({
        block_id: blockId
      });
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }

  /**
   * Lista os blocos filhos de um bloco
   */
  async getBlockChildren(
    blockId: string,
    params?: {
      startCursor?: string;
      pageSize?: number;
    }
  ): Promise<{
    blocks: NotionBlock[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    try {
      ValidationUtils.validateId(blockId);
      
      if (params?.pageSize || params?.startCursor) {
        ValidationUtils.validatePagination(params.pageSize, params.startCursor);
      }

      const response = await this.client.blocks.children.list({
        block_id: blockId,
        start_cursor: params?.startCursor,
        page_size: params?.pageSize
      });

      const { items, nextCursor, hasMore } = this.blockAdapter.adaptList(
        response.results as BlockObjectResponse[],
        response.next_cursor,
        response.has_more
      );

      return {
        blocks: items,
        nextCursor,
        hasMore
      };
    } catch (error) {
      throw NotionErrors.handleError(error);
    }
  }
}
