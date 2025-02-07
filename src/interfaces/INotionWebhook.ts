export interface INotionWebhookPayload {
  id: string;
  created_time: string;
  workspace_id: string;
  bot_id: string;
  parent_id: string;
  parent_type: 'page_mention' | 'database_mention' | 'page_comment' | 'database_comment';
  event_type: 'created' | 'updated' | 'deleted';
  data: {
    [key: string]: any;
  };
}

export interface IWebhookConfig {
  url: string;
  events: Array<'page' | 'database' | 'comment' | 'discussion'>;
  secret?: string;
}

export interface IWebhookResponse {
  id: string;
  url: string;
  active: boolean;
  events: string[];
  created_time: string;
  last_success_time?: string;
  last_failure_time?: string;
  last_failure_reason?: string;
}

export interface IWebhookService {
  createWebhook(config: IWebhookConfig): Promise<IWebhookResponse>;
  listWebhooks(): Promise<IWebhookResponse[]>;
  deleteWebhook(webhookId: string): Promise<void>;
  updateWebhook(webhookId: string, config: Partial<IWebhookConfig>): Promise<IWebhookResponse>;
  validateWebhookSignature(signature: string, body: string, secret: string): boolean;
}
