import {
  listPagesSchema,
  createPageSchema,
  updatePageSchema,
  listDatabasesSchema,
  createDatabaseSchema,
  queryDatabaseSchema,
  listBlocksSchema,
  updateBlockSchema
} from '../../validators/notionSchemas';

describe('Notion Schemas de Validação', () => {
  describe('Schemas de Páginas', () => {
    it('deve validar listPagesSchema corretamente', () => {
      const validData = {
        query: {
          start_cursor: 'cursor123',
          page_size: 50,
          sort: [
            {
              property: 'title',
              direction: 'ascending'
            }
          ]
        }
      };

      const { error } = listPagesSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('deve validar createPageSchema corretamente', () => {
      const validData = {
        body: {
          parent: {
            type: 'database_id',
            database_id: 'db123'
          },
          properties: {
            title: {
              title: [{ text: { content: 'Test Page' } }]
            }
          }
        }
      };

      const { error } = createPageSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('deve rejeitar dados inválidos no createPageSchema', () => {
      const invalidData = {
        body: {
          parent: {
            type: 'invalid_type',
            database_id: 'db123'
          }
        }
      };

      const { error } = createPageSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('Schemas de Bancos de Dados', () => {
    it('deve validar listDatabasesSchema corretamente', () => {
      const validData = {
        query: {
          page_size: 30,
          sort: [
            {
              property: 'created_time',
              direction: 'descending'
            }
          ]
        }
      };

      const { error } = listDatabasesSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('deve validar queryDatabaseSchema corretamente', () => {
      const validData = {
        params: {
          databaseId: 'db123'
        },
        body: {
          filter: {
            property: 'Status',
            select: {
              equals: 'Done'
            }
          },
          sorts: [
            {
              property: 'Priority',
              direction: 'ascending'
            }
          ],
          page_size: 50
        }
      };

      const { error } = queryDatabaseSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });

  describe('Schemas de Blocos', () => {
    it('deve validar updateBlockSchema corretamente', () => {
      const validData = {
        params: {
          blockId: 'block123'
        },
        body: {
          type: 'paragraph',
          content: {
            text: [{ text: { content: 'Updated content' } }]
          }
        }
      };

      const { error } = updateBlockSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('deve rejeitar tipo de bloco inválido', () => {
      const invalidData = {
        params: {
          blockId: 'block123'
        },
        body: {
          type: 'invalid_block_type',
          content: {}
        }
      };

      const { error } = updateBlockSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });
});
