# zNotion

[🇧🇷 Português](https://github.com/seu-usuario/znotion/blob/main/README.pt-br.md) | [🇺🇸 English](https://github.com/seu-usuario/znotion/blob/main/README.md)

[![Versão npm](https://badge.fury.io/js/znotion.svg)](https://badge.fury.io/js/znotion)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Cobertura de Testes](https://img.shields.io/codecov/c/github/seu-usuario/znotion)](https://codecov.io/gh/seu-usuario/znotion)
[![Status da Build](https://github.com/seu-usuario/znotion/workflows/CI/badge.svg)](https://github.com/seu-usuario/znotion/actions)
[![Licença: MIT](https://img.shields.io/badge/Licença-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Bem-vindos](https://img.shields.io/badge/PRs-bem--vindos-brightgreen.svg)](http://makeapullrequest.com)
[![Compatível com Commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Versionamento Semântico](https://img.shields.io/badge/semver-2.0.0-brightgreen)](https://semver.org/)
[![Estilo de Código: Prettier](https://img.shields.io/badge/estilo_código-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Status das Dependências](https://status.david-dm.org/gh/seu-usuario/znotion.svg)](https://david-dm.org/seu-usuario/znotion)

Uma biblioteca TypeScript moderna e tipada para interagir com a API do Notion, oferecendo uma interface simples e robusta para manipular páginas, bancos de dados e blocos.

## 📚 Documentação

- [Documentação Técnica da API](https://github.com/seu-usuario/znotion/blob/main/docs/pt-br/api.md) - Documentação detalhada da API, interfaces e tipos
- [Documentação da API REST](https://github.com/seu-usuario/znotion/blob/main/docs/pt-br/rest-api.md) - Endpoints RESTful, autenticação e formatos de resposta
- [Exemplos Práticos](https://github.com/seu-usuario/znotion/blob/main/docs/pt-br/exemplos.md) - Exemplos completos de uso em diferentes cenários
- [Guia de Versionamento](https://github.com/seu-usuario/znotion/blob/main/docs/pt-br/versionamento.md) - Regras e práticas de versionamento semântico

## 🚀 Recursos

- Totalmente tipado com TypeScript
- Suporte completo à API do Notion v2023-08-01
- Validação de parâmetros com Joi
- Tratamento de erros robusto
- Documentação completa em português e inglês
- Testes automatizados
- Exemplos práticos de uso

## 🔧 Instalação

```bash
npm install znotion
```

## 🎯 Uso Rápido

```typescript
import { NotionService } from 'znotion';

const notion = new NotionService();

// Listar páginas
const paginas = await notion.listPages();

// Criar página
const novaPagina = await notion.createPage({
  parent: { database_id: 'seu_database_id' },
  properties: {
    Nome: {
      title: [
        {
          text: { content: 'Minha Nova Página' }
        }
      ]
    }
  }
});
```

## 🤝 Contribuindo

Adoramos receber contribuições! Para manter a qualidade do código e facilitar a manutenção, siga estas diretrizes:

### 📋 Pré-requisitos

1. Node.js >=14.0.0
2. npm ou yarn
3. Git

### 🛠️ Preparação

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

### 💻 Desenvolvimento

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

### 📝 Convenções

- **Commits**: Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
- **Branches**: 
  - `feat/*`: Novas funcionalidades
  - `fix/*`: Correções de bugs
  - `docs/*`: Documentação
  - `refactor/*`: Refatoração
  - `test/*`: Testes
  - `chore/*`: Manutenção

Para mais detalhes, consulte nosso [Guia de Versionamento](https://github.com/seu-usuario/znotion/blob/main/docs/pt-br/versionamento.md).

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](https://github.com/seu-usuario/znotion/blob/main/LICENSE) para detalhes.

## 🙏 Agradecimentos

- [Notion](https://developers.notion.com/) pela excelente API
- Todos os contribuidores que ajudam a melhorar este projeto
