import { NotionErrorResponse } from '../types/NotionTypes';

/**
 * Classe base para validação de tipos do Notion
 */
export class BaseValidator {
  /**
   * Valida se um valor é uma string não vazia
   */
  protected static validateString(value: any, fieldName: string): void {
    if (typeof value !== 'string' || !value.trim()) {
      this.throwValidationError(`${fieldName} deve ser uma string não vazia`);
    }
  }

  /**
   * Valida se um valor é um booleano
   */
  protected static validateBoolean(value: any, fieldName: string): void {
    if (typeof value !== 'boolean') {
      this.throwValidationError(`${fieldName} deve ser um booleano`);
    }
  }

  /**
   * Valida se um valor é um número
   */
  protected static validateNumber(value: any, fieldName: string): void {
    if (typeof value !== 'number' || isNaN(value)) {
      this.throwValidationError(`${fieldName} deve ser um número válido`);
    }
  }

  /**
   * Valida se um valor é um array
   */
  protected static validateArray(value: any, fieldName: string): void {
    if (!Array.isArray(value)) {
      this.throwValidationError(`${fieldName} deve ser um array`);
    }
  }

  /**
   * Valida se um valor é um objeto
   */
  protected static validateObject(value: any, fieldName: string): void {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      this.throwValidationError(`${fieldName} deve ser um objeto`);
    }
  }

  /**
   * Valida se um valor é uma data válida
   */
  protected static validateDate(value: any, fieldName: string): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      this.throwValidationError(`${fieldName} deve ser uma data válida`);
    }
  }

  /**
   * Valida se um valor está presente em um enum
   */
  protected static validateEnum<T extends string>(value: any, enumObj: Record<string, T>, fieldName: string): void {
    const validValues = Object.values(enumObj);
    if (!validValues.includes(value)) {
      this.throwValidationError(`${fieldName} deve ser um dos seguintes valores: ${validValues.join(', ')}`);
    }
  }

  /**
   * Valida se um valor é um ID válido do Notion (UUID v4)
   */
  protected static validateId(value: string, fieldName: string): void {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidV4Regex.test(value)) {
      this.throwValidationError(`${fieldName} deve ser um UUID v4 válido`);
    }
  }

  /**
   * Valida se um valor é uma URL válida
   */
  protected static validateUrl(value: string, fieldName: string): void {
    try {
      new URL(value);
    } catch {
      this.throwValidationError(`${fieldName} deve ser uma URL válida`);
    }
  }

  /**
   * Valida se um valor é um e-mail válido
   */
  protected static validateEmail(value: string, fieldName: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      this.throwValidationError(`${fieldName} deve ser um e-mail válido`);
    }
  }

  /**
   * Valida se um valor é um número de telefone válido
   */
  protected static validatePhoneNumber(value: string, fieldName: string): void {
    const phoneRegex = /^\+?[\d\s-()]{8,}$/;
    if (!phoneRegex.test(value)) {
      this.throwValidationError(`${fieldName} deve ser um número de telefone válido`);
    }
  }

  /**
   * Lança um erro de validação
   */
  protected static throwValidationError(message: string): never {
    const error: NotionErrorResponse = {
      code: 'validation_error',
      message,
      status: 400
    };
    throw error;
  }
}
