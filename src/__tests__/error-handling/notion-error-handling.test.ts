import { NotionFacade } from '../../services/notion/NotionFacade';
import { Client } from '@notionhq/client';
import { NotionClientMock } from '../mocks/NotionClientMock';
import { APIErrorCode, APIResponseError } from '@notionhq/client';
import { NotionError } from '../../utils/NotionError';

describe('Notion Error Handling - Testes de Tratamento de Erros', () => {
  let notionFacade: NotionFacade;
  let mockClient: jest.Mocked<Client>;

  beforeEach(() => {
    mockClient = NotionClientMock.createMockClient();
    notionFacade = new NotionFacade(mockClient);
  });

  describe('Erros de Autenticação', () => {
    it('deve tratar erro de token inválido', async () => {
      const error = new NotionError({
        code: APIErrorCode.Unauthorized,
        message: 'Token de autenticação inválido',
        status: 401
      });

      mockClient.pages.retrieve.mockRejectedValueOnce(error);

      await expect(notionFacade.getPage('page-id'))
        .rejects
        .toThrow('Token de autenticação inválido');
    });

    it('deve tratar erro de permissões insuficientes', async () => {
      const error = new NotionError({
        code: APIErrorCode.RestrictedResource,
        message: 'Permissão negada para acessar o recurso',
        status: 403
      });

      mockClient.pages.retrieve.mockRejectedValueOnce(error);

      await expect(notionFacade.getPage('page-id'))
        .rejects
        .toThrow('Permissão negada para acessar o recurso');
    });
  });

  describe('Erros de Validação', () => {
    it('deve tratar erro de propriedade inválida', async () => {
      const error = new NotionError({
        code: APIErrorCode.ValidationError,
        message: 'Erro de validação: propriedade inválida',
        status: 400
      });

      mockClient.pages.create.mockRejectedValueOnce(error);

      await expect(notionFacade.createPage({
        parent: { type: 'database_id', id: 'database-id' },
        properties: {}
      }))
        .rejects
        .toThrow('Erro de validação: propriedade inválida');
    });

    it('deve tratar erro de tipo de bloco inválido', async () => {
      const error = new NotionError({
        code: APIErrorCode.ValidationError,
        message: 'Tipo de bloco inválido',
        status: 400
      });

      mockClient.blocks.children.append.mockRejectedValueOnce(error);

      await expect(notionFacade.createBlock('page-id', {
        type: 'invalid_type' as any,
        invalid_type: {}
      }))
        .rejects
        .toThrow('Tipo de bloco inválido');
    });
  });

  describe('Erros de Recurso', () => {
    it('deve tratar erro de recurso não encontrado', async () => {
      const error = new NotionError({
        code: APIErrorCode.ObjectNotFound,
        message: 'Recurso não encontrado',
        status: 404
      });

      mockClient.pages.retrieve.mockRejectedValueOnce(error);

      await expect(notionFacade.getPage('page-id'))
        .rejects
        .toThrow('Recurso não encontrado');
    });

    it('deve tratar erro de conflito', async () => {
      const error = new NotionError({
        code: APIErrorCode.Conflict,
        message: 'Conflito: recurso já existe',
        status: 409
      });

      mockClient.databases.create.mockRejectedValueOnce(error);

      await expect(
        notionFacade.createDatabase({
          parent: { type: 'page_id', id: 'page-id' },
          title: [{ text: { content: 'Banco de Dados' } }],
          properties: {}
        })
      ).rejects.toThrow('Conflito: recurso já existe');
    });
  });

  describe('Erros de Rate Limit', () => {
    it('deve tratar erro de limite de requisições excedido', async () => {
      const error = new NotionError({
        code: APIErrorCode.RateLimited,
        message: 'Limite de requisições excedido',
        status: 429
      });

      mockClient.search.mockRejectedValueOnce(error);

      await expect(notionFacade.search({ query: 'test' }))
        .rejects
        .toThrow('Limite de requisições excedido');
    });
  });

  describe('Erros de Conexão', () => {
    it('deve tratar erro de timeout', async () => {
      const error = new NotionError({
        code: 'RequestTimeout',
        message: 'Tempo limite da requisição excedido',
        status: 0
      });

      mockClient.pages.retrieve.mockRejectedValueOnce(error);

      await expect(notionFacade.getPage('page-id'))
        .rejects
        .toThrow('Tempo limite da requisição excedido');
    });

    it('deve tratar erro de conexão', async () => {
      const error = new NotionError({
        code: 'ResponseError',
        message: 'Erro de conexão com a API do Notion',
        status: 0
      });

      mockClient.pages.retrieve.mockRejectedValueOnce(error);

      await expect(notionFacade.getPage('page-id'))
        .rejects
        .toThrow('Erro de conexão com a API do Notion');
    });
  });
});
