export class NotionError extends Error {
  constructor(message: string, public readonly originalError?: string) {
    super(message);
    this.name = 'NotionError';
  }
}
