import { NotionId } from '../valueObjects/NotionId';
import { TimeStamp } from '../valueObjects/TimeStamp';

/**
 * Classe base para todos os objetos do Notion
 * Implementa propriedades e comportamentos comuns
 */
export abstract class NotionObject {
  constructor(
    protected readonly id: NotionId,
    protected readonly createdTime: TimeStamp,
    protected readonly lastEditedTime: TimeStamp
  ) {}

  getId(): string {
    return this.id.toString();
  }

  getCreatedTime(): string {
    return this.createdTime.toString();
  }

  getLastEditedTime(): string {
    return this.lastEditedTime.toString();
  }

  abstract toJSON(): Record<string, any>;
}
