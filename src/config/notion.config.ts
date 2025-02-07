import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY não encontrada nas variáveis de ambiente');
}

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: process.env.NOTION_VERSION || '2022-06-28',
});

export const config = {
  apiVersion: process.env.NOTION_VERSION || '2022-06-28',
  auth: process.env.NOTION_API_KEY,
};
