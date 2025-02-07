import { createValidator } from 'express-joi-validation';
import { Request, Response, NextFunction } from 'express';

export const validator = createValidator({
  passError: true
});

export const validationErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      error: {
        name: 'ValidationError',
        message: 'Erro de validação nos dados de entrada',
        details: err.error.details,
        status: 400
      }
    });
  } else {
    next(err);
  }
};
