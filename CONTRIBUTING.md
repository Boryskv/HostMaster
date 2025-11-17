# Guia de Contribuição

Obrigado por considerar contribuir com o HostMaster! 

## Como Contribuir

1. **Fork o projeto**
2. **Clone seu fork**
   ```bash
   git clone https://github.com/seu-usuario/HostMaster.git
   ```

3. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

4. **Faça suas alterações e commit**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   ```

5. **Push para sua branch**
   ```bash
   git push origin feature/nova-funcionalidade
   ```

6. **Abra um Pull Request**

## Padrões de Commit

Utilizamos o padrão Conventional Commits:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações na documentação
- `style:` - Formatação, ponto e vírgula, etc
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção

## Estrutura de Código

### Frontend
- Componentes em PascalCase
- Hooks customizados com prefixo `use`
- CSS modules ou styled-components

### Backend
- Controllers, Services e Modules seguem padrão NestJS
- DTOs para validação de dados
- Entities para modelagem do banco

## Testes

Antes de enviar um PR, certifique-se de:
- [ ] Código está funcionando
- [ ] Não há erros no console
- [ ] Código segue os padrões do projeto

## Dúvidas?

Abra uma issue para discussão!
