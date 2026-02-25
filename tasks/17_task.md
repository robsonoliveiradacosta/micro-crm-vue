# Tarefa 17 — Responsividade mobile e ajustes finais

## Fase
4 — Polimento

## Depende de
- Tarefa 08 (layout)
- Tarefas 11–14 (views)

## Descrição
Garantir que toda a aplicação funcione bem em telas de 320px a 1920px+, com atenção especial à sidebar mobile e tabelas responsivas.

## Passos

### Sidebar Mobile
1. Em telas < 768px: sidebar oculta por padrão
2. Botão hamburger no `AppHeader` abre sidebar como `Sheet` (drawer overlay)
3. Ao clicar em um link, sidebar fecha automaticamente
4. Verificar que o `SidebarProvider` do shadcn-vue gerencia isso corretamente

### Tabelas Responsivas
1. Em telas pequenas, tabelas de clientes e projetos devem:
   - Esconder colunas secundárias (email, telefone, datas) ou
   - Adaptar para layout card/stacked (cada linha vira um card)
2. Testar em 320px, 375px, 768px, 1024px, 1440px

### Formulários
1. Dialogs de formulário devem ser full-screen em mobile (usar `Sheet` ao invés de `Dialog` em mobile, ou dialog com max-width responsivo)
2. Inputs com tamanho adequado para touch

### Geral
1. Verificar que não há overflow horizontal em nenhuma tela
2. Verificar que textos longos truncam com ellipsis onde necessário
3. Espaçamentos adequados em mobile (padding suficiente)

## Arquivos modificados
- `src/components/layout/AppLayout.vue`
- `src/components/layout/AppSidebar.vue`
- `src/components/layout/AppHeader.vue`
- `src/components/clients/ClientTable.vue`
- `src/components/projects/ProjectTable.vue`

## Critérios de aceite
- Sidebar funciona como drawer em mobile
- Tabelas legíveis em telas de 320px
- Nenhum overflow horizontal
- Formulários usáveis em touch
- Funcional de 320px a 1920px+
