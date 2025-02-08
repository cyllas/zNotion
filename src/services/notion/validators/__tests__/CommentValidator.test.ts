import { CommentValidator } from '../CommentValidator';
import { NotionComment } from '../../types/NotionTypes';

describe('CommentValidator', () => {
  let validator: CommentValidator;

  beforeEach(() => {
    validator = CommentValidator.getInstance();
  });

  it('deve validar um comentário válido', () => {
    const comment: NotionComment = {
      id: 'test-comment-id',
      richText: [{
        type: 'text',
        text: {
          content: 'Teste de comentário',
          link: null
        },
        plain_text: 'Teste de comentário',
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
      parent: {
        type: 'page_id',
        page_id: 'test-page-id'
      },
      discussionId: 'test-discussion-id',
      createdTime: '2024-02-08T12:00:00.000Z',
      lastEditedTime: '2024-02-08T12:00:00.000Z',
      createdBy: {
        object: 'user',
        id: 'test-user-id',
        name: 'Test User',
        avatarUrl: null,
        type: 'person'
      },
      resolved: false
    };

    expect(() => validator.validateComment(comment)).not.toThrow();
  });

  it('deve validar um comentário com texto formatado', () => {
    const comment: NotionComment = {
      id: 'test-comment-id',
      richText: [{
        type: 'text',
        text: {
          content: 'Texto em ',
          link: null
        },
        plain_text: 'Texto em ',
        href: null,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      },
      {
        type: 'text',
        text: {
          content: 'negrito',
          link: null
        },
        plain_text: 'negrito',
        href: null,
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      }],
      parent: {
        type: 'page_id',
        page_id: 'test-page-id'
      },
      discussionId: 'test-discussion-id',
      createdTime: '2024-02-08T12:00:00.000Z',
      lastEditedTime: '2024-02-08T12:00:00.000Z',
      createdBy: {
        object: 'user',
        id: 'test-user-id',
        name: 'Test User',
        avatarUrl: null,
        type: 'person'
      },
      resolved: false
    };

    expect(() => validator.validateComment(comment)).not.toThrow();
  });

  it('deve rejeitar um comentário sem texto', () => {
    const comment: NotionComment = {
      id: 'test-comment-id',
      richText: [],
      parent: {
        type: 'page_id',
        page_id: 'test-page-id'
      },
      discussionId: 'test-discussion-id',
      createdTime: '2024-02-08T12:00:00.000Z',
      lastEditedTime: '2024-02-08T12:00:00.000Z',
      createdBy: {
        object: 'user',
        id: 'test-user-id',
        name: 'Test User',
        avatarUrl: null,
        type: 'person'
      },
      resolved: false
    };

    expect(() => validator.validateComment(comment)).toThrow();
  });

  it('deve rejeitar um comentário com texto inválido', () => {
    const comment: NotionComment = {
      id: 'test-comment-id',
      richText: [{
        type: 'text',
        text: {
          content: '',
          link: null
        },
        plain_text: '',
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
      parent: {
        type: 'page_id',
        page_id: 'test-page-id'
      },
      discussionId: 'test-discussion-id',
      createdTime: '2024-02-08T12:00:00.000Z',
      lastEditedTime: '2024-02-08T12:00:00.000Z',
      createdBy: {
        object: 'user',
        id: 'test-user-id',
        name: 'Test User',
        avatarUrl: null,
        type: 'person'
      },
      resolved: false
    };

    expect(() => validator.validateComment(comment)).toThrow();
  });

  it('deve rejeitar um comentário com parent inválido', () => {
    const comment: NotionComment = {
      id: 'test-comment-id',
      richText: [{
        type: 'text',
        text: {
          content: 'Teste',
          link: null
        },
        plain_text: 'Teste',
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
      parent: {
        type: 'invalid_type',
        page_id: 'test-page-id'
      } as any,
      discussionId: 'test-discussion-id',
      createdTime: '2024-02-08T12:00:00.000Z',
      lastEditedTime: '2024-02-08T12:00:00.000Z',
      createdBy: {
        object: 'user',
        id: 'test-user-id',
        name: 'Test User',
        avatarUrl: null,
        type: 'person'
      },
      resolved: false
    };

    expect(() => validator.validateComment(comment)).toThrow();
  });
});
