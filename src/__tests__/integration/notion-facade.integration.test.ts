import { NotionFacade } from '../../facades/NotionFacade';
import { createMockClient } from '../mocks/NotionClientMock';
import { NotionConfig } from '../../config/NotionConfig';

describe('NotionFacade Integration', () => {
  let notionFacade: NotionFacade;
  let mockClient: ReturnType<typeof createMockClient>;
  let config: NotionConfig;

  beforeEach(() => {
    mockClient = createMockClient();
    config = {
      apiKey: 'test-api-key',
      version: '2022-06-28'
    };
    notionFacade = new NotionFacade(config, mockClient);
  });

  describe('Operações de Página', () => {
    it('deve criar uma página com sucesso', async () => {
      const mockPageResponse = {
        id: 'test-page-id',
        properties: {
          Nome: {
            type: 'title',
            id: 'title-id',
            title: [{
              type: 'text',
              text: {
                content: 'Página de Teste',
                link: null
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default'
              },
              plain_text: 'Página de Teste',
              href: null
            }]
          }
        }
      };

      mockClient.pages.create.mockResolvedValueOnce(mockPageResponse);

      const result = await notionFacade.createPage({
        parentId: 'test-database-id',
        properties: {
          Nome: {
            type: 'title',
            title: [{
              type: 'text',
              text: {
                content: 'Página de Teste',
                link: null
              }
            }]
          }
        }
      });

      expect(result).toEqual(mockPageResponse);
      expect(mockClient.pages.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Operações de Banco de Dados', () => {
    it('deve consultar um banco de dados com sucesso', async () => {
      const mockResponse = {
        results: [{
          id: 'test-page-id',
          properties: {
            Nome: {
              type: 'title',
              title: [{
                type: 'text',
                text: {
                  content: 'Página de Teste',
                  link: null
                }
              }]
            }
          }
        }],
        has_more: false,
        next_cursor: null
      };

      mockClient.databases.query.mockResolvedValueOnce(mockResponse);

      const result = await notionFacade.queryDatabase('test-database-id', {
        filter: {
          property: 'Nome',
          title: {
            equals: 'Página de Teste'
          }
        }
      });

      expect(result).toEqual(mockResponse);
      expect(mockClient.databases.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('Operações de Bloco e Comentário', () => {
    const pageId = 'test-page-id';

    it('deve criar um bloco e um comentário com sucesso', async () => {
      const mockBlockResponse = {
        id: 'test-block-id',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: {
              content: 'Texto de teste',
              link: null
            }
          }]
        }
      };

      const mockCommentResponse = {
        id: 'test-comment-id',
        parent: {
          type: 'page_id',
          page_id: pageId
        },
        discussion_id: 'test-discussion-id',
        rich_text: [{
          type: 'text',
          text: {
            content: 'Comentário de teste',
            link: null
          }
        }]
      };

      mockClient.blocks.children.append.mockResolvedValueOnce({ results: [mockBlockResponse] });
      mockClient.comments.create.mockResolvedValueOnce(mockCommentResponse);

      const block = await notionFacade.createBlock(pageId, {
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: {
              content: 'Texto de teste',
              link: null
            }
          }]
        }
      });

      const comment = await notionFacade.createComment({
        parent: {
          page_id: pageId
        },
        rich_text: [{
          type: 'text',
          text: {
            content: 'Comentário de teste',
            link: null
          }
        }]
      });

      expect(block.results[0]).toEqual(mockBlockResponse);
      expect(comment).toEqual(mockCommentResponse);
      expect(mockClient.blocks.children.append).toHaveBeenCalledTimes(1);
      expect(mockClient.comments.create).toHaveBeenCalledTimes(1);
    });
  });
});
