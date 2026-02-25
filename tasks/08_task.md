# Tarefa 08 — Criar layout (AppLayout, AppSidebar, AppHeader)

## Fase
1 — Fundação

## Depende de
- Tarefa 01 (shadcn-vue / Tailwind)
- Tarefa 07 (rotas configuradas)

## Pré-requisito: componentes shadcn-vue
Antes de iniciar, adicionar componentes necessários:
```bash
npx shadcn-vue@latest add sidebar sheet separator tooltip navigation-menu avatar
```

## Descrição
Criar os componentes de layout que envolvem todas as páginas autenticadas: sidebar de navegação, header e container de conteúdo.

## Passos

### AppSidebar.vue
1. Criar `src/components/layout/AppSidebar.vue`
2. Usar componente `Sidebar` do shadcn-vue como base
3. Links de navegação com ícones (lucide-vue-next):
   - Dashboard (`LayoutDashboard`) → `/`
   - Clientes (`Users`) → `/clients`
   - Projetos (`FolderKanban`) → `/projects`
   - Configurações (`Settings`) → `/settings`
4. Highlight no link ativo (usar `useRoute()`)
5. Logo/título "Micro CRM" no topo da sidebar

### AppHeader.vue
1. Criar `src/components/layout/AppHeader.vue`
2. Botão hamburger para toggle da sidebar (mobile)
3. Breadcrumb ou título da página atual
4. Botão de logout à direita

### AppLayout.vue
1. Criar `src/components/layout/AppLayout.vue`
2. Composição: `SidebarProvider` + `AppSidebar` + área de conteúdo com `AppHeader` + `<slot />`
3. Sidebar fixa em desktop (lg+), colapsada em tablet (md), drawer em mobile (sm)

## Arquivos criados
- `src/components/layout/AppLayout.vue`
- `src/components/layout/AppSidebar.vue`
- `src/components/layout/AppHeader.vue`

## Critérios de aceite
- Layout renderiza sidebar + header + conteúdo
- Navegação entre rotas funciona via links da sidebar
- Link ativo destacado visualmente
- Sidebar responsiva (fixa desktop, colapsável tablet, drawer mobile)
- Botão logout funcional (chama `authStore.logout()`)
