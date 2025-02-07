import { NotionError } from '../../utils/NotionError';

describe('NotionError', () => {
  it('deve criar um erro com mensagem', () => {
    const message = 'Erro de teste';
    const error = new NotionError(message);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NotionError);
    expect(error.message).toBe(message);
    expect(error.name).toBe('NotionError');
  });

  it('deve criar um erro com código e status', () => {
    const message = 'Erro de teste';
    const code = 'TEST_ERROR';
    const status = 400;
    const error = new NotionError(message, code, status);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NotionError);
    expect(error.message).toBe(message);
    expect(error.code).toBe(code);
    expect(error.status).toBe(status);
    expect(error.name).toBe('NotionError');
  });

  it('deve criar um erro sem código ou status', () => {
    const message = 'Erro de teste';
    const error = new NotionError(message);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NotionError);
    expect(error.message).toBe(message);
    expect(error.code).toBeUndefined();
    expect(error.status).toBeUndefined();
    expect(error.name).toBe('NotionError');
  });

  it('deve criar um erro com código mas sem status', () => {
    const message = 'Erro de teste';
    const code = 'TEST_ERROR';
    const error = new NotionError(message, code);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NotionError);
    expect(error.message).toBe(message);
    expect(error.code).toBe(code);
    expect(error.status).toBeUndefined();
    expect(error.name).toBe('NotionError');
  });

  it('deve serializar o erro para JSON corretamente com todos os campos', () => {
    const message = 'Erro de teste';
    const code = 'TEST_ERROR';
    const status = 400;
    const error = new NotionError(message, code, status);

    const json = error.toJSON();
    expect(json).toEqual({
      error: {
        name: 'NotionError',
        message: message,
        code: code,
        status: status
      }
    });
  });

  it('deve serializar o erro para JSON corretamente sem código e status', () => {
    const message = 'Erro de teste';
    const error = new NotionError(message);

    const json = error.toJSON();
    expect(json).toEqual({
      error: {
        name: 'NotionError',
        message: message,
        code: undefined,
        status: undefined
      }
    });
  });

  it('deve serializar o erro para JSON corretamente com código mas sem status', () => {
    const message = 'Erro de teste';
    const code = 'TEST_ERROR';
    const error = new NotionError(message, code);

    const json = error.toJSON();
    expect(json).toEqual({
      error: {
        name: 'NotionError',
        message: message,
        code: code,
        status: undefined
      }
    });
  });

  it('deve manter a herança de Error para instanceof funcionar', () => {
    const error = new NotionError('Erro de teste');
    
    // Verifica se instanceof funciona corretamente
    expect(error instanceof Error).toBe(true);
    expect(error instanceof NotionError).toBe(true);
    
    // Verifica se o nome da classe está correto
    expect(Object.getPrototypeOf(error).constructor.name).toBe('NotionError');
    
    // Verifica se a cadeia de protótipos está correta
    expect(Object.getPrototypeOf(Object.getPrototypeOf(error))).toBe(Error.prototype);
  });
});
