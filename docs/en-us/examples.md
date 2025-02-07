# zNotion Usage Examples

> [← Back to README](../../README.md) | [View API Documentation →](api.md) | [View REST API →](rest-api.md) | [View Versioning →](versioning.md)

This guide provides practical examples of how to use zNotion in different scenarios.

## Table of Contents

- [Project Management](#project-management)
- [Note System](#note-system)
- [Task Management](#task-management)
- [Knowledge Base](#knowledge-base)

## Project Management

> 💡 For details about types and interfaces used, check the [API documentation](api.md#pages)

### Creating a New Project

```typescript
const project = await notionService.createPage({
  parent: { database_id: 'your_database_id' },
  properties: {
    Name: {
      title: [
        {
          text: { content: 'Website Project' }
        }
      ]
    },
    Status: {
      select: { name: 'Planning' }
    },
    'Start Date': {
      date: {
        start: '2024-02-07',
        end: null
      }
    },
    Assignee: {
      people: [
        { id: 'user_id' }
      ]
    },
    Priority: {
      select: { name: 'High' }
    }
  }
});
```

### Updating Project Status

```typescript
await notionService.updatePage('page_id', {
  properties: {
    Status: {
      select: { name: 'In Progress' }
    },
    'Progress': {
      number: 25
    }
  }
});
```

### Querying Projects by Status

```typescript
const projects = await notionService.queryDatabase('database_id', {
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
        select: {
          equals: 'High'
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Start Date',
      direction: 'descending'
    }
  ]
});
```

## Note System

> 💡 For more information about query parameters, see the [API documentation](api.md#databases)

### Creating a New Note

```typescript
const note = await notionService.createPage({
  parent: { database_id: 'your_database_id' },
  properties: {
    Title: {
      title: [
        {
          text: { content: 'Planning Meeting' }
        }
      ]
    },
    Category: {
      select: { name: 'Meetings' }
    },
    Tags: {
      multi_select: [
        { name: 'Important' },
        { name: 'Project' }
      ]
    }
  },
  children: [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: 'Discussion Points' } }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: '1. Scope definition' } }]
      }
    }
  ]
});
```

### Searching Notes

```typescript
const notes = await notionService.listPages({
  filter: {
    property: 'Title',
    text: {
      contains: 'Meeting'
    }
  },
  sort: {
    direction: 'descending',
    timestamp: 'created_time'
  }
});
```

## Task Management

> 💡 To better understand error handling, check the [API documentation](api.md#error-handling)

### Creating a New Task

```typescript
const task = await notionService.createPage({
  parent: { database_id: 'your_database_id' },
  properties: {
    Title: {
      title: [
        {
          text: { content: 'Implement Authentication' }
        }
      ]
    },
    Status: {
      select: { name: 'Pending' }
    },
    Priority: {
      select: { name: 'High' }
    },
    'Due Date': {
      date: {
        start: '2024-02-14'
      }
    },
    Assignee: {
      people: [
        { id: 'user_id' }
      ]
    },
    Estimate: {
      number: 4
    }
  }
});
```

### Updating Task Progress

```typescript
await notionService.updatePage('page_id', {
  properties: {
    Status: {
      select: { name: 'In Progress' }
    },
    Progress: {
      number: 50
    }
  }
});
```

### Listing Overdue Tasks

```typescript
const today = new Date().toISOString().split('T')[0];

const overdueTasks = await notionService.queryDatabase('database_id', {
  filter: {
    and: [
      {
        property: 'Due Date',
        date: {
          before: today
        }
      },
      {
        property: 'Status',
        select: {
          does_not_equal: 'Completed'
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Due Date',
      direction: 'ascending'
    }
  ]
});
```

## Knowledge Base

> 💡 For details about supported block types, see the [API documentation](api.md#blocks)

### Creating an Article

```typescript
const article = await notionService.createPage({
  parent: { database_id: 'your_database_id' },
  properties: {
    Title: {
      title: [
        {
          text: { content: 'Best Practices Guide' }
        }
      ]
    },
    Category: {
      select: { name: 'Development' }
    },
    Tags: {
      multi_select: [
        { name: 'TypeScript' },
        { name: 'Best Practices' }
      ]
    },
    Author: {
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
        rich_text: [{ text: { content: 'Introduction' } }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: 'This guide presents the best practices...' } }]
      }
    }
  ]
});
```

### Searching the Knowledge Base

```typescript
const articles = await notionService.queryDatabase('database_id', {
  filter: {
    or: [
      {
        property: 'Tags',
        multi_select: {
          contains: 'TypeScript'
        }
      },
      {
        property: 'Title',
        text: {
          contains: 'Guide'
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Last Updated',
      direction: 'descending'
    }
  ]
});
```

### Updating an Article

```typescript
// First, add new blocks to the article
await notionService.updateBlock('block_id', {
  paragraph: {
    rich_text: [
      {
        text: {
          content: 'New section added to the guide...'
        }
      }
    ]
  }
});

// Then, update the properties
await notionService.updatePage('page_id', {
  properties: {
    'Last Updated': {
      date: {
        start: new Date().toISOString()
      }
    },
    Version: {
      number: 2
    }
  }
});
