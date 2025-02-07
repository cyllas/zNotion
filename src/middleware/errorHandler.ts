import { Request, Response, NextFunction } from 'express';
import { NotionError } from '../utils/NotionError';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Erro] ${error.message}`);

  if (error instanceof NotionError) {
    return res.status(error.status).json(error.toJSON());
  }

  return res.status(500).json({
    error: {
      name: 'InternalServerError',
      message: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR',
      status: 500
    }
  });
};
