import { NotionService } from '../../services/NotionService';
import { MockedClient } from '../mocks/NotionClientMock';
import { NotionError } from '../../utils/NotionError';
import { Client } from '@notionhq/client';
import { APIResponseError, APIErrorCode } from '@notionhq/client';

describe('NotionService - Tratamento de Erros', () => {
  let notionService: NotionService;
  let mockClient: MockedClient;

  beforeEach(() => {
    mockClient = new MockedClient();
    notionService = new NotionService(mockClient as unknown as Client);
  });

  describe('Erros em Operações com Páginas', () => {
    it('deve tratar erro da API do Notion ao obter página', async () => {
      const notionError = new NotionError('Erro da API do Notion', 'notion_error', 400);
      mockClient.pages.retrieve.mockRejectedValueOnce(notionError);

      await expect(notionService.getPage('page-id')).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao listar páginas', async () => {
      const notionError = new NotionError('Erro ao listar páginas', 'notion_error', 500);
      mockClient.search.mockRejectedValueOnce(notionError);

      await expect(notionService.listPages()).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao criar página', async () => {
      const notionError = new NotionError('Erro ao criar página', 'notion_error', 400);
      mockClient.pages.create.mockRejectedValueOnce(notionError);

      await expect(notionService.createPage({
        parent: { page_id: 'page1' },
        properties: {}
      })).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao atualizar página', async () => {
      const notionError = new NotionError('Erro ao atualizar página', 'notion_error', 400);
      mockClient.pages.update.mockRejectedValueOnce(notionError);

      await expect(notionService.updatePage('page-id', {})).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao arquivar página', async () => {
      const notionError = new NotionError('Erro ao arquivar página', 'notion_error', 400);
      mockClient.pages.update.mockRejectedValueOnce(notionError);

      await expect(notionService.archivePage('page-id')).rejects.toThrow(notionError);
    });
  });

  describe('Erros em Operações com Bancos de Dados', () => {
    it('deve tratar erro da API do Notion ao consultar banco de dados', async () => {
      const notionError = new NotionError('Erro ao consultar banco de dados', 'notion_error', 400);
      mockClient.databases.query.mockRejectedValueOnce(notionError);

      await expect(notionService.queryDatabase('database-id', {})).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao listar bancos de dados', async () => {
      const notionError = new NotionError('Erro ao listar bancos de dados', 'notion_error', 500);
      mockClient.search.mockRejectedValueOnce(notionError);

      await expect(notionService.listDatabases()).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao obter banco de dados', async () => {
      const notionError = new NotionError('Erro ao obter banco de dados', 'notion_error', 400);
      mockClient.databases.retrieve.mockRejectedValueOnce(notionError);

      await expect(notionService.getDatabase('database-id')).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao criar banco de dados', async () => {
      const notionError = new NotionError('Erro ao criar banco de dados', 'notion_error', 400);
      mockClient.databases.create.mockRejectedValueOnce(notionError);

      await expect(notionService.createDatabase({
        parent: { page_id: 'page1' },
        title: [],
        properties: {}
      })).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao atualizar banco de dados', async () => {
      const notionError = new NotionError('Erro ao atualizar banco de dados', 'notion_error', 400);
      mockClient.databases.update.mockRejectedValueOnce(notionError);

      await expect(notionService.updateDatabase('database-id', {})).rejects.toThrow(notionError);
    });
  });

  describe('Erros em Operações com Blocos', () => {
    it('deve tratar erro da API do Notion ao listar blocos filhos', async () => {
      const notionError = new NotionError('Erro ao listar blocos filhos', 'notion_error', 400);
      mockClient.blocks.children.list.mockRejectedValueOnce(notionError);

      await expect(notionService.getBlockChildren('block-id')).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao listar blocos', async () => {
      const notionError = new NotionError('Erro ao listar blocos', 'notion_error', 500);
      mockClient.search.mockRejectedValueOnce(notionError);

      await expect(notionService.listBlocks()).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao obter bloco', async () => {
      const notionError = new NotionError('Erro ao obter bloco', 'notion_error', 400);
      mockClient.blocks.retrieve.mockRejectedValueOnce(notionError);

      await expect(notionService.getBlock('block-id')).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao atualizar bloco', async () => {
      const notionError = new NotionError('Erro ao atualizar bloco', 'notion_error', 400);
      mockClient.blocks.update.mockRejectedValueOnce(notionError);

      await expect(notionService.updateBlock('block-id', {})).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API do Notion ao deletar bloco', async () => {
      const notionError = new NotionError('Erro ao deletar bloco', 'notion_error', 400);
      mockClient.blocks.delete.mockRejectedValueOnce(notionError);

      await expect(notionService.deleteBlock('block-id')).rejects.toThrow(notionError);
    });
  });

  describe('Tratamento de Erros Específicos', () => {
    it('deve tratar erro da API sem código de erro', async () => {
      const notionError = new NotionError('Erro sem código');
      mockClient.pages.retrieve.mockRejectedValueOnce(notionError);

      await expect(notionService.getPage('page-id')).rejects.toThrow(notionError);
    });

    it('deve tratar erro da API sem status', async () => {
      const notionError = new NotionError('Erro sem status', 'notion_error');
      mockClient.pages.retrieve.mockRejectedValueOnce(notionError);

      await expect(notionService.getPage('page-id')).rejects.toThrow(notionError);
    });

    it('deve tratar erro genérico', async () => {
      const genericError = new Error('Erro genérico');
      mockClient.pages.retrieve.mockRejectedValueOnce(genericError);

      await expect(notionService.getPage('page-id')).rejects.toThrow(genericError);
    });

    it('deve tratar APIResponseError do Notion', async () => {
      const apiError = new APIResponseError({
        code: APIErrorCode.InvalidRequestURL,
        message: 'Erro de validação',
        status: 400,
        headers: {},
        rawBodyText: '{}'
      });
      mockClient.pages.retrieve.mockRejectedValueOnce(apiError);

      await expect(notionService.getPage('page-id')).rejects.toThrow(NotionError);
    });

    it('deve tratar erro com objeto de erro personalizado', async () => {
      const customError = {
        code: 'custom_error',
        message: 'Erro personalizado',
        status: 500
      };
      mockClient.pages.retrieve.mockRejectedValueOnce(customError);

      await expect(notionService.getPage('page-id')).rejects.toThrow(NotionError);
    });

    it('deve tratar erro com código notionhq_client_response_error', async () => {
      const notionError = {
        code: 'notionhq_client_response_error',
        message: 'Erro da API do Notion',
        status: 400
      };
      mockClient.pages.retrieve.mockRejectedValueOnce(notionError);

      await expect(notionService.getPage('page-id')).rejects.toThrow(
        new NotionError('Erro da API do Notion', 'notionhq_client_response_error', 400)
      );
    });

    it('deve tratar erro com código diferente de notionhq_client_response_error', async () => {
      const customError = {
        code: 'custom_error_code',
        message: 'Erro personalizado',
        status: 500
      };
      mockClient.pages.retrieve.mockRejectedValueOnce(customError);

      await expect(notionService.getPage('page-id')).rejects.toThrow(
        new NotionError('Erro personalizado')
      );
    });
  });
});
