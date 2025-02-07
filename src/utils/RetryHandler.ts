/**
 * Configuração para o mecanismo de retry
 */
export interface RetryConfig {
  /** Número máximo de tentativas */
  maxRetries: number;
  /** Delay inicial entre tentativas (ms) */
  initialDelayMs: number;
  /** Fator de multiplicação do delay para backoff exponencial */
  backoffFactor: number;
  /** Delay máximo entre tentativas (ms) */
  maxDelayMs: number;
  /** Lista de códigos HTTP que devem ser retentados */
  retryableStatusCodes: number[];
}

/**
 * Configuração padrão para retries
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffFactor: 2,
  maxDelayMs: 10000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504]
};

/**
 * Classe responsável por gerenciar tentativas de retry em caso de falhas
 */
export class RetryHandler {
  constructor(private config: RetryConfig = DEFAULT_RETRY_CONFIG) {}

  /**
   * Executa uma função com retry automático em caso de falha
   * @param operation Função a ser executada
   * @returns Resultado da operação
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    let delay = this.config.initialDelayMs;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;

        if (!this.shouldRetry(error)) {
          throw error;
        }

        if (attempt === this.config.maxRetries) {
          break;
        }

        await this.wait(delay);
        delay = Math.min(
          delay * this.config.backoffFactor,
          this.config.maxDelayMs
        );
      }
    }

    throw new Error(
      `Falha após ${this.config.maxRetries} tentativas: ${lastError.message}`
    );
  }

  /**
   * Verifica se uma operação deve ser retentada com base no erro
   * @param error Erro ocorrido
   * @returns true se deve retentar, false caso contrário
   */
  private shouldRetry(error: any): boolean {
    // Erro de rede
    if (!error.status && error.message.includes('network')) {
      return true;
    }

    // Rate limiting
    if (error.status === 429) {
      return true;
    }

    // Erros do servidor
    return this.config.retryableStatusCodes.includes(error.status);
  }

  /**
   * Aguarda um determinado tempo
   * @param ms Tempo em milissegundos
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
