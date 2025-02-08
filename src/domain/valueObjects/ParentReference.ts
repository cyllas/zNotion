import { NotionId } from './NotionId';

/**
 * Value Object para referências parent do Notion
 * Encapsula a lógica de referência a objetos pai
 */
export class ParentReference {
  private constructor(
    private readonly type: 'page_id' | 'database_id' | 'block_id',
    private readonly id: NotionId
  ) {}

  static create(type: 'page_id' | 'database_id' | 'block_id', id: string): ParentReference {
    return new ParentReference(type, NotionId.create(id));
  }

  getType(): string {
    return this.type;
  }

  getId(): string {
    return this.id.toString();
  }

  toJSON() {
    return {
      type: this.type,
      [this.type]: this.getId()
    };
  }

  equals(other: ParentReference): boolean {
    return this.type === other.type && this.getId() === other.getId();
  }
}
