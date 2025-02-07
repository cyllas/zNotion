# Guia de Versionamento

> [← Voltar para o README](../README.md) | [Ver Documentação da API →](api.md) | [Ver Exemplos →](exemplos.md)

Este documento descreve as regras e práticas de versionamento adotadas no projeto zNotion.

## Índice

- [Versionamento Semântico](#versionamento-semântico)
- [Commits Convencionais](#commits-convencionais)
- [Fluxo de Release](#fluxo-de-release)
- [Changelog](#changelog)

## Versionamento Semântico

O zNotion segue estritamente o [Versionamento Semântico](https://semver.org/lang/pt-BR/):

### Formato da Versão

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades mantendo compatibilidade
- **PATCH**: Correções de bugs mantendo compatibilidade

### Exemplos

- `1.0.0` → `2.0.0`: Mudança incompatível na API
- `1.0.0` → `1.1.0`: Nova funcionalidade adicionada
- `1.0.0` → `1.0.1`: Correção de bug

## Commits Convencionais

Utilizamos o padrão de [Conventional Commits](https://www.conventionalcommits.org/pt-br/) para mensagens de commit.

### Formato do Commit

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé(s) opcional(is)]
```

### Tipos de Commit

| Tipo | Emoji | Descrição | Bump de Versão |
|------|-------|-----------|----------------|
| `feat` | ✨ | Nova funcionalidade | MINOR |
| `fix` | 🐛 | Correção de bug | PATCH |
| `docs` | 📚 | Documentação | - |
| `style` | 💎 | Formatação, ponto-e-vírgula, etc. | - |
| `refactor` | ♻️ | Refatoração de código | - |
| `perf` | ⚡️ | Melhorias de performance | PATCH |
| `test` | ✅ | Adição/modificação de testes | - |
| `build` | 📦 | Sistema de build ou dependências | PATCH |
| `ci` | 👷 | Configuração de CI | - |
| `chore` | 🔧 | Outras mudanças | - |

### Exemplos de Commits

```bash
# Nova funcionalidade
feat(pages): adiciona suporte a paginação na listagem

# Correção de bug
fix(auth): corrige validação do token de acesso

# Documentação
docs: atualiza exemplos de uso da API

# Refatoração
refactor(database): simplifica lógica de consulta
```

## Fluxo de Release

### 1. Desenvolvimento

```bash
# Criar commits padronizados
npm run commit
# Ou
git cz
```

### 2. Criação de Release

```bash
# Gerar nova versão
npm run release
```

Este comando irá:
1. Analisar os commits desde a última versão
2. Determinar o próximo número de versão
3. Gerar/atualizar o CHANGELOG.md
4. Criar tag git
5. Fazer commit das alterações

### 3. Publicação

```bash
# Publicar no npm
npm publish
```

## Changelog

O arquivo [CHANGELOG.md](../CHANGELOG.md) é gerado e mantido automaticamente usando o `standard-version`.

### Seções do Changelog

- ✨ Novas Funcionalidades
- 🐛 Correções de Bugs
- 📚 Documentação
- 💎 Estilos
- ♻️ Refatoração
- ⚡️ Performance
- ✅ Testes
- 📦 Build
- 👷 CI
- 🔧 Chore

## Scripts Disponíveis

```bash
# Fazer commit seguindo convenções
npm run commit

# Criar nova versão
npm run release

# Publicar no npm
npm publish
```

## Ferramentas

- **Commitizen**: Interface para criar commits padronizados
- **Commitlint**: Validação de mensagens de commit
- **Standard Version**: Geração automática de versões e changelog
- **Husky**: Hooks do git para validação
