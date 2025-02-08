# Validadores do Notion

Este diretório contém os validadores utilizados para garantir a integridade dos dados enviados para a API do Notion.

## Estrutura

- `BaseValidator`: Classe base com validações comuns
- `BlockValidator`: Validações específicas para blocos
- `DatabaseValidator`: Validações para banco de dados e suas propriedades
- `CommentValidator`: Validações para comentários
- `WebhookValidator`: Validações para webhooks

## Exemplos de Uso

### Validando um Bloco

```typescript
import { BlockValidator } from './validators';

// Criando um bloco de parágrafo
const block = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  type: 'paragraph',
  paragraph: {
    rich_text: [{
      type: 'text',
      text: {
        content: 'Exemplo de parágrafo',
        link: null
      }
    }],
    color: 'default'
  }
};

// Validando o bloco
try {
  BlockValidator.validateBlock(block);
  console.log('Bloco válido!');
} catch (error) {
  console.error('Erro na validação:', error.message);
}
```

### Validando uma Propriedade de Banco de Dados

```typescript
import { DatabaseValidator } from './validators';

// Criando uma propriedade de seleção
const property = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Status',
  type: 'select',
  select: {
    options: [
      { id: '1', name: 'Pendente', color: 'red' },
      { id: '2', name: 'Em Andamento', color: 'yellow' },
      { id: '3', name: 'Concluído', color: 'green' }
    ]
  }
};

// Validando a propriedade
try {
  DatabaseValidator.validateDatabaseProperty(property);
  console.log('Propriedade válida!');
} catch (error) {
  console.error('Erro na validação:', error.message);
}
```

### Validando um Comentário

```typescript
import { CommentValidator } from './validators';

// Criando um comentário
const comment = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  parent: {
    type: 'page_id',
    id: '123e4567-e89b-12d3-a456-426614174000'
  },
  richText: [{
    type: 'text',
    text: {
      content: 'Exemplo de comentário',
      link: null
    }
  }]
};

// Validando o comentário
try {
  CommentValidator.validateComment(comment);
  console.log('Comentário válido!');
} catch (error) {
  console.error('Erro na validação:', error.message);
}
```

### Validando um Webhook

```typescript
import { WebhookValidator } from './validators';

// Criando um webhook
const webhook = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  active: true,
  url: 'https://exemplo.com/webhook',
  events: ['page_created', 'page_updated']
};

// Validando o webhook
try {
  WebhookValidator.validateWebhook(webhook);
  console.log('Webhook válido!');
} catch (error) {
  console.error('Erro na validação:', error.message);
}
```

## Boas Práticas

1. **Sempre valide os dados antes de enviá-los para a API**
   - Evita erros desnecessários
   - Melhora a experiência do usuário
   - Reduz o consumo de recursos

2. **Use os validadores específicos**
   - Cada validador foi projetado para um tipo específico de dado
   - Contém validações personalizadas para cada caso

3. **Trate os erros adequadamente**
   - Os validadores lançam erros descritivos
   - Use try/catch para capturar e tratar os erros
   - Forneça feedback útil para o usuário

4. **Mantenha os dados consistentes**
   - Siga os tipos definidos
   - Não ignore os erros de validação
   - Atualize os validadores quando necessário

## Contribuindo

1. Crie testes para novas validações
2. Mantenha a documentação atualizada
3. Siga o padrão de código existente
4. Reporte bugs e sugira melhorias
