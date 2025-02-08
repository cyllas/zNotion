import { DatabaseValidator } from '../DatabaseValidator';
import { NotionDatabaseProperty, NotionFilter, NotionSort } from '../../types/NotionTypes';

describe('DatabaseValidator', () => {
  describe('validateDatabaseProperty', () => {
    it('deve validar propriedade de título', () => {
      const property: NotionDatabaseProperty = {
        id: 'title-1',
        type: 'title',
        name: 'Título'
      };

      expect(() => DatabaseValidator.validateDatabaseProperty(property)).not.toThrow();
    });

    it('deve validar propriedade numérica', () => {
      const property: NotionDatabaseProperty = {
        id: 'number-1',
        type: 'number',
        name: 'Quantidade'
      };

      expect(() => DatabaseValidator.validateDatabaseProperty(property)).not.toThrow();
    });

    it('deve validar propriedade de seleção', () => {
      const property: NotionDatabaseProperty = {
        id: 'select-1',
        type: 'select',
        name: 'Status'
      };

      expect(() => DatabaseValidator.validateDatabaseProperty(property)).not.toThrow();
    });

    it('deve validar propriedade de seleção múltipla', () => {
      const property: NotionDatabaseProperty = {
        id: 'multi-select-1',
        type: 'multi_select',
        name: 'Tags'
      };

      expect(() => DatabaseValidator.validateDatabaseProperty(property)).not.toThrow();
    });

    it('deve validar propriedade de fórmula', () => {
      const property: NotionDatabaseProperty = {
        id: 'formula-1',
        type: 'formula',
        name: 'Cálculo'
      };

      expect(() => DatabaseValidator.validateDatabaseProperty(property)).not.toThrow();
    });

    it('deve validar propriedade de relação', () => {
      const property: NotionDatabaseProperty = {
        id: 'relation-1',
        type: 'relation',
        name: 'Relacionado'
      };

      expect(() => DatabaseValidator.validateDatabaseProperty(property)).not.toThrow();
    });
  });

  describe('validateFilter', () => {
    it('deve validar filtro de texto', () => {
      const filter: NotionFilter = {
        property: 'title',
        type: 'equals',
        value: 'teste'
      };

      expect(() => DatabaseValidator.validateFilter(filter)).not.toThrow();
    });

    it('deve validar filtro numérico', () => {
      const filter: NotionFilter = {
        property: 'quantidade',
        type: 'greater_than',
        value: 10
      };

      expect(() => DatabaseValidator.validateFilter(filter)).not.toThrow();
    });

    it('deve validar filtro booleano', () => {
      const filter: NotionFilter = {
        property: 'concluido',
        type: 'equals',
        value: true
      };

      expect(() => DatabaseValidator.validateFilter(filter)).not.toThrow();
    });

    it('deve validar filtro de seleção múltipla', () => {
      const filter: NotionFilter = {
        property: 'tags',
        type: 'contains',
        value: ['importante', 'urgente']
      };

      expect(() => DatabaseValidator.validateFilter(filter)).not.toThrow();
    });
  });

  describe('validateSort', () => {
    it('deve validar ordenação por timestamp', () => {
      const sort: NotionSort = {
        property: 'created_time',
        direction: 'descending'
      };

      expect(() => DatabaseValidator.validateSort(sort)).not.toThrow();
    });

    it('deve validar ordenação por propriedade', () => {
      const sort: NotionSort = {
        property: 'title',
        direction: 'ascending'
      };

      expect(() => DatabaseValidator.validateSort(sort)).not.toThrow();
    });
  });
});
