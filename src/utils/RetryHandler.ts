/**
 * Configuração para o mecanismo de retry
 */
export interface RetryConfig {
  /** Número máximo de tentativas */
  maxRetries?: number;
  /** Delay inicial entre tentativas (ms) */
  initialDelay?: number;
  /** Fator de multiplicação do delay para backoff exponencial */
  backoffFactor?: number;
  /** Delay máximo entre tentativas (ms) */
  maxDelay?: number;
}

/**
 * Configuração padrão para retries
 */
const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2
};

/**
 * Classe responsável por gerenciar tentativas de retry em caso de falhas
 */
export class RetryHandler {
  private readonly config: Required<RetryConfig>;

  constructor(config?: RetryConfig) {
    this.config = {
      maxRetries: config?.maxRetries || DEFAULT_CONFIG.maxRetries,
      initialDelay: config?.initialDelay || DEFAULT_CONFIG.initialDelay,
      maxDelay: config?.maxDelay || DEFAULT_CONFIG.maxDelay,
      backoffFactor: config?.backoffFactor || DEFAULT_CONFIG.backoffFactor
    };
  }

  /**
   * Executa uma função com retry automático em caso de falha
   * @param operation Função a ser executada
   * @returns Resultado da operação
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === this.config.maxRetries - 1) {
          throw new Error(
            `Falha após ${this.config.maxRetries} tentativas: ${lastError.message}`
          );
        }

        const delay = this.calculateDelay(attempt);
        await this.delay(delay);
      }
    }

    throw new Error(
      `Falha após ${this.config.maxRetries} tentativas: ${lastError?.message ?? 'Erro desconhecido'}`
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
    return false;
  }

  /**
   * Aguarda um determinado tempo
   * @param ms Tempo em milissegundos
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateDelay(attempt: number): number {
    const delay = this.config.initialDelay * Math.pow(this.config.backoffFactor, attempt);
    return Math.min(delay, this.config.maxDelay);
  }
}
