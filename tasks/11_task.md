# Tarefa 11 — Criar dashboard store + DashboardView

## Fase
2 — CRUD Principal

## Depende de
- Tarefa 04 (instância Axios)
- Tarefa 09 (App.vue com layout)
- Tarefa 10 (utilitários de formatação)

## Pré-requisito: componentes shadcn-vue
```bash
npx shadcn-vue@latest add skeleton
```

## Descrição
Criar o store do dashboard e a view principal que exibe KPIs financeiros e operacionais após login.

## Passos

### Dashboard Store
1. Criar `src/stores/dashboard.ts`
2. Setup store com:
   - **State:** `data: ref<Dashboard | null>(null)`, `loading`, `error`
   - **Action:** `fetchDashboard()` — `GET /v1/dashboard`, popula `data`

### DashboardStats.vue
1. Criar `src/components/dashboard/DashboardStats.vue`
2. Recebe `data: Dashboard` como prop
3. Renderiza grid de 5 cards (`Card` shadcn-vue):
   - **Total de Clientes** — `data.totalClients` (ícone: `Users`)
   - **Orçamento** — `formatCurrency(data.totalByStatus.ORCAMENTO)` (ícone: `FileText`, cor amarela)
   - **Em Andamento** — `formatCurrency(data.totalByStatus.EM_ANDAMENTO)` (ícone: `Clock`, cor azul)
   - **Concluído** — `formatCurrency(data.totalByStatus.CONCLUIDO)` (ícone: `CheckCircle`, cor verde)
   - **Cancelado** — `formatCurrency(data.totalByStatus.CANCELADO)` (ícone: `XCircle`, cor vermelha)
4. Grid responsivo: 1 col mobile, 2 cols tablet, 5 cols desktop

### DashboardView.vue
1. Criar `src/views/DashboardView.vue`
2. `onMounted` → `dashboardStore.fetchDashboard()`
3. Skeleton loader enquanto `loading`
4. Renderiza `DashboardStats` quando dados disponíveis
5. Estado vazio se não houver dados (mensagem amigável)
6. Título "Dashboard" no topo

## Arquivos criados
- `src/stores/dashboard.ts`
- `src/components/dashboard/DashboardStats.vue`
- `src/views/DashboardView.vue`

## Critérios de aceite
- Dashboard carrega dados da API ao montar
- 5 cards KPI exibidos com valores formatados em BRL
- Skeleton loader durante carregamento
- Layout responsivo nos cards
- Erros tratados com toast
