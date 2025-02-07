# Documentação da API do zNotion

> [← Voltar para o README](../README.md) | [Ver API REST →](rest-api.md) | [Ver Exemplos Práticos →](exemplos.md) | [Ver Versionamento →](versionamento.md)

## Índice

- [Introdução](#introdução)
- [Autenticação](#autenticação)
- [Serviços](#serviços)
  - [NotionService](#notionservice)
  - [Validação](#validação)
  - [Tratamento de Erros](#tratamento-de-erros)
- [Tipos](#tipos)
- [Exemplos](#exemplos)

## Introdução

O zNotion é uma biblioteca TypeScript que fornece uma interface elegante e tipada para interagir com a API do Notion. A biblioteca é construída em torno do conceito de serviços, onde cada serviço é responsável por um conjunto específico de funcionalidades.

## Autenticação

A autenticação é feita através de um token de integração do Notion. O token pode ser configurado de duas maneiras:

1. Através de variável de ambiente:
```env
NOTION_API_KEY=seu_token_aqui
```

2. Através do construtor do NotionService:
```typescript
const client = new Client({ auth: 'seu_token_aqui' });
const notionService = new NotionService(client);
```

## Serviços

### NotionService

O `NotionService` é o principal ponto de entrada da biblioteca. Ele fornece métodos para interagir com páginas, bancos de dados e blocos do Notion.

#### Páginas

```typescript
interface ListPagesParams {
  page_size?: number; // Tamanho da página
  start_cursor?: string; // Cursor para paginação
  filter?: {
    property: string; // Propriedade para filtrar
    [key: string]: any; // Critérios de filtro
  };
  sort?: {
    direction: 'ascending' | 'descending'; // Direção da ordenação
    timestamp: 'created_time' | 'last_edited_time'; // Campo para ordenar
  };
}

interface CreatePageParams {
  parent: {
    database_id: string; // ID do banco de dados pai
  };
  properties: {
    [key: string]: any; // Propriedades da página
  };
  children?: Array<{
    type: string; // Tipo do bloco
    [key: string]: any; // Propriedades do bloco
  }>;
}

interface UpdatePageParams {
  properties?: {
    [key: string]: any; // Propriedades para atualizar
  };
  archived?: boolean; // Status de arquivamento
}
```

#### Bancos de Dados

```typescript
interface ListDatabasesParams {
  page_size?: number; // Tamanho da página
  start_cursor?: string; // Cursor para paginação
  filter?: {
    property: string; // Propriedade para filtrar
    [key: string]: any; // Critérios de filtro
  };
  sort?: {
    direction: 'ascending' | 'descending'; // Direção da ordenação
    timestamp: 'created_time' | 'last_edited_time'; // Campo para ordenar
  };
}

interface QueryDatabaseParams {
  filter?: {
    property: string; // Propriedade para filtrar
    [key: string]: any; // Critérios de filtro
  };
  sorts?: Array<{
    property: string; // Propriedade para ordenar
    direction: 'ascending' | 'descending'; // Direção da ordenação
  }>;
  page_size?: number; // Tamanho da página
  start_cursor?: string; // Cursor para paginação
}

interface UpdateDatabaseParams {
  title?: Array<{
    text: {
      content: string; // Novo título
    };
  }>;
  properties?: {
    [key: string]: {
      name?: string; // Nome da propriedade
      type?: string; // Tipo da propriedade
      [key: string]: any; // Configurações adicionais
    };
  };
}
```

#### Blocos

```typescript
interface ListBlocksParams {
  page_size?: number; // Tamanho da página
  start_cursor?: string; // Cursor para paginação
}

interface UpdateBlockParams {
  type?: string; // Tipo do bloco
  [key: string]: any; // Propriedades do bloco
}
```

### Validação

A biblioteca utiliza Joi para validação de schemas. Os schemas estão definidos em `src/validators/notionSchemas.ts`:

```typescript
const listPagesSchema = Joi.object({
  page_size: Joi.number().min(1).max(100),
  start_cursor: Joi.string(),
  filter: Joi.object(),
  sort: Joi.object({
    direction: Joi.string().valid('ascending', 'descending'),
    timestamp: Joi.string().valid('created_time', 'last_edited_time')
  })
});

// ... outros schemas
```

### Tratamento de Erros

A biblioteca fornece uma classe `NotionError` para tratamento consistente de erros:

```typescript
class NotionError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'NotionError';
  }
}
```

Os erros são tratados de forma centralizada no `NotionService`:

```typescript
private handleError(error: any): never {
  if (error instanceof APIResponseError) {
    throw new NotionError(
      error.message,
      'notionhq_client_response_error',
      error.status
    );
  }
  // ... outros tratamentos de erro
}
```

## Tipos

A biblioteca fornece tipos TypeScript completos para todas as operações. Os principais tipos estão definidos em `src/interfaces/`:

- `INotionClient.ts`: Interface para o cliente Notion
- `INotionTypes.ts`: Tipos para objetos do Notion (páginas, bancos de dados, blocos)

## Exemplos

Para exemplos mais detalhados e casos de uso práticos, consulte nosso [guia de exemplos](exemplos.md).

### Criando uma Página com Propriedades Personalizadas

> 💡 Veja mais exemplos de criação de páginas em [Gerenciamento de Projetos](exemplos.md#gerenciamento-de-projetos)

```typescript
const notionService = new NotionService();

const pagina = await notionService.createPage({
  parent: { database_id: 'seu_database_id' },
  properties: {
    Nome: {
      title: [
        {
          text: {
            content: 'Minha Nova Página'
          }
        }
      ]
    },
    Status: {
      select: {
        name: 'Em Progresso'
      }
    },
    Prioridade: {
      number: 1
    },
    Tags: {
      multi_select: [
        { name: 'Importante' },
        { name: 'Projeto' }
      ]
    }
  }
});
```

### Consultando um Banco de Dados com Filtros

> 💡 Veja mais exemplos de consultas em [Sistema de Notas](exemplos.md#sistema-de-notas)

```typescript
const resultados = await notionService.queryDatabase('database_id', {
  filter: {
    and: [
      {
        property: 'Status',
        select: {
          equals: 'Em Progresso'
        }
      },
      {
        property: 'Prioridade',
        number: {
          greater_than_or_equal_to: 2
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Prioridade',
      direction: 'descending'
    }
  ],
  page_size: 50
});
```

### Atualizando Blocos de Texto

> 💡 Veja mais exemplos de manipulação de blocos em [Base de Conhecimento](exemplos.md#base-de-conhecimento)

```typescript
const blocoAtualizado = await notionService.updateBlock('block_id', {
  paragraph: {
    rich_text: [
      {
        text: {
          content: 'Novo conteúdo do bloco'
        },
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default'
        }
      }
    ],
    color: 'default'
  }
});
