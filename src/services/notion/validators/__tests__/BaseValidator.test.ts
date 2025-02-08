import { BaseValidator } from '../BaseValidator';

describe('BaseValidator', () => {
  // Criando uma classe de teste que estende BaseValidator para acessar os métodos protegidos
  class TestValidator extends BaseValidator {
    static testValidateString(value: any, fieldName: string): void {
      return this.validateString(value, fieldName);
    }

    static testValidateBoolean(value: any, fieldName: string): void {
      return this.validateBoolean(value, fieldName);
    }

    static testValidateNumber(value: any, fieldName: string): void {
      return this.validateNumber(value, fieldName);
    }

    static testValidateArray(value: any, fieldName: string): void {
      return this.validateArray(value, fieldName);
    }

    static testValidateObject(value: any, fieldName: string): void {
      return this.validateObject(value, fieldName);
    }

    static testValidateDate(value: any, fieldName: string): void {
      return this.validateDate(value, fieldName);
    }

    static testValidateId(value: string, fieldName: string): void {
      return this.validateId(value, fieldName);
    }

    static testValidateUrl(value: string, fieldName: string): void {
      return this.validateUrl(value, fieldName);
    }

    static testValidateEmail(value: string, fieldName: string): void {
      return this.validateEmail(value, fieldName);
    }

    static testValidatePhoneNumber(value: string, fieldName: string): void {
      return this.validatePhoneNumber(value, fieldName);
    }
  }

  describe('validateString', () => {
    it('deve aceitar strings válidas', () => {
      expect(() => TestValidator.testValidateString('teste', 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateString('123', 'campo')).not.toThrow();
    });

    it('deve rejeitar strings vazias', () => {
      expect(() => TestValidator.testValidateString('', 'campo')).toThrow();
      expect(() => TestValidator.testValidateString('   ', 'campo')).toThrow();
    });

    it('deve rejeitar valores não string', () => {
      expect(() => TestValidator.testValidateString(123, 'campo')).toThrow();
      expect(() => TestValidator.testValidateString(null, 'campo')).toThrow();
      expect(() => TestValidator.testValidateString(undefined, 'campo')).toThrow();
      expect(() => TestValidator.testValidateString({}, 'campo')).toThrow();
    });
  });

  describe('validateBoolean', () => {
    it('deve aceitar booleanos válidos', () => {
      expect(() => TestValidator.testValidateBoolean(true, 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateBoolean(false, 'campo')).not.toThrow();
    });

    it('deve rejeitar valores não booleanos', () => {
      expect(() => TestValidator.testValidateBoolean(1, 'campo')).toThrow();
      expect(() => TestValidator.testValidateBoolean('true', 'campo')).toThrow();
      expect(() => TestValidator.testValidateBoolean(null, 'campo')).toThrow();
    });
  });

  describe('validateNumber', () => {
    it('deve aceitar números válidos', () => {
      expect(() => TestValidator.testValidateNumber(123, 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateNumber(0, 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateNumber(-123.45, 'campo')).not.toThrow();
    });

    it('deve rejeitar valores não numéricos', () => {
      expect(() => TestValidator.testValidateNumber('123', 'campo')).toThrow();
      expect(() => TestValidator.testValidateNumber(NaN, 'campo')).toThrow();
      expect(() => TestValidator.testValidateNumber(null, 'campo')).toThrow();
    });
  });

  describe('validateArray', () => {
    it('deve aceitar arrays válidos', () => {
      expect(() => TestValidator.testValidateArray([], 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateArray([1, 2, 3], 'campo')).not.toThrow();
    });

    it('deve rejeitar valores não array', () => {
      expect(() => TestValidator.testValidateArray({}, 'campo')).toThrow();
      expect(() => TestValidator.testValidateArray('[]', 'campo')).toThrow();
      expect(() => TestValidator.testValidateArray(null, 'campo')).toThrow();
    });
  });

  describe('validateObject', () => {
    it('deve aceitar objetos válidos', () => {
      expect(() => TestValidator.testValidateObject({}, 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateObject({ a: 1 }, 'campo')).not.toThrow();
    });

    it('deve rejeitar valores não objeto', () => {
      expect(() => TestValidator.testValidateObject([], 'campo')).toThrow();
      expect(() => TestValidator.testValidateObject('{}', 'campo')).toThrow();
      expect(() => TestValidator.testValidateObject(null, 'campo')).toThrow();
    });
  });

  describe('validateDate', () => {
    it('deve aceitar datas válidas', () => {
      expect(() => TestValidator.testValidateDate(new Date(), 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateDate(new Date('2025-01-01'), 'campo')).not.toThrow();
    });

    it('deve rejeitar datas inválidas', () => {
      expect(() => TestValidator.testValidateDate(new Date('invalid'), 'campo')).toThrow();
      expect(() => TestValidator.testValidateDate('2025-01-01', 'campo')).toThrow();
      expect(() => TestValidator.testValidateDate(null, 'campo')).toThrow();
    });
  });

  describe('validateId', () => {
    it('deve aceitar UUIDs v4 válidos', () => {
      expect(() => TestValidator.testValidateId('d1b3eb5e-9b9a-4c1f-9b9a-1c1f9b9a1c1f', 'campo')).not.toThrow();
    });

    it('deve rejeitar IDs inválidos', () => {
      expect(() => TestValidator.testValidateId('invalid-uuid', 'campo')).toThrow('campo deve ser um UUID v4 válido');
    });
  });

  describe('validateUrl', () => {
    it('deve aceitar URLs válidas', () => {
      expect(() => TestValidator.testValidateUrl('https://example.com', 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateUrl('http://localhost:3000', 'campo')).not.toThrow();
    });

    it('deve rejeitar URLs inválidas', () => {
      expect(() => TestValidator.testValidateUrl('not-a-url', 'campo')).toThrow();
      expect(() => TestValidator.testValidateUrl('http://', 'campo')).toThrow();
      expect(() => TestValidator.testValidateUrl('', 'campo')).toThrow();
    });
  });

  describe('validateEmail', () => {
    it('deve aceitar emails válidos', () => {
      expect(() => TestValidator.testValidateEmail('user@example.com', 'campo')).not.toThrow();
      expect(() => TestValidator.testValidateEmail('user.name+tag@example.co.uk', 'campo')).not.toThrow();
    });

    it('deve rejeitar emails inválidos', () => {
      expect(() => TestValidator.testValidateEmail('not-an-email', 'campo')).toThrow();
      expect(() => TestValidator.testValidateEmail('user@', 'campo')).toThrow();
      expect(() => TestValidator.testValidateEmail('@example.com', 'campo')).toThrow();
    });
  });

  describe('validatePhoneNumber', () => {
    it('deve aceitar números de telefone válidos', () => {
      expect(() => TestValidator.testValidatePhoneNumber('+5511999999999', 'campo')).not.toThrow();
      expect(() => TestValidator.testValidatePhoneNumber('11999999999', 'campo')).not.toThrow();
      expect(() => TestValidator.testValidatePhoneNumber('(11) 99999-9999', 'campo')).not.toThrow();
    });

    it('deve rejeitar números de telefone inválidos', () => {
      expect(() => TestValidator.testValidatePhoneNumber('123', 'campo')).toThrow();
      expect(() => TestValidator.testValidatePhoneNumber('not-a-phone', 'campo')).toThrow();
      expect(() => TestValidator.testValidatePhoneNumber('', 'campo')).toThrow();
    });
  });
});
