# zNotion API Documentation

> [← Back to README](../../README.md) | [View REST API →](rest-api.md) | [View Examples →](examples.md) | [View Versioning →](versioning.md)

## Table of Contents

- [Introduction](#introduction)
- [Authentication](#authentication)
- [Services](#services)
  - [NotionService](#notionservice)
  - [Validation](#validation)
  - [Error Handling](#error-handling)
- [Types](#types)
- [Examples](#examples)

## Introduction

zNotion is a TypeScript library that provides an elegant and typed interface for interacting with the Notion API. The library is built around the concept of services, where each service is responsible for a specific set of functionalities.

## Authentication

Authentication is done through a Notion integration token. The token can be configured in two ways:

1. Through environment variable:
```env
NOTION_API_KEY=your_token_here
```

2. Through the NotionService constructor:
```typescript
const client = new Client({ auth: 'your_token_here' });
const notionService = new NotionService(client);
```

## Services

### NotionService

The `NotionService` is the main entry point of the library. It provides methods to interact with Notion pages, databases, and blocks.

#### Pages

```typescript
interface ListPagesParams {
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

interface CreatePageParams {
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

interface UpdatePageParams {
  properties?: {
    [key: string]: any;
  };
  archived?: boolean;
}
```

#### Databases

```typescript
interface ListDatabasesParams {
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

interface QueryDatabaseParams {
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

interface UpdateDatabaseParams {
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

#### Blocks

```typescript
interface ListBlocksParams {
  page_size?: number;
  start_cursor?: string;
}

interface UpdateBlockParams {
  type?: string;
  [key: string]: any;
}
```

### Validation

The library uses Joi for schema validation. The schemas are defined in `src/validators/notionSchemas.ts`:

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

// ... other schemas
```

### Error Handling

The library provides a `NotionError` class for consistent error handling:

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

Errors are handled centrally in `NotionService`:

```typescript
private handleError(error: any): never {
  if (error instanceof APIResponseError) {
    throw new NotionError(
      error.message,
      'notionhq_client_response_error',
      error.status
    );
  }
  // ... other error handling
}
```

## Types

The library provides complete TypeScript types for all operations. The main types are defined in `src/interfaces/`:

- `INotionClient.ts`: Interface for the Notion client
- `INotionTypes.ts`: Types for Notion objects (pages, databases, blocks)

## Examples

### Creating a Page with Custom Properties

```typescript
const notionService = new NotionService();

const page = await notionService.createPage({
  parent: { database_id: 'your_database_id' },
  properties: {
    Name: {
      title: [
        {
          text: {
            content: 'My New Page'
          }
        }
      ]
    },
    Status: {
      select: {
        name: 'In Progress'
      }
    },
    Priority: {
      number: 1
    },
    Tags: {
      multi_select: [
        { name: 'Important' },
        { name: 'Project' }
      ]
    }
  }
});
```

### Querying a Database with Filters

```typescript
const results = await notionService.queryDatabase('database_id', {
  filter: {
    and: [
      {
        property: 'Status',
        select: {
          equals: 'In Progress'
        }
      },
      {
        property: 'Priority',
        number: {
          greater_than_or_equal_to: 2
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Priority',
      direction: 'descending'
    }
  ],
  page_size: 50
});
```

### Updating Text Blocks

```typescript
const updatedBlock = await notionService.updateBlock('block_id', {
  paragraph: {
    rich_text: [
      {
        text: {
          content: 'New block content'
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
