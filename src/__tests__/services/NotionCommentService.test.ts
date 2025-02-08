import { NotionClientMock } from '../mocks/NotionClientMock';
import { CommentService } from '../../services/CommentService';
import { NotionError } from '../../utils/NotionError';
import { 
  ListCommentsResponse,
  CreateCommentResponse
} from '@notionhq/client/build/src/api-endpoints';

describe('CommentService', () => {
  const mockNotionClient = NotionClientMock.createMock();
  let commentService: CommentService;

  beforeEach(() => {
    jest.clearAllMocks();
    commentService = new CommentService(mockNotionClient);
  });

  describe('list', () => {
    it('deve listar comentários corretamente', async () => {
      const mockResponse: ListCommentsResponse = {
        object: 'list',
        results: [
          {
            object: 'comment',
            id: '1',
            parent: { type: 'page_id', page_id: 'page-id' },
            discussion_id: 'discussion-1',
            created_time: '2023-01-01T00:00:00.000Z',
            last_edited_time: '2023-01-01T00:00:00.000Z',
            created_by: { object: 'user', id: 'user-1' },
            rich_text: []
          }
        ],
        has_more: false,
        next_cursor: null,
        type: 'comment',
        comment: {}
      };

      mockNotionClient.comments.list.mockResolvedValueOnce(mockResponse);

      const response = await commentService.list({ block_id: 'block-1' });

      expect(response).toEqual(mockResponse);
      expect(mockNotionClient.comments.list).toHaveBeenCalledWith({
        block_id: 'block-1'
      });
    });

    it('deve propagar erros ao listar comentários', async () => {
      const mockError = new Error('Failed to list comments');
      mockNotionClient.comments.list.mockRejectedValueOnce(mockError);

      await expect(commentService.list({ block_id: 'block-1' }))
        .rejects
        .toThrow(mockError);
    });
  });

  describe('create', () => {
    it('deve criar um comentário em uma página', async () => {
      const mockResponse: CreateCommentResponse = {
        object: 'comment',
        id: '1',
        parent: { type: 'page_id', page_id: 'page-1' },
        discussion_id: 'discussion-1',
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-01T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        rich_text: [
          {
            type: 'text',
            text: { content: 'Test comment', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text: 'Test comment',
            href: null
          }
        ]
      };

      mockNotionClient.comments.create.mockResolvedValueOnce(mockResponse);

      const response = await commentService.create({
        parent: { page_id: 'page-1' },
        rich_text: [{ text: { content: 'Test comment' } }]
      });

      expect(response).toEqual(mockResponse);
      expect(mockNotionClient.comments.create).toHaveBeenCalledWith({
        parent: { page_id: 'page-1' },
        rich_text: [{ text: { content: 'Test comment' } }]
      });
    });

    it('deve criar um comentário em uma discussão existente', async () => {
      const mockResponse: CreateCommentResponse = {
        object: 'comment',
        id: '2',
        parent: { type: 'page_id', page_id: 'page-1' },
        discussion_id: 'discussion-1',
        created_time: '2023-01-01T00:00:00.000Z',
        last_edited_time: '2023-01-01T00:00:00.000Z',
        created_by: { object: 'user', id: 'user-1' },
        rich_text: [
          {
            type: 'text',
            text: { content: 'Reply comment', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text: 'Reply comment',
            href: null
          }
        ]
      };

      mockNotionClient.comments.create.mockResolvedValueOnce(mockResponse);

      const response = await commentService.create({
        discussion_id: 'discussion-1',
        rich_text: [{ text: { content: 'Reply comment' } }]
      });

      expect(response).toEqual(mockResponse);
      expect(mockNotionClient.comments.create).toHaveBeenCalledWith({
        discussion_id: 'discussion-1',
        rich_text: [{ text: { content: 'Reply comment' } }]
      });
    });

    it('deve propagar erros ao criar comentário', async () => {
      const mockError = new NotionError('Failed to create comment');
      mockNotionClient.comments.create.mockRejectedValueOnce(mockError);

      await expect(commentService.create({
        parent: { page_id: 'page-1' },
        rich_text: [{ text: { content: 'Test comment' } }]
      }))
        .rejects
        .toThrow(mockError);
    });
  });
});
