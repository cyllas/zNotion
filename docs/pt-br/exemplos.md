# Exemplos de Uso do zNotion

> [← Voltar para o README](../README.md) | [Ver Documentação da API →](api.md) | [Ver API REST →](rest-api.md) | [Ver Versionamento →](versionamento.md)

Este guia fornece exemplos práticos de como utilizar o zNotion em diferentes cenários.

## Índice

- [Gerenciamento de Projetos](#gerenciamento-de-projetos)
- [Sistema de Notas](#sistema-de-notas)
- [Gestão de Tarefas](#gestão-de-tarefas)
- [Base de Conhecimento](#base-de-conhecimento)

## Gerenciamento de Projetos

> 💡 Para detalhes sobre os tipos e interfaces utilizados, consulte a [documentação da API](api.md#páginas)

### Criando um Novo Projeto

```typescript
const projeto = await notionService.createPage({
  parent: { database_id: 'seu_database_id' },
  properties: {
    Nome: {
      title: [
        {
          text: { content: 'Projeto Website' }
        }
      ]
    },
    Status: {
      select: { name: 'Em Planejamento' }
    },
    'Data Início': {
      date: {
        start: '2024-02-07',
        end: null
      }
    },
    Responsável: {
      people: [
        { id: 'user_id' }
      ]
    },
    Prioridade: {
      select: { name: 'Alta' }
    }
  }
});
```

### Atualizando o Status do Projeto

```typescript
await notionService.updatePage('pagina_id', {
  properties: {
    Status: {
      select: { name: 'Em Andamento' }
    },
    'Progresso': {
      number: 25
    }
  }
});
```

### Consultando Projetos por Status

```typescript
const projetos = await notionService.queryDatabase('database_id', {
  filter: {
    and: [
      {
        property: 'Status',
        select: {
          equals: 'Em Andamento'
        }
      },
      {
        property: 'Prioridade',
        select: {
          equals: 'Alta'
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Data Início',
      direction: 'descending'
    }
  ]
});
```

## Sistema de Notas

> 💡 Para mais informações sobre os parâmetros de consulta, veja a [documentação da API](api.md#bancos-de-dados)

### Criando uma Nova Nota

```typescript
const nota = await notionService.createPage({
  parent: { database_id: 'seu_database_id' },
  properties: {
    Título: {
      title: [
        {
          text: { content: 'Reunião de Planejamento' }
        }
      ]
    },
    Categoria: {
      select: { name: 'Reuniões' }
    },
    Tags: {
      multi_select: [
        { name: 'Importante' },
        { name: 'Projeto' }
      ]
    }
  },
  children: [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: 'Pontos Discutidos' } }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: '1. Definição do escopo' } }]
      }
    }
  ]
});
```

### Pesquisando Notas

```typescript
const notas = await notionService.listPages({
  filter: {
    property: 'Título',
    text: {
      contains: 'Reunião'
    }
  },
  sort: {
    direction: 'descending',
    timestamp: 'created_time'
  }
});
```

## Gestão de Tarefas

> 💡 Para entender melhor o tratamento de erros, consulte a [documentação da API](api.md#tratamento-de-erros)

### Criando uma Nova Tarefa

```typescript
const tarefa = await notionService.createPage({
  parent: { database_id: 'seu_database_id' },
  properties: {
    Título: {
      title: [
        {
          text: { content: 'Implementar Autenticação' }
        }
      ]
    },
    Status: {
      select: { name: 'Pendente' }
    },
    Prioridade: {
      select: { name: 'Alta' }
    },
    'Data Limite': {
      date: {
        start: '2024-02-14'
      }
    },
    Responsável: {
      people: [
        { id: 'user_id' }
      ]
    },
    Estimativa: {
      number: 4
    }
  }
});
```

### Atualizando o Progresso da Tarefa

```typescript
await notionService.updatePage('pagina_id', {
  properties: {
    Status: {
      select: { name: 'Em Andamento' }
    },
    Progresso: {
      number: 50
    }
  }
});
```

### Listando Tarefas Atrasadas

```typescript
const hoje = new Date().toISOString().split('T')[0];

const tarefasAtrasadas = await notionService.queryDatabase('database_id', {
  filter: {
    and: [
      {
        property: 'Data Limite',
        date: {
          before: hoje
        }
      },
      {
        property: 'Status',
        select: {
          does_not_equal: 'Concluído'
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Data Limite',
      direction: 'ascending'
    }
  ]
});
```

## Base de Conhecimento

> 💡 Para detalhes sobre os tipos de blocos suportados, veja a [documentação da API](api.md#blocos)

### Criando um Artigo

```typescript
const artigo = await notionService.createPage({
  parent: { database_id: 'seu_database_id' },
  properties: {
    Título: {
      title: [
        {
          text: { content: 'Guia de Boas Práticas' }
        }
      ]
    },
    Categoria: {
      select: { name: 'Desenvolvimento' }
    },
    Tags: {
      multi_select: [
        { name: 'TypeScript' },
        { name: 'Boas Práticas' }
      ]
    },
    Autor: {
      people: [
        { id: 'user_id' }
      ]
    }
  },
  children: [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [{ text: { content: 'Introdução' } }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: 'Este guia apresenta as melhores práticas...' } }]
      }
    }
  ]
});
```

### Pesquisando na Base de Conhecimento

```typescript
const artigos = await notionService.queryDatabase('database_id', {
  filter: {
    or: [
      {
        property: 'Tags',
        multi_select: {
          contains: 'TypeScript'
        }
      },
      {
        property: 'Título',
        text: {
          contains: 'Guia'
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Última Atualização',
      direction: 'descending'
    }
  ]
});
```

### Atualizando um Artigo

```typescript
// Primeiro, adicione novos blocos ao artigo
await notionService.updateBlock('block_id', {
  paragraph: {
    rich_text: [
      {
        text: {
          content: 'Nova seção adicionada ao guia...'
        }
      }
    ]
  }
});

// Depois, atualize as propriedades
await notionService.updatePage('pagina_id', {
  properties: {
    'Última Atualização': {
      date: {
        start: new Date().toISOString()
      }
    },
    Versão: {
      number: 2
    }
  }
});
```
