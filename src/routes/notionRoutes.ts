import { Router } from 'express';
import { NotionController } from '../controllers/NotionController';
import { validator } from '../middleware/validator';
import {
  listPagesSchema,
  createPageSchema,
  updatePageSchema,
  listDatabasesSchema,
  createDatabaseSchema,
  queryDatabaseSchema,
  listBlocksSchema,
  updateBlockSchema
} from '../validators/notionSchemas';

const router = Router();
const notionController = new NotionController();

// Rotas para Páginas
router.get('/pages', validator.query(listPagesSchema), notionController.listPages);
router.get('/pages/:pageId', notionController.getPage);
router.post('/pages', validator.body(createPageSchema), notionController.createPage);
router.patch('/pages/:pageId', validator.body(updatePageSchema), notionController.updatePage);
router.delete('/pages/:pageId', notionController.archivePage);

// Rotas para Bancos de Dados
router.get('/databases', validator.query(listDatabasesSchema), notionController.listDatabases);
router.get('/databases/:databaseId', notionController.getDatabase);
router.post('/databases/:databaseId/query', validator.body(queryDatabaseSchema), notionController.queryDatabase);
router.post('/databases', validator.body(createDatabaseSchema), notionController.createDatabase);
router.patch('/databases/:databaseId', notionController.updateDatabase);

// Rotas para Blocos
router.get('/blocks', validator.query(listBlocksSchema), notionController.listBlocks);
router.get('/blocks/:blockId', notionController.getBlock);
router.patch('/blocks/:blockId', validator.body(updateBlockSchema), notionController.updateBlock);
router.delete('/blocks/:blockId', notionController.deleteBlock);
router.get('/blocks/:blockId/children', notionController.getBlockChildren);

export default router;
