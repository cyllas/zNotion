/**
 * Value Object para timestamps do Notion
 * Encapsula a lógica de manipulação de datas
 */
export class TimeStamp {
  private constructor(private readonly value: string) {
    if (!TimeStamp.isValid(value)) {
      throw new Error('Timestamp inválido');
    }
  }

  static create(value: string): TimeStamp {
    return new TimeStamp(value);
  }

  static now(): TimeStamp {
    return new TimeStamp(new Date().toISOString());
  }

  static isValid(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  toString(): string {
    return this.value;
  }

  toDate(): Date {
    return new Date(this.value);
  }

  equals(other: TimeStamp): boolean {
    return this.value === other.value;
  }

  isAfter(other: TimeStamp): boolean {
    return this.toDate() > other.toDate();
  }

  isBefore(other: TimeStamp): boolean {
    return this.toDate() < other.toDate();
  }
}
