import Joi from 'joi';

// Schemas comuns
const paginationSchema = {
  start_cursor: Joi.string(),
  page_size: Joi.number().integer().min(1).max(100)
};

const sortSchema = Joi.array().items(
  Joi.object({
    property: Joi.string().required(),
    direction: Joi.string().valid('ascending', 'descending').required()
  })
);

// Schemas para Páginas
export const listPagesSchema = Joi.object({
  query: Joi.object({
    ...paginationSchema,
    sort: sortSchema,
    filter: Joi.object(),
    search: Joi.string()
  })
});

export const createPageSchema = Joi.object({
  body: Joi.object({
    parent: Joi.object({
      type: Joi.string().valid('database_id', 'page_id').required(),
      database_id: Joi.string().when('type', {
        is: 'database_id',
        then: Joi.required(),
        otherwise: Joi.forbidden()
      }),
      page_id: Joi.string().when('type', {
        is: 'page_id',
        then: Joi.required(),
        otherwise: Joi.forbidden()
      })
    }).required(),
    properties: Joi.object().required(),
    children: Joi.array()
  })
});

export const updatePageSchema = Joi.object({
  params: Joi.object({
    pageId: Joi.string().required()
  }),
  body: Joi.object({
    properties: Joi.object().required(),
    archived: Joi.boolean()
  })
});

// Schemas para Bancos de Dados
export const listDatabasesSchema = Joi.object({
  query: Joi.object({
    ...paginationSchema,
    sort: sortSchema,
    filter: Joi.object(),
    search: Joi.string()
  })
});

export const createDatabaseSchema = Joi.object({
  body: Joi.object({
    parent: Joi.object({
      type: Joi.string().valid('page_id').required(),
      page_id: Joi.string().required()
    }).required(),
    title: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('text').required(),
        text: Joi.object({
          content: Joi.string().required()
        }).required()
      })
    ).required(),
    properties: Joi.object().required()
  })
});

export const queryDatabaseSchema = Joi.object({
  params: Joi.object({
    databaseId: Joi.string().required()
  }),
  body: Joi.object({
    filter: Joi.object(),
    sorts: Joi.array(),
    ...paginationSchema
  })
});

// Schemas para Blocos
export const listBlocksSchema = Joi.object({
  query: Joi.object({
    ...paginationSchema,
    sort: sortSchema,
    filter: Joi.object(),
    search: Joi.string()
  })
});

export const updateBlockSchema = Joi.object({
  params: Joi.object({
    blockId: Joi.string().required()
  }),
  body: Joi.object({
    type: Joi.string().valid(
      'paragraph',
      'heading_1',
      'heading_2',
      'heading_3',
      'bulleted_list_item',
      'numbered_list_item',
      'to_do',
      'toggle',
      'child_page',
      'child_database',
      'embed',
      'image',
      'video',
      'file',
      'pdf',
      'bookmark',
      'callout',
      'quote',
      'equation',
      'divider',
      'table_of_contents',
      'column',
      'column_list',
      'link_preview',
      'synced_block',
      'template',
      'link_to_page',
      'table',
      'table_row'
    ).required(),
    content: Joi.object().required()
  })
});
