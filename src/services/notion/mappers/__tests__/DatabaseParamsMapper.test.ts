import { DatabaseParamsMapper } from '../DatabaseParamsMapper';
import { NotionIconAdapter } from '../../adapters/NotionIconAdapter';
import { CreateDatabaseParams, UpdateDatabaseParams } from '../../types/ServiceParams';

describe('DatabaseParamsMapper', () => {
  let mapper: DatabaseParamsMapper;
  let iconAdapter: NotionIconAdapter;

  beforeEach(() => {
    iconAdapter = new NotionIconAdapter();
    mapper = new DatabaseParamsMapper(iconAdapter);
  });

  describe('mapCreateParams', () => {
    it('deve mapear parâmetros de criação corretamente', () => {
      const input: CreateDatabaseParams = {
        parent: {
          type: 'page_id',
          id: 'page-123'
        },
        title: [{
          type: 'text',
          text: {
            content: 'Novo Banco de Dados',
            link: null
          }
        }],
        properties: {},
        icon: {
          emoji: '📚',
          type: 'emoji'
        }
      };

      const result = mapper.mapCreateParams(input);

      expect(result).toEqual({
        parent: {
          type: 'page_id',
          id: 'page-123'
        },
        title: [{
          type: 'text',
          text: {
            content: 'Novo Banco de Dados',
            link: null
          }
        }],
        properties: {},
        icon: {
          emoji: '📚',
          type: 'emoji'
        }
      });
    });
  });

  describe('mapUpdateParams', () => {
    it('deve mapear parâmetros de atualização corretamente', () => {
      const input: UpdateDatabaseParams = {
        title: [{
          type: 'text',
          text: {
            content: 'Banco de Dados Atualizado',
            link: null
          }
        }],
        icon: {
          external: { url: 'https://exemplo.com/icon.png' },
          type: 'external'
        }
      };

      const result = mapper.mapUpdateParams(input);

      expect(result).toEqual({
        title: [{
          type: 'text',
          text: {
            content: 'Banco de Dados Atualizado',
            link: null
          }
        }],
        icon: {
          external: { url: 'https://exemplo.com/icon.png' },
          type: 'external'
        }
      });
    });
  });
});
