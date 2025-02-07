# Guia de Contribuição

Obrigado por investir seu tempo em contribuir para o projeto! Qualquer contribuição que você fizer será refletida no [zNotion](https://github.com/cyllas/znotion) 🎉

Leia nosso [Código de Conduta](./CODE_OF_CONDUCT.md) para manter nossa comunidade acessível e respeitosa.

## Guia para Novos Contribuidores

Para começar, dê uma olhada nas [issues abertas](https://github.com/cyllas/znotion/issues) marcadas com `good first issue`. Estas são issues que consideramos boas para contribuidores iniciantes.

### Issues

#### Criar uma Nova Issue

Se você encontrar um problema ou tiver uma sugestão para o zNotion, verifique se já existe uma issue relacionada. Se não existir, você pode abrir uma nova issue usando um dos templates disponíveis:

* [🐛 Reportar Bug](https://github.com/cyllas/znotion/issues/new?template=bug_report.md)
* [💡 Sugestão de Feature](https://github.com/cyllas/znotion/issues/new?template=feature_request.md)

### Pull Requests

#### Criar um Pull Request

1. Faça fork do repositório
2. Crie um branch para suas alterações:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Faça suas alterações e commit:
   ```bash
   git commit -m 'feat: Adiciona alguma AmazingFeature'
   ```
   Note: Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-br) para mensagens de commit.

4. Faça push para o branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Abra um Pull Request

### Guia de Desenvolvimento

1. Clone o projeto
   ```bash
   git clone https://github.com/seu-usuario/znotion.git
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Execute os testes
   ```bash
   npm test
   ```

4. Execute o lint
   ```bash
   npm run lint
   ```

### Padrões de Código

* Use TypeScript
* Siga o estilo de código do projeto (configurado no ESLint e Prettier)
* Mantenha a documentação atualizada
* Adicione testes para novas funcionalidades
* Use tipos explícitos (evite `any`)
* Siga os princípios SOLID

### Processo de Review

* O mantenedor do projeto irá revisar seu PR
* Feedback será dado através dos comentários do GitHub
* Após aprovação, seu PR será mesclado

### Documentação

* Mantenha os comentários do código atualizados
* Atualize o README.md se necessário
* Adicione exemplos para novas funcionalidades
* Documente breaking changes

## Recursos Úteis

* [TypeScript Documentation](https://www.typescriptlang.org/docs/)
* [Notion API Reference](https://developers.notion.com/reference)
* [Jest Documentation](https://jestjs.io/docs/getting-started)
* [Conventional Commits](https://www.conventionalcommits.org/pt-br)
