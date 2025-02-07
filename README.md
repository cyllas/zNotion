# zNotion

[🇧🇷 Português](README.pt-br.md) | [🇺🇸 English](README.md)

A modern and typed TypeScript library for interacting with the Notion API, providing a simple and robust interface for manipulating pages, databases, and blocks.

## 📚 Documentation

- [API Technical Documentation](docs/en-us/api.md) - Detailed API documentation, interfaces, and types
- [REST API Documentation](docs/en-us/rest-api.md) - RESTful endpoints, authentication, and response formats
- [Practical Examples](docs/en-us/examples.md) - Complete usage examples in different scenarios
- [Versioning Guide](docs/en-us/versioning.md) - Semantic versioning rules and practices

## 🚀 Features

- Fully typed with TypeScript
- Complete support for Notion API v2023-08-01
- Parameter validation with Joi
- Robust error handling
- Complete documentation in English and Portuguese
- Automated tests
- Practical usage examples

## Pré-requisitos

- Node.js >= 14.x
- npm >= 6.x
- Uma chave de API do Notion

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/znotion.git
cd znotion
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave de API do Notion:
```env
NOTION_API_KEY=seu_token_secreto_aqui
NOTION_VERSION=2023-08-01
```

## Uso

### Inicialização

```typescript
import { NotionService } from 'znotion';

const notionService = new NotionService();
```

### Operações com Páginas

```typescript
// Listar páginas
const pages = await notionService.listPages({
  page_size: 10,
  filter: {
    property: 'title',
    text: { contains: 'Projeto' }
  }
});

// Criar uma página
const newPage = await notionService.createPage({
  parent: { database_id: 'seu_database_id' },
  properties: {
    Name: {
      title: [{ text: { content: 'Nova Página' } }]
    }
  }
});

// Atualizar uma página
const updatedPage = await notionService.updatePage('pagina_id', {
  properties: {
    Status: {
      select: { name: 'Concluído' }
    }
  }
});
```

### Operações com Bancos de Dados

```typescript
// Listar bancos de dados
const databases = await notionService.listDatabases();

// Consultar um banco de dados
const results = await notionService.queryDatabase('database_id', {
  filter: {
    property: 'Status',
    select: { equals: 'Em Progresso' }
  },
  sorts: [
    {
      property: 'Data',
      direction: 'ascending'
    }
  ]
});

// Atualizar um banco de dados
const updatedDb = await notionService.updateDatabase('database_id', {
  title: [{ text: { content: 'Novo Nome' } }]
});
```

### Operações com Blocos

```typescript
// Listar blocos
const blocks = await notionService.listBlocks();

// Obter bloco específico
const block = await notionService.getBlock('block_id');

// Atualizar bloco
const updatedBlock = await notionService.updateBlock('block_id', {
  paragraph: {
    rich_text: [{ text: { content: 'Novo conteúdo' } }]
  }
});
```

## Testes

O projeto utiliza Jest para testes. Para executar os testes:

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm test -- --coverage

# Executar testes em modo watch
npm test -- --watch
```

## Documentação da API

### NotionService

#### Construtor

```typescript
constructor(client?: Client)
```
- `client`: Cliente personalizado do Notion (opcional)

#### Métodos

##### Páginas
- `listPages(params?: ListPagesParams)`: Lista páginas
- `getPage(pageId: string)`: Obtém uma página específica
- `createPage(params: CreatePageParams)`: Cria uma nova página
- `updatePage(pageId: string, params: UpdatePageParams)`: Atualiza uma página
- `archivePage(pageId: string)`: Arquiva uma página

##### Bancos de Dados
- `listDatabases(params?: ListDatabasesParams)`: Lista bancos de dados
- `getDatabase(databaseId: string)`: Obtém um banco de dados específico
- `queryDatabase(databaseId: string, params?: QueryDatabaseParams)`: Consulta um banco de dados
- `updateDatabase(databaseId: string, params: UpdateDatabaseParams)`: Atualiza um banco de dados

##### Blocos
- `listBlocks(params?: ListBlocksParams)`: Lista blocos
- `getBlock(blockId: string)`: Obtém um bloco específico
- `updateBlock(blockId: string, params: UpdateBlockParams)`: Atualiza um bloco
- `deleteBlock(blockId: string)`: Deleta um bloco

## Contribuindo

Adoramos receber contribuições! Para manter a qualidade do código e facilitar a manutenção, siga estas diretrizes:

### Pré-requisitos

1. Node.js >=14.0.0
2. npm ou yarn
3. Git

### Preparação

1. Faça um fork do repositório
2. Clone seu fork:
   ```bash
   git clone https://github.com/seu-usuario/znotion.git
   cd znotion
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

### Desenvolvimento

1. Crie uma branch para sua feature:
   ```bash
   git checkout -b feat/nome-da-feature
   ```

2. Faça suas alterações seguindo nossas convenções:
   - Use TypeScript
   - Mantenha 100% de cobertura de testes
   - Siga o estilo de código existente
   - Documente novas funcionalidades

3. Faça commits padronizados:
   ```bash
   npm run commit
   ```

4. Execute os testes:
   ```bash
   npm test
   ```

5. Envie suas alterações:
   ```bash
   git push origin feat/nome-da-feature
   ```

6. Abra um Pull Request

### Convenções

- **Commits**: Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
- **Branches**: 
  - `feat/*`: Novas funcionalidades
  - `fix/*`: Correções de bugs
  - `docs/*`: Documentação
  - `refactor/*`: Refatoração
  - `test/*`: Testes
  - `chore/*`: Manutenção

Para mais detalhes, consulte nosso [Guia de Versionamento](docs/en-us/versioning.md).

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Se você encontrar algum problema ou tiver alguma dúvida:

1. Consulte a [documentação](docs/)
2. Abra uma [issue](https://github.com/seu-usuario/znotion/issues)
3. Entre em contato através do [email de suporte](mailto:seu-email@exemplo.com)

## Agradecimentos

- [Notion API](https://developers.notion.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Joi](https://joi.dev/)
