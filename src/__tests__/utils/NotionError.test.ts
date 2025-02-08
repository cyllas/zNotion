import { NotionError } from '../../utils/NotionError';
import { APIErrorCode } from '@notionhq/client';

describe('NotionError', () => {
  it('deve criar um erro com mensagem', () => {
    const message = 'Erro de teste';
    const error = new NotionError({
      message,
      code: 'test_error'
    });

    expect(error.message).toBe(message);
    expect(error.name).toBe('NotionError');
    expect(error instanceof Error).toBe(true);
  });

  it('deve criar um erro com código e status', () => {
    const message = 'Erro de validação';
    const code = APIErrorCode.ValidationError;
    const status = 400;
    const error = new NotionError({
      message,
      code,
      status
    });

    expect(error.message).toBe(message);
    expect(error.code).toBe(code);
    expect(error.status).toBe(status);
  });

  it('deve criar um erro sem código ou status', () => {
    const message = 'Erro genérico';
    const error = new NotionError({
      message,
      code: 'generic_error'
    });

    expect(error.message).toBe(message);
    expect(error.code).toBe('generic_error');
    expect(error.status).toBeUndefined();
  });

  it('deve criar um erro com código mas sem status', () => {
    const message = 'Erro com código';
    const code = APIErrorCode.Unauthorized;
    const error = new NotionError({
      message,
      code
    });

    expect(error.message).toBe(message);
    expect(error.code).toBe(code);
    expect(error.status).toBeUndefined();
  });

  it('deve serializar o erro para JSON corretamente com todos os campos', () => {
    const error = new NotionError({
      message: 'Erro de teste',
      code: APIErrorCode.ValidationError,
      status: 400
    });

    const json = error.toJSON();
    expect(json).toEqual({
      name: 'NotionError',
      message: 'Erro de teste',
      code: APIErrorCode.ValidationError,
      status: 400
    });
  });

  it('deve serializar o erro para JSON corretamente sem código e status', () => {
    const error = new NotionError({
      message: 'Erro de teste',
      code: 'generic_error'
    });

    const json = error.toJSON();
    expect(json).toEqual({
      name: 'NotionError',
      message: 'Erro de teste',
      code: 'generic_error',
      status: undefined
    });
  });

  it('deve serializar o erro para JSON corretamente com código mas sem status', () => {
    const error = new NotionError({
      message: 'Erro de teste',
      code: APIErrorCode.Unauthorized
    });

    const json = error.toJSON();
    expect(json).toEqual({
      name: 'NotionError',
      message: 'Erro de teste',
      code: APIErrorCode.Unauthorized,
      status: undefined
    });
  });

  it('deve manter a herança de Error para instanceof funcionar', () => {
    const error = new NotionError({
      message: 'Erro de teste',
      code: 'test_error'
    });

    expect(error instanceof Error).toBe(true);
    expect(error instanceof NotionError).toBe(true);
  });
});
