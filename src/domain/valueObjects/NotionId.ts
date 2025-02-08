/**
 * Value Object para IDs do Notion
 * Garante a validação e formatação correta dos IDs
 */
export class NotionId {
  private constructor(private readonly value: string) {
    if (!NotionId.isValid(value)) {
      throw new Error('ID do Notion inválido');
    }
  }

  static create(value: string): NotionId {
    return new NotionId(value);
  }

  static isValid(value: string): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  toString(): string {
    return this.value;
  }

  equals(other: NotionId): boolean {
    return this.value === other.value;
  }
}
