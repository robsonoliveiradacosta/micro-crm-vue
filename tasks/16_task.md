# Tarefa 16 — Estados vazios, skeletons e feedback visual

## Fase
4 — Polimento

## Depende de
- Tarefas 11–14 (todas as views e componentes de domínio)

## Descrição
Revisar todas as views e componentes para garantir feedback visual consistente: skeleton loaders durante carregamento, estados vazios com CTAs, e toasts de sucesso/erro em todas as operações.

## Passos

### Skeleton Loaders
1. Dashboard: skeleton cards (5 retângulos pulsantes) durante `loading`
2. Clientes: skeleton rows na tabela durante `loading`
3. Projetos: skeleton rows na tabela durante `loading`
4. Detalhe do Projeto: skeleton para informações + lista de notas durante `loading`

### Estados Vazios
Cada view deve exibir mensagem amigável + CTA quando a lista está vazia:
1. **Dashboard:** se `totalClients === 0`, exibir "Cadastre seu primeiro cliente para começar"
2. **Clientes:** "Nenhum cliente cadastrado" + botão "Cadastrar cliente"
3. **Projetos:** "Nenhum projeto cadastrado" + botão "Criar projeto"
4. **Notas:** "Nenhuma nota registrada neste projeto"

### Toasts
Verificar que todas as operações CRUD exibem:
- **Sucesso:** "Cliente criado com sucesso", "Projeto atualizado", etc.
- **Erro:** mensagem da API ou fallback genérico

### Loading nos botões
- Botões de submit em formulários mostram spinner/disabled durante requisição

## Arquivos modificados
- Views e componentes de domínio existentes

## Critérios de aceite
- Nenhuma view exibe tela em branco durante carregamento
- Estados vazios têm mensagem e CTA
- Toasts aparecem após cada operação CRUD
- Botões desabilitados durante requisições
