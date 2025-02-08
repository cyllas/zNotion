import { NotionFacade } from '../../services/notion/NotionFacade';
import { Client } from '@notionhq/client';
import { MockedClient } from '../mocks/NotionClientMock';

describe('Notion Workflow - Testes E2E', () => {
  let notionFacade: NotionFacade;
  let mockClient: MockedClient;

  beforeEach(() => {
    mockClient = new MockedClient();
    notionFacade = new NotionFacade(mockClient as unknown as Client);
  });

  it('deve executar um fluxo completo de trabalho', async () => {
    // 1. Criar um banco de dados
    const mockDatabaseResponse = {
      object: 'database',
      id: 'test-database-id',
      title: [{ text: { content: 'Banco de Dados de Teste' } }],
      properties: {
        Nome: { type: 'title', title: {} },
        Status: {
          type: 'select',
          select: {
            options: [
              { name: 'Em Progresso', color: 'blue' },
              { name: 'Concluído', color: 'green' }
            ]
          }
        }
      }
    };

    mockClient.databases.create.mockResolvedValueOnce(mockDatabaseResponse);

    const database = await notionFacade.createDatabase({
      parent: { type: 'page_id', id: 'parent-page-id' },
      title: [{ text: { content: 'Banco de Dados de Teste' } }],
      properties: {
        Nome: { type: 'title', title: {} },
        Status: {
          type: 'select',
          select: {
            options: [
              { name: 'Em Progresso', color: 'blue' },
              { name: 'Concluído', color: 'green' }
            ]
          }
        }
      }
    });

    expect(database).toBeDefined();
    expect(database.id).toBe('test-database-id');

    // 2. Criar uma página no banco de dados
    const mockPageResponse = {
      object: 'page',
      id: 'test-page-id',
      parent: { database_id: database.id, type: 'database_id' },
      properties: {
        Nome: { title: [{ text: { content: 'Tarefa de Teste' } }] },
        Status: { select: { name: 'Em Progresso' } }
      }
    };

    mockClient.pages.create.mockResolvedValueOnce(mockPageResponse);

    const page = await notionFacade.createPage({
      parent: { type: 'database_id', id: database.id },
      properties: {
        Nome: { title: [{ text: { content: 'Tarefa de Teste' } }] },
        Status: { select: { name: 'Em Progresso' } }
      }
    });

    expect(page).toBeDefined();
    expect(page.id).toBe('test-page-id');

    // 3. Adicionar blocos de conteúdo
    const mockBlockResponse = {
      object: 'block',
      id: 'test-block-id',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: 'Descrição da tarefa' } }]
      }
    };

    mockClient.blocks.children.append.mockResolvedValueOnce({ results: [mockBlockResponse] });

    const block = await notionFacade.createBlock(page.id, {
      type: 'paragraph',
      content: {
        rich_text: [{ text: { content: 'Descrição da tarefa' } }]
      }
    });

    expect(block).toBeDefined();
    expect(block.type).toBe('paragraph');

    // 4. Adicionar um comentário
    const mockCommentResponse = {
      object: 'comment',
      id: 'test-comment-id',
      rich_text: [{ text: { content: 'Comentário na tarefa' } }]
    };

    mockClient.comments.create.mockResolvedValueOnce(mockCommentResponse);

    const comment = await notionFacade.createComment({
      parent: { type: 'page_id', id: page.id },
      richText: [{ text: { content: 'Comentário na tarefa' } }]
    });

    expect(comment).toBeDefined();
    expect(comment.id).toBe('test-comment-id');

    // 5. Atualizar o status da página
    const mockUpdateResponse = {
      ...mockPageResponse,
      properties: {
        ...mockPageResponse.properties,
        Status: { select: { name: 'Concluído' } }
      }
    };

    mockClient.pages.update.mockResolvedValueOnce(mockUpdateResponse);

    const updatedPage = await notionFacade.updatePage(page.id, {
      properties: {
        Status: { select: { name: 'Concluído' } }
      }
    });

    expect(updatedPage).toBeDefined();
    expect(updatedPage.properties.Status.select.name).toBe('Concluído');

    // Verificar todas as chamadas
    expect(mockClient.databases.create).toHaveBeenCalledTimes(1);
    expect(mockClient.pages.create).toHaveBeenCalledTimes(1);
    expect(mockClient.blocks.children.append).toHaveBeenCalledTimes(1);
    expect(mockClient.comments.create).toHaveBeenCalledTimes(1);
    expect(mockClient.pages.update).toHaveBeenCalledTimes(1);
  });
});
