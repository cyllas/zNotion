import { NotionIconAdapter } from '../NotionIconAdapter';
import { NotionIcon } from '../../../../domain/types/NotionIcon';
import { NotionAPIIcon } from '../types';

/**
 * Testes para o NotionIconAdapter
 * Responsável por adaptar ícones entre o formato do domínio e da API
 */
describe('NotionIconAdapter', () => {
  const adapter = new NotionIconAdapter();

  /**
   * ✓ Teste aprovado
   * Verifica se o adaptador converte corretamente um ícone de emoji
   */
  it('deve converter um ícone de emoji corretamente', () => {
    const icon: NotionIcon = {
      type: 'emoji',
      emoji: '👋'
    };

    const expected: NotionAPIIcon = {
      type: 'emoji',
      emoji: '👋'
    };

    const result = adapter.adapt(icon);
    expect(result).toEqual(expected);
  });

  /**
   * ✓ Teste aprovado
   * Verifica se o adaptador converte corretamente um ícone externo
   */
  it('deve converter um ícone externo corretamente', () => {
    const icon: NotionIcon = {
      type: 'external',
      external: {
        url: 'https://example.com/icon.png'
      }
    };

    const expected: NotionAPIIcon = {
      type: 'external',
      external: {
        url: 'https://example.com/icon.png'
      }
    };

    const result = adapter.adapt(icon);
    expect(result).toEqual(expected);
  });

  /**
   * ✓ Teste aprovado
   * Verifica se o adaptador retorna null para ícone nulo
   */
  it('deve retornar null para ícone nulo', () => {
    const result = adapter.adapt(null);
    expect(result).toBeNull();
  });

  /**
   * ✓ Teste aprovado
   * Verifica se o adaptador retorna null para ícone undefined
   */
  it('deve retornar null para ícone undefined', () => {
    const result = adapter.adapt(undefined);
    expect(result).toBeNull();
  });

  /**
   * ✓ Teste aprovado
   * Verifica se o adaptador lança erro para tipo de ícone inválido
   */
  it('deve lançar erro para tipo de ícone inválido', () => {
    const icon = {
      type: 'invalid',
      value: 'test'
    } as any;

    expect(() => adapter.adapt(icon)).toThrow('Tipo de ícone não suportado: invalid');
  });

  /**
   * ✓ Teste aprovado
   * Verifica se o adaptador lança erro para emoji vazio
   */
  it('deve lançar erro para emoji vazio', () => {
    const icon: NotionIcon = {
      type: 'emoji'
    };

    expect(() => adapter.adapt(icon)).toThrow('Emoji não pode ser vazio');
  });

  /**
   * ✓ Teste aprovado
   * Verifica se o adaptador lança erro para ícone externo sem URL
   */
  it('deve lançar erro para ícone externo sem URL', () => {
    const icon: NotionIcon = {
      type: 'external'
    };

    expect(() => adapter.adapt(icon)).toThrow('URL do ícone externo não pode ser vazia');
  });

  /**
   * ✓ Teste aprovado
   * Verifica se o adaptador lança erro para ícone externo com URL vazia
   */
  it('deve lançar erro para ícone externo com URL vazia', () => {
    const icon: NotionIcon = {
      type: 'external',
      external: {
        url: ''
      }
    };

    expect(() => adapter.adapt(icon)).toThrow('URL do ícone externo não pode ser vazia');
  });
});
