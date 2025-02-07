import { Request, Response, NextFunction } from 'express';
import { NotionService } from '../services/NotionService';

export class NotionController {
  private notionService: NotionService;

  constructor() {
    this.notionService = new NotionService();
  }

  // Páginas
  public getPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageId } = req.params;
      const response = await this.notionService.getPage(pageId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public createPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.notionService.createPage(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updatePage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageId } = req.params;
      const response = await this.notionService.updatePage(pageId, req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public archivePage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageId } = req.params;
      const response = await this.notionService.archivePage(pageId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public listPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.notionService.listPages(req.query);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  // Bancos de Dados
  public getDatabase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { databaseId } = req.params;
      const response = await this.notionService.getDatabase(databaseId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public queryDatabase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { databaseId } = req.params;
      const response = await this.notionService.queryDatabase(databaseId, req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public createDatabase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.notionService.createDatabase(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateDatabase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { databaseId } = req.params;
      const response = await this.notionService.updateDatabase(databaseId, req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public listDatabases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.notionService.listDatabases(req.query);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  // Blocos
  public getBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blockId } = req.params;
      const response = await this.notionService.getBlock(blockId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blockId } = req.params;
      const response = await this.notionService.updateBlock(blockId, req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blockId } = req.params;
      const response = await this.notionService.deleteBlock(blockId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public getBlockChildren = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blockId } = req.params;
      const response = await this.notionService.getBlockChildren(blockId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public listBlocks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.notionService.listBlocks(req.query);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
