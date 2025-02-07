import { Client } from '@notionhq/client';

describe('Notion Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('deve criar o cliente Notion com as configurações padrão', () => {
    process.env.NOTION_API_KEY = 'test-api-key';
    
    const { config } = require('../../config/notion.config');

    expect(config).toEqual({
      apiVersion: '2022-06-28',
      auth: 'test-api-key'
    });
  });

  it('deve criar o cliente Notion com versão personalizada', () => {
    process.env.NOTION_API_KEY = 'test-api-key';
    process.env.NOTION_VERSION = '2023-01-01';
    
    const { config } = require('../../config/notion.config');

    expect(config).toEqual({
      apiVersion: '2023-01-01',
      auth: 'test-api-key'
    });
  });

  it('deve lançar erro quando NOTION_API_KEY não está definida', () => {
    delete process.env.NOTION_API_KEY;

    expect(() => {
      require('../../config/notion.config');
    }).toThrow('NOTION_API_KEY não encontrada nas variáveis de ambiente');
  });

  it('deve usar a versão padrão quando NOTION_VERSION não está definida', () => {
    process.env.NOTION_API_KEY = 'test-api-key';
    delete process.env.NOTION_VERSION;
    
    const { config } = require('../../config/notion.config');

    expect(config).toEqual({
      apiVersion: '2022-06-28',
      auth: 'test-api-key'
    });
  });
});
