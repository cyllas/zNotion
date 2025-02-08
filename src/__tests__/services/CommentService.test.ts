import { CommentService } from '../../services/CommentService';
import { NotionError } from '../../errors/NotionError';
import { createMockClient, MockedClient } from '../mocks/NotionClientMock';

describe('CommentService', () => {
  let service: CommentService;
  let mockClient: MockedClient;

  beforeEach(() => {
    mockClient = createMockClient();
    service = new CommentService(mockClient);
  });

  describe('create', () => {
    it('deve criar um comentário com sucesso', async () => {
      const mockResponse = {
        id: 'comment-123',
        rich_text: [{ text: { content: 'Test comment' } }],
        parent: { type: 'page_id', page_id: 'page-123' },
        created_time: '2023-01-01T00:00:00.000Z'
      };

      mockClient.comments.create.mockResolvedValueOnce(mockResponse);

      const params = {
        parent: { page_id: 'page-123' },
        rich_text: [{ text: { content: 'Test comment' } }]
      };

      const result = await service.create(params);

      expect(result).toEqual({
        id: 'comment-123',
        richText: [{ text: { content: 'Test comment' } }],
        parent: { type: 'page_id', page_id: 'page-123' },
        createdTime: '2023-01-01T00:00:00.000Z'
      });
    });

    it('deve lançar NotionError quando falhar ao criar comentário', async () => {
      const error = new Error('Failed to create comment');
      mockClient.comments.create.mockRejectedValueOnce(error);

      const params = {
        parent: { page_id: 'page-123' },
        rich_text: [{ text: { content: 'Test comment' } }]
      };

      await expect(service.create(params)).rejects.toThrow(NotionError);
    });
  });

  describe('list', () => {
    it('deve listar comentários com sucesso', async () => {
      const mockResponse = {
        results: [{
          id: 'comment-123',
          rich_text: [{ text: { content: 'Test comment' } }],
          parent: { type: 'page_id', page_id: 'page-123' },
          created_time: '2023-01-01T00:00:00.000Z'
        }]
      };

      mockClient.comments.list.mockResolvedValueOnce(mockResponse);

      const result = await service.list({ block_id: 'block-123' });

      expect(result).toEqual([{
        id: 'comment-123',
        richText: [{ text: { content: 'Test comment' } }],
        parent: { type: 'page_id', page_id: 'page-123' },
        createdTime: '2023-01-01T00:00:00.000Z'
      }]);
    });

    it('deve lançar NotionError quando falhar ao listar comentários', async () => {
      const error = new Error('Failed to list comments');
      mockClient.comments.list.mockRejectedValueOnce(error);

      await expect(service.list({ block_id: 'block-123' })).rejects.toThrow(NotionError);
    });
  });

  describe('update', () => {
    it('deve atualizar um comentário com sucesso', async () => {
      const mockResponse = {
        id: 'comment-123',
        rich_text: [{ text: { content: 'Updated comment' } }],
        parent: { type: 'page_id', page_id: 'page-123' },
        created_time: '2023-01-01T00:00:00.000Z'
      };

      mockClient.comments.update.mockResolvedValueOnce(mockResponse);

      const commentId = 'comment-123';
      const richText = [{ text: { content: 'Updated comment' } }];

      const result = await service.update(commentId, richText);

      expect(result).toEqual({
        id: 'comment-123',
        richText: [{ text: { content: 'Updated comment' } }],
        parent: { type: 'page_id', page_id: 'page-123' },
        createdTime: '2023-01-01T00:00:00.000Z'
      });
    });

    it('deve lançar NotionError quando falhar ao atualizar comentário', async () => {
      const error = new Error('Failed to update comment');
      mockClient.comments.update.mockRejectedValueOnce(error);

      const commentId = 'comment-123';
      const richText = [{ text: { content: 'Updated comment' } }];

      await expect(service.update(commentId, richText)).rejects.toThrow(NotionError);
    });
  });

  describe('delete', () => {
    it('deve deletar um comentário com sucesso', async () => {
      mockClient.comments.delete.mockResolvedValueOnce(undefined);

      await expect(service.delete('comment-123')).resolves.toBeUndefined();
    });

    it('deve lançar NotionError quando falhar ao deletar comentário', async () => {
      const error = new Error('Failed to delete comment');
      mockClient.comments.delete.mockRejectedValueOnce(error);

      await expect(service.delete('comment-123')).rejects.toThrow(NotionError);
    });
  });
});
