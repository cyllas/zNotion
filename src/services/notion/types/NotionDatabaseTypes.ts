import { NotionRichText, NotionUser, NotionColor } from './NotionTypes';

/**
 * Interface base para propriedades de banco de dados
 */
export interface NotionDatabasePropertyBase {
  id: string;
  name: string;
  type: string;
}

/**
 * Propriedade de título
 */
export interface NotionTitleProperty extends NotionDatabasePropertyBase {
  type: 'title';
  title: {};
}

/**
 * Propriedade de texto rico
 */
export interface NotionRichTextProperty extends NotionDatabasePropertyBase {
  type: 'rich_text';
  rich_text: {};
}

/**
 * Propriedade de número
 */
export interface NotionNumberProperty extends NotionDatabasePropertyBase {
  type: 'number';
  number: {
    format: 'number' | 'number_with_commas' | 'percent' | 'dollar' | 'euro' | 'pound' | 'yen' | 'ruble' | 'rupee' | 'won' | 'yuan';
  };
}

/**
 * Propriedade de seleção
 */
export interface NotionSelectProperty extends NotionDatabasePropertyBase {
  type: 'select';
  select: {
    options: Array<{
      id: string;
      name: string;
      color: NotionColor;
    }>;
  };
}

/**
 * Propriedade de múltipla seleção
 */
export interface NotionMultiSelectProperty extends NotionDatabasePropertyBase {
  type: 'multi_select';
  multi_select: {
    options: Array<{
      id: string;
      name: string;
      color: NotionColor;
    }>;
  };
}

/**
 * Propriedade de data
 */
export interface NotionDateProperty extends NotionDatabasePropertyBase {
  type: 'date';
  date: {};
}

/**
 * Propriedade de pessoas
 */
export interface NotionPeopleProperty extends NotionDatabasePropertyBase {
  type: 'people';
  people: {};
}

/**
 * Propriedade de arquivos
 */
export interface NotionFilesProperty extends NotionDatabasePropertyBase {
  type: 'files';
  files: {};
}

/**
 * Propriedade de checkbox
 */
export interface NotionCheckboxProperty extends NotionDatabasePropertyBase {
  type: 'checkbox';
  checkbox: {};
}

/**
 * Propriedade de URL
 */
export interface NotionUrlProperty extends NotionDatabasePropertyBase {
  type: 'url';
  url: {};
}

/**
 * Propriedade de email
 */
export interface NotionEmailProperty extends NotionDatabasePropertyBase {
  type: 'email';
  email: {};
}

/**
 * Propriedade de telefone
 */
export interface NotionPhoneNumberProperty extends NotionDatabasePropertyBase {
  type: 'phone_number';
  phone_number: {};
}

/**
 * Propriedade de fórmula
 */
export interface NotionFormulaProperty extends NotionDatabasePropertyBase {
  type: 'formula';
  formula: {
    expression: string;
  };
}

/**
 * Propriedade de relação
 */
export interface NotionRelationProperty extends NotionDatabasePropertyBase {
  type: 'relation';
  relation: {
    database_id: string;
    synced_property_id?: string;
    synced_property_name?: string;
  };
}

/**
 * Propriedade de rollup
 */
export interface NotionRollupProperty extends NotionDatabasePropertyBase {
  type: 'rollup';
  rollup: {
    relation_property_name: string;
    relation_property_id: string;
    rollup_property_name: string;
    rollup_property_id: string;
    function: 'count' | 'count_values' | 'empty' | 'not_empty' | 'unique' | 'show_original' | 'show_unique' | 
              'percent_empty' | 'percent_not_empty' | 'percent_per_group' | 'percent_checked' | 
              'sum' | 'average' | 'median' | 'min' | 'max' | 'range' |
              'earliest_date' | 'latest_date' | 'date_range' |
              'checked' | 'unchecked' | 'percent_unchecked' |
              'count_per_group' | 'show_original';
  };
}

/**
 * Propriedade de criado por
 */
export interface NotionCreatedByProperty extends NotionDatabasePropertyBase {
  type: 'created_by';
  created_by: {};
}

/**
 * Propriedade de última edição por
 */
export interface NotionLastEditedByProperty extends NotionDatabasePropertyBase {
  type: 'last_edited_by';
  last_edited_by: {};
}

/**
 * Propriedade de data de criação
 */
export interface NotionCreatedTimeProperty extends NotionDatabasePropertyBase {
  type: 'created_time';
  created_time: {};
}

/**
 * Propriedade de data da última edição
 */
export interface NotionLastEditedTimeProperty extends NotionDatabasePropertyBase {
  type: 'last_edited_time';
  last_edited_time: {};
}

/**
 * União de todos os tipos de propriedades
 */
export type NotionDatabaseProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionNumberProperty
  | NotionSelectProperty
  | NotionMultiSelectProperty
  | NotionDateProperty
  | NotionPeopleProperty
  | NotionFilesProperty
  | NotionCheckboxProperty
  | NotionUrlProperty
  | NotionEmailProperty
  | NotionPhoneNumberProperty
  | NotionFormulaProperty
  | NotionRelationProperty
  | NotionRollupProperty
  | NotionCreatedByProperty
  | NotionLastEditedByProperty
  | NotionCreatedTimeProperty
  | NotionLastEditedTimeProperty;
