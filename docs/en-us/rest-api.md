# zNotion RESTful APIs

> [← Back to README](../../README.md) | [View API Documentation →](api.md) | [View Examples →](examples.md) | [View Versioning →](versioning.md)

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Pages](#pages)
  - [Databases](#databases)
  - [Blocks](#blocks)
- [Status Codes](#status-codes)
- [Response Formats](#response-formats)

## Overview

The zNotion RESTful API follows REST best practices and provides endpoints for all operations supported by the library.

Base URL: `http://your-domain.com/api/v1`

## Authentication

All requests must include the authentication token in the header:

```http
Authorization: Bearer your_token_here
```

## Endpoints

### Pages

#### List Pages

```http
GET /pages
```

Query Parameters:
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

Example Response:
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
        "Name": {
          "title": [
            {
              "text": {
                "content": "My Page"
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

#### Get Page

```http
GET /pages/:id
```

#### Create Page

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

#### Update Page

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

#### Archive Page

```http
DELETE /pages/:id
```

### Databases

#### List Databases

```http
GET /databases
```

Query Parameters:
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

#### Get Database

```http
GET /databases/:id
```

#### Query Database

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

#### Update Database

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

### Blocks

#### List Blocks

```http
GET /blocks
```

Query Parameters:
```typescript
{
  page_size?: number;
  start_cursor?: string;
}
```

#### Get Block

```http
GET /blocks/:id
```

#### Update Block

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

#### Delete Block

```http
DELETE /blocks/:id
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Invalid request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 422 | Validation error |
| 429 | Too many requests |
| 500 | Internal server error |

## Response Formats

### Success

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Error description",
    "status": 400
  }
}
```

## Usage Examples

### cURL

```bash
# List pages
curl -X GET "http://your-domain.com/api/v1/pages" \
  -H "Authorization: Bearer your_token_here"

# Create page
curl -X POST "http://your-domain.com/api/v1/pages" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {
      "database_id": "your_database_id"
    },
    "properties": {
      "Name": {
        "title": [
          {
            "text": {
              "content": "New Page"
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
  baseURL: 'http://your-domain.com/api/v1',
  headers: {
    Authorization: `Bearer ${your_token_here}`
  }
});

// List pages
const pages = await api.get('/pages', {
  params: {
    page_size: 10,
    filter: {
      property: 'Status',
      select: {
        equals: 'In Progress'
      }
    }
  }
});

// Create page
const newPage = await api.post('/pages', {
  parent: {
    database_id: 'your_database_id'
  },
  properties: {
    Name: {
      title: [
        {
          text: {
            content: 'New Page'
          }
        }
      ]
    }
  }
});
