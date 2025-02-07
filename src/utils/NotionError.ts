export class NotionError extends Error {
  public readonly code?: string;
  public readonly status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'NotionError';
    this.code = code;
    this.status = status;

    // Necessário para que instanceof funcione corretamente
    Object.setPrototypeOf(this, NotionError.prototype);
  }

  public toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        status: this.status
      }
    };
  }
}
