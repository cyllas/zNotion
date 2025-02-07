# APIs RESTful do zNotion

> [← Voltar para o README](../README.md) | [Ver Documentação da API →](api.md) | [Ver Exemplos Práticos →](exemplos.md)

## Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Páginas](#páginas)
  - [Bancos de Dados](#bancos-de-dados)
  - [Blocos](#blocos)
- [Códigos de Status](#códigos-de-status)
- [Formatos de Resposta](#formatos-de-resposta)

## Visão Geral

A API RESTful do zNotion segue as melhores práticas REST e fornece endpoints para todas as operações suportadas pela biblioteca.

Base URL: `http://seu-dominio.com/api/v1`

## Autenticação

Todas as requisições devem incluir o token de autenticação no header:

```http
Authorization: Bearer seu_token_aqui
```

## Endpoints

### Páginas

#### Listar Páginas

```http
GET /pages
```

Parâmetros de Query:
```typescript
{
  page_size?: number;
  start_cursor?: string;
  filter?: {
    property: string;
    [key: string]: any;
  };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'created_time' | 'last_edited_time';
  };
}
```

Exemplo de Resposta:
```json
{
  "object": "list",
  "results": [
    {
      "object": "page",
      "id": "page_id",
      "created_time": "2024-02-07T00:00:00.000Z",
      "last_edited_time": "2024-02-07T00:00:00.000Z",
      "properties": {
        "Nome": {
          "title": [
            {
              "text": {
                "content": "Minha Página"
              }
            }
          ]
        }
      }
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```

#### Obter Página

```http
GET /pages/:id
```

#### Criar Página

```http
POST /pages
```

Body:
```typescript
{
  parent: {
    database_id: string;
  };
  properties: {
    [key: string]: any;
  };
  children?: Array<{
    type: string;
    [key: string]: any;
  }>;
}
```

#### Atualizar Página

```http
PATCH /pages/:id
```

Body:
```typescript
{
  properties?: {
    [key: string]: any;
  };
  archived?: boolean;
}
```

#### Arquivar Página

```http
DELETE /pages/:id
```

### Bancos de Dados

#### Listar Bancos de Dados

```http
GET /databases
```

Parâmetros de Query:
```typescript
{
  page_size?: number;
  start_cursor?: string;
  filter?: {
    property: string;
    [key: string]: any;
  };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'created_time' | 'last_edited_time';
  };
}
```

#### Obter Banco de Dados

```http
GET /databases/:id
```

#### Consultar Banco de Dados

```http
POST /databases/:id/query
```

Body:
```typescript
{
  filter?: {
    property: string;
    [key: string]: any;
  };
  sorts?: Array<{
    property: string;
    direction: 'ascending' | 'descending';
  }>;
  page_size?: number;
  start_cursor?: string;
}
```

#### Atualizar Banco de Dados

```http
PATCH /databases/:id
```

Body:
```typescript
{
  title?: Array<{
    text: {
      content: string;
    };
  }>;
  properties?: {
    [key: string]: {
      name?: string;
      type?: string;
      [key: string]: any;
    };
  };
}
```

### Blocos

#### Listar Blocos

```http
GET /blocks
```

Parâmetros de Query:
```typescript
{
  page_size?: number;
  start_cursor?: string;
}
```

#### Obter Bloco

```http
GET /blocks/:id
```

#### Atualizar Bloco

```http
PATCH /blocks/:id
```

Body:
```typescript
{
  type?: string;
  [key: string]: any;
}
```

#### Deletar Bloco

```http
DELETE /blocks/:id
```

## Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autorizado |
| 403 | Proibido |
| 404 | Não encontrado |
| 422 | Erro de validação |
| 429 | Muitas requisições |
| 500 | Erro interno do servidor |

## Formatos de Resposta

### Sucesso

```json
{
  "success": true,
  "data": {
    // Dados da resposta
  }
}
```

### Erro

```json
{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Descrição do erro",
    "status": 400
  }
}
```

## Exemplos de Uso

### cURL

```bash
# Listar páginas
curl -X GET "http://seu-dominio.com/api/v1/pages" \
  -H "Authorization: Bearer seu_token_aqui"

# Criar página
curl -X POST "http://seu-dominio.com/api/v1/pages" \
  -H "Authorization: Bearer seu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {
      "database_id": "seu_database_id"
    },
    "properties": {
      "Nome": {
        "title": [
          {
            "text": {
              "content": "Nova Página"
            }
          }
        ]
      }
    }
  }'
```

### Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://seu-dominio.com/api/v1',
  headers: {
    Authorization: `Bearer ${seu_token_aqui}`
  }
});

// Listar páginas
const pages = await api.get('/pages', {
  params: {
    page_size: 10,
    filter: {
      property: 'Status',
      select: {
        equals: 'Em Progresso'
      }
    }
  }
});

// Criar página
const newPage = await api.post('/pages', {
  parent: {
    database_id: 'seu_database_id'
  },
  properties: {
    Nome: {
      title: [
        {
          text: {
            content: 'Nova Página'
          }
        }
      ]
    }
  }
});
```
