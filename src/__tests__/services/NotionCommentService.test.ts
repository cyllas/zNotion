import { CommentService } from '../../services/CommentService';
import { NotionError } from '../../utils/NotionError';
import { mockNotionClient } from '../mocks/notionClient';

describe('CommentService', () => {
  let commentService: CommentService;
  const mockPageId = 'test-page-id';
  const mockDiscussionId = 'test-discussion-id';
  const mockCommentId = 'test-comment-id';

  beforeEach(() => {
    commentService = new CommentService(mockNotionClient);
  });

  describe('listComments', () => {
    it('deve listar comentários de uma página', async () => {
      const mockResponse = {
        object: 'list',
        results: [
          {
            object: 'comment',
            id: mockCommentId,
            discussion_id: mockDiscussionId,
            rich_text: [{ text: { content: 'Test comment' } }]
          }
        ]
      };

      mockNotionClient.listComments.mockResolvedValue(mockResponse);

      const response = await commentService.listComments(mockPageId);

      expect(mockNotionClient.listComments).toHaveBeenCalledWith({ block_id: mockPageId });
      expect(response).toEqual(mockResponse);
    });

    it('deve lidar com erros ao listar comentários', async () => {
      const mockError = new Error('API Error');
      mockNotionClient.listComments.mockRejectedValue(mockError);

      await expect(commentService.listComments(mockPageId))
        .rejects
        .toThrow(NotionError);
    });
  });

  describe('createComment', () => {
    const mockComment = {
      rich_text: [{ text: { content: 'New comment' } }]
    };

    it('deve criar um novo comentário em uma página', async () => {
      const mockResponse = {
        object: 'comment',
        id: mockCommentId,
        discussion_id: mockDiscussionId,
        ...mockComment
      };

      mockNotionClient.createComment.mockResolvedValue(mockResponse);

      const response = await commentService.createComment(mockPageId, mockComment);

      expect(mockNotionClient.createComment).toHaveBeenCalledWith({
        parent: { page_id: mockPageId },
        ...mockComment
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve criar uma resposta em uma discussão existente', async () => {
      const mockResponse = {
        object: 'comment',
        id: mockCommentId,
        discussion_id: mockDiscussionId,
        ...mockComment
      };

      mockNotionClient.createComment.mockResolvedValue(mockResponse);

      const response = await commentService.createComment(
        mockPageId,
        mockComment,
        mockDiscussionId
      );

      expect(mockNotionClient.createComment).toHaveBeenCalledWith({
        discussion_id: mockDiscussionId,
        ...mockComment
      });
      expect(response).toEqual(mockResponse);
    });

    it('deve lidar com erros ao criar comentário', async () => {
      const mockError = new Error('API Error');
      mockNotionClient.createComment.mockRejectedValue(mockError);

      await expect(commentService.createComment(mockPageId, mockComment))
        .rejects
        .toThrow(NotionError);
    });
  });
});
