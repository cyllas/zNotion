import { Client } from '@notionhq/client';

export const notionClient = new Client({
  auth: 'mock-token'
});
