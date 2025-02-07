export interface INotionComment {
  id: string;
  parent: {
    type: 'page_id' | 'block_id';
    id: string;
  };
  discussion_id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    id: string;
    object: 'user';
  };
  rich_text: Array<{
    type: 'text' | 'mention' | 'equation';
    text?: {
      content: string;
      link?: {
        url: string;
      };
    };
    mention?: {
      type: 'user' | 'page' | 'database' | 'date';
      [key: string]: any;
    };
    equation?: {
      expression: string;
    };
    annotations?: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
  }>;
}

export interface IDiscussion {
  id: string;
  parent: {
    type: 'page_id' | 'block_id';
    id: string;
  };
  title?: string;
  comments: INotionComment[];
  created_time: string;
  last_edited_time: string;
}

export interface ICommentService {
  // Comentários
  createComment(
    parentId: string,
    content: string,
    discussionId?: string,
    mentions?: Array<{ id: string; type: 'user' | 'page' | 'database' }>
  ): Promise<INotionComment>;
  
  getComment(commentId: string): Promise<INotionComment>;
  
  updateComment(
    commentId: string,
    content: string,
    mentions?: Array<{ id: string; type: 'user' | 'page' | 'database' }>
  ): Promise<INotionComment>;
  
  deleteComment(commentId: string): Promise<void>;

  // Discussões
  createDiscussion(
    parentId: string,
    title?: string,
    initialComment?: string
  ): Promise<IDiscussion>;
  
  getDiscussion(discussionId: string): Promise<IDiscussion>;
  
  listDiscussions(
    parentId: string,
    options?: {
      page_size?: number;
      start_cursor?: string;
    }
  ): Promise<{
    discussions: IDiscussion[];
    has_more: boolean;
    next_cursor: string | null;
  }>;
  
  updateDiscussion(
    discussionId: string,
    title: string
  ): Promise<IDiscussion>;
  
  deleteDiscussion(discussionId: string): Promise<void>;
}
