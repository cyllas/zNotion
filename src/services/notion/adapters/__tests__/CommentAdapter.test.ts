import { CommentAdapter } from '../CommentAdapter';
import { CommentObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionComment } from '../../types/NotionTypes';

describe('CommentAdapter', () => {
  let adapter: CommentAdapter;

  beforeEach(() => {
    adapter = new CommentAdapter();
  });

  it('deve converter comentários corretamente', () => {
    const mockResponse: CommentObjectResponse = {
      object: 'comment',
      id: 'comment-1',
      parent: {
        type: 'page_id',
        page_id: 'page-123'
      },
      discussion_id: 'discussion-1',
      created_time: '2024-02-08T19:00:00.000Z',
      last_edited_time: '2024-02-08T19:01:00.000Z',
      created_by: {
        object: 'user',
        id: 'user-1',
        name: 'Usuário Teste',
        avatar_url: 'https://example.com/avatar.jpg',
        type: 'person'
      },
      rich_text: [{
        type: 'text',
        text: {
          content: 'Comentário de teste',
          link: null
        },
        plain_text: 'Comentário de teste',
        href: null,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      }]
    };

    const result = adapter.adapt(mockResponse);

    const expected: NotionComment = {
      id: 'comment-1',
      parent: {
        type: 'page_id',
        id: 'page-123'
      },
      discussionId: 'discussion-1',
      createdTime: '2024-02-08T19:00:00.000Z',
      lastEditedTime: '2024-02-08T19:01:00.000Z',
      createdBy: {
        object: 'user',
        id: 'user-1',
        name: 'Usuário Teste',
        avatarUrl: 'https://example.com/avatar.jpg',
        type: 'person'
      },
      richText: [{
        type: 'text',
        text: {
          content: 'Comentário de teste',
          link: null
        },
        plain_text: 'Comentário de teste',
        href: null,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      }],
      resolved: false
    };

    expect(result).toEqual(expected);
  });

  it('deve lidar com lista vazia de comentários', () => {
    const mockResponse: CommentObjectResponse = {
      object: 'comment',
      id: 'comment-1',
      parent: {
        type: 'page_id',
        page_id: 'page-123'
      },
      discussion_id: 'discussion-1',
      created_time: '2024-02-08T19:00:00.000Z',
      last_edited_time: '2024-02-08T19:01:00.000Z',
      created_by: {
        object: 'user',
        id: 'user-1',
        name: 'Usuário Teste',
        avatar_url: 'https://example.com/avatar.jpg',
        type: 'person'
      },
      rich_text: []
    };

    const result = adapter.adapt(mockResponse);

    expect(result).toEqual({
      id: 'comment-1',
      parent: {
        type: 'page_id',
        id: 'page-123'
      },
      discussionId: 'discussion-1',
      createdTime: '2024-02-08T19:00:00.000Z',
      lastEditedTime: '2024-02-08T19:01:00.000Z',
      createdBy: {
        object: 'user',
        id: 'user-1',
        name: 'Usuário Teste',
        avatarUrl: 'https://example.com/avatar.jpg',
        type: 'person'
      },
      richText: [],
      resolved: false
    });
  });
});
