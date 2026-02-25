# Tarefa 13 — Criar projects store + ProjectsView + componentes

## Fase
2 — CRUD Principal

## Depende de
- Tarefa 04 (instância Axios)
- Tarefa 09 (App.vue com layout)
- Tarefa 10 (utilitários — STATUS_LABELS, STATUS_TRANSITIONS, formatCurrency)
- Tarefa 12 (clients store — necessário para select de cliente nos filtros e formulário)

## Pré-requisito: componentes shadcn-vue
```bash
npx shadcn-vue@latest add badge select
```

## Descrição
Implementar o CRUD completo de projetos com filtros, transição de status e componentes auxiliares (badge de status, ações de status).

## Passos

### Projects Store
1. Criar `src/stores/projects.ts`
2. Setup store com:
   - **State:** `projects: ref<Project[]>([])`, `loading`, `error`, `filterClientId: ref<string | null>`, `filterStatus: ref<ProjectStatus | null>`
   - **Actions:**
     - `fetchProjects(filters?)` — `GET /v1/projects` com query params `?clientId=&status=`
     - `createProject(data: ProjectRequest)` — `POST /v1/projects`
     - `updateProject(id, data: ProjectRequest)` — `PUT /v1/projects/{id}`
     - `updateStatus(id, status: ProjectStatus)` — `PATCH /v1/projects/{id}/status`
     - `deleteProject(id)` — `DELETE /v1/projects/{id}`

### ProjectStatusBadge.vue
1. Criar `src/components/projects/ProjectStatusBadge.vue`
2. Props: `status: ProjectStatus`
3. Renderiza `Badge` com cor e label conforme status:
   - ORCAMENTO → amarelo, "Orçamento"
   - EM_ANDAMENTO → azul, "Em Andamento"
   - CONCLUIDO → verde, "Concluído"
   - CANCELADO → vermelho, "Cancelado"

### ProjectStatusActions.vue
1. Criar `src/components/projects/ProjectStatusActions.vue`
2. Props: `project: Project`
3. Renderiza botões/dropdown apenas para transições válidas (usa `STATUS_TRANSITIONS`)
4. Status finais (CONCLUIDO, CANCELADO) não exibem ações
5. Emite `statusChange(projectId, newStatus)`

### ProjectTable.vue
1. Criar `src/components/projects/ProjectTable.vue`
2. Tabela com colunas: Título, Cliente (nome), Valor (BRL), Status (badge), Data Início, Ações
3. Ações: Editar, Alterar Status (submenu), Excluir
4. Estado vazio

### ProjectFormDialog.vue
1. Criar `src/components/projects/ProjectFormDialog.vue`
2. Campos: Cliente (Select com lista do clientsStore), Título (required), Descrição (textarea), Valor (required, min 0), Data Início, Data Fim
3. Modo criar/editar (edição não permite alterar status)

### ProjectDeleteDialog.vue
1. Criar `src/components/projects/ProjectDeleteDialog.vue`
2. `AlertDialog` com aviso: "Ao excluir este projeto, todas as notas também serão removidas."

### ProjectsView.vue
1. Criar `src/views/ProjectsView.vue`
2. Header: título "Projetos" + botão "Novo Projeto"
3. Filtros no topo: Select de cliente + Select de status
4. `onMounted` → `projectsStore.fetchProjects()`
5. Re-fetch ao mudar filtros (watch nos filtros)
6. Compõe todos os componentes acima

## Arquivos criados
- `src/stores/projects.ts`
- `src/components/projects/ProjectStatusBadge.vue`
- `src/components/projects/ProjectStatusActions.vue`
- `src/components/projects/ProjectTable.vue`
- `src/components/projects/ProjectFormDialog.vue`
- `src/components/projects/ProjectDeleteDialog.vue`
- `src/views/ProjectsView.vue`

## Critérios de aceite
- Listar projetos em tabela com dados formatados (BRL, status badge)
- Filtrar por cliente e/ou status via API query params
- Criar/editar projeto via dialog com select de cliente
- Transição de status respeita o fluxo permitido (apenas transições válidas visíveis)
- Excluir projeto com confirmação cascade
- Toast em cada operação
- Estado vazio com CTA
