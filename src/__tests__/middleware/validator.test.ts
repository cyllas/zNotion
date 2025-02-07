import { Request, Response } from 'express';
import { validationErrorHandler } from '../../middleware/validator';

describe('Validator Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('deve passar o erro para o próximo middleware se não for um erro de validação', () => {
    const error = new Error('Erro genérico');

    validationErrorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('deve retornar erro 400 com detalhes quando for um erro de validação', () => {
    const joiError = {
      error: {
        isJoi: true,
        details: [
          {
            message: 'Campo obrigatório',
            path: ['nome'],
            type: 'any.required'
          }
        ]
      }
    };

    validationErrorHandler(
      joiError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        name: 'ValidationError',
        message: 'Erro de validação nos dados de entrada',
        details: joiError.error.details,
        status: 400
      }
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
