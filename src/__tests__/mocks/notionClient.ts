import { Client } from '@notionhq/client';

export const mockNotionClient = {
  pages: {
    create: jest.fn().mockImplementation(() => Promise.resolve()),
    update: jest.fn().mockImplementation(() => Promise.resolve()),
    retrieve: jest.fn().mockImplementation(() => Promise.resolve()),
  },
  databases: {
    create: jest.fn().mockImplementation(() => Promise.resolve()),
    update: jest.fn().mockImplementation(() => Promise.resolve()),
    query: jest.fn().mockImplementation(() => Promise.resolve({ results: [] })),
    retrieve: jest.fn().mockImplementation(() => Promise.resolve()),
  },
  blocks: {
    children: {
      list: jest.fn().mockImplementation(() => Promise.resolve({ results: [] })),
      append: jest.fn().mockImplementation(() => Promise.resolve()),
    },
    update: jest.fn().mockImplementation(() => Promise.resolve()),
    retrieve: jest.fn().mockImplementation(() => Promise.resolve()),
  },
  comments: {
    create: jest.fn().mockImplementation(() => Promise.resolve()),
    list: jest.fn().mockImplementation(() => Promise.resolve({ results: [] })),
  },
  search: jest.fn().mockImplementation(() => Promise.resolve({ results: [] })),
  request: jest.fn().mockImplementation(() => Promise.resolve()),
} as jest.Mocked<Client>;
