# Tech Spec — Micro CRM Frontend

Documento técnico de implementação baseado no [PRD](./prd.md) e na especificação OpenAPI (`api-docs.json`).

---

## 1. Estado Atual do Projeto

O projeto foi inicializado com `create-vue` e já possui:

- Vue 3 + TypeScript + Vite configurados
- Pinia e Vue Router instalados (sem rotas reais — apenas rota stub)
- Vitest + Playwright configurados
- ESLint + oxlint + Prettier configurados
- `src/main.ts` bootstrapping Pinia + Router

**Ainda não implementado:** Tailwind CSS, shadcn-vue, Axios, layout, stores de domínio, tipos, views, componentes.

---

## 2. Dependências a Instalar

### Runtime

| Pacote | Propósito |
|---|---|
| `axios` | HTTP client com interceptors |
| `@vueuse/core` | Composables utilitários (useStorage, useMediaQuery, etc.) |

### Tailwind CSS 4 + shadcn-vue

Seguir setup oficial do shadcn-vue para Vite + Tailwind v4:

```bash
npx shadcn-vue@latest init
```

Isso instala e configura automaticamente: `tailwindcss`, `@tailwindcss/vite`, `tailwind-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-vue-next`, `reka-ui`.

**Componentes shadcn-vue a adicionar (sob demanda via CLI):**

```
button input label card dialog alert-dialog table badge select
dropdown-menu separator toast sonner skeleton sheet sidebar
navigation-menu avatar textarea tooltip
```

---

## 3. Definição de Tipos TypeScript

### `src/types/index.ts`

```typescript
// === Auth ===

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  token: string
  type: string // always "Bearer"
}

// === Client ===

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  createdAt: string
}

export interface ClientRequest {
  name: string
  email?: string
  phone?: string
  company?: string
}

// === Project ===

export type ProjectStatus = 'ORCAMENTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO'

export interface Project {
  id: string
  clientId: string
  title: string
  description?: string
  value: number
  status: ProjectStatus
  startDate?: string
  endDate?: string
  createdAt: string
}

export interface ProjectRequest {
  clientId: string
  title: string
  description?: string
  value: number
  startDate?: string
  endDate?: string
}

export interface ProjectStatusUpdateRequest {
  status: ProjectStatus
}

// === Note ===

export interface Note {
  id: string
  projectId: string
  content: string
  createdAt: string
}

export interface NoteRequest {
  content: string
}

// === Dashboard ===

export interface Dashboard {
  totalClients: number
  totalByStatus: Record<ProjectStatus, number>
}

// === API Errors ===

export interface ApiError {
  status: number
  error: string
  message: string
  timestamp: string
}

export interface FieldError {
  field: string
  message: string
}

export interface ApiValidationError extends ApiError {
  fieldErrors: FieldError[]
}
```

---

## 4. Camada HTTP — Axios

### `src/api/index.ts`

```typescript
import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — injeta JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — trata 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default api
```

**Decisão:** armazenar token em `localStorage` (simples, persiste refresh). O interceptor garante limpeza automática em 401.

---

## 5. Stores Pinia (Setup Style)

Todos os stores usam Composition API (`defineStore` com setup function).

### 5.1 `src/stores/auth.ts`

| State | Tipo |
|---|---|
| `token` | `string \| null` |
| `isAuthenticated` | computed: `!!token` |
| `loading` | `boolean` |
| `error` | `string \| null` |

| Action | Endpoint | Comportamento |
|---|---|---|
| `login(credentials)` | `POST /v1/auth/login` | Armazena token em state + localStorage |
| `register(data)` | `POST /v1/auth/register` | Registra e redireciona ao login |
| `logout()` | — | Remove token, redireciona a `/login` |
| `deleteAccount()` | `DELETE /v1/auth/account` | Remove conta, executa `logout()` |
| `initialize()` | — | Lê token do localStorage no boot (chamado em `main.ts` ou `App.vue`) |

### 5.2 `src/stores/dashboard.ts`

| State | Tipo |
|---|---|
| `data` | `Dashboard \| null` |
| `loading` | `boolean` |
| `error` | `string \| null` |

| Action | Endpoint |
|---|---|
| `fetchDashboard()` | `GET /v1/dashboard` |

### 5.3 `src/stores/clients.ts`

| State | Tipo |
|---|---|
| `clients` | `Client[]` |
| `loading` | `boolean` |
| `error` | `string \| null` |

| Action | Endpoint |
|---|---|
| `fetchClients()` | `GET /v1/clients` |
| `createClient(data)` | `POST /v1/clients` |
| `updateClient(id, data)` | `PUT /v1/clients/{id}` |
| `deleteClient(id)` | `DELETE /v1/clients/{id}` |

### 5.4 `src/stores/projects.ts`

| State | Tipo |
|---|---|
| `projects` | `Project[]` |
| `loading` | `boolean` |
| `error` | `string \| null` |

| Getter | Descrição |
|---|---|
| `filteredProjects` | Filtra por `clientId` e/ou `status` (filtros locais no state) |

| Action | Endpoint |
|---|---|
| `fetchProjects(filters?)` | `GET /v1/projects?clientId=&status=` |
| `createProject(data)` | `POST /v1/projects` |
| `updateProject(id, data)` | `PUT /v1/projects/{id}` |
| `updateStatus(id, status)` | `PATCH /v1/projects/{id}/status` |
| `deleteProject(id)` | `DELETE /v1/projects/{id}` |

### 5.5 `src/stores/notes.ts`

| State | Tipo |
|---|---|
| `notes` | `Note[]` |
| `loading` | `boolean` |
| `error` | `string \| null` |

| Action | Endpoint |
|---|---|
| `fetchNotes(projectId)` | `GET /v1/projects/{projectId}/notes` |
| `createNote(projectId, data)` | `POST /v1/projects/{projectId}/notes` |
| `deleteNote(id)` | `DELETE /v1/notes/{id}` |

---

## 6. Roteamento

### `src/router/index.ts`

```typescript
const routes = [
  // Públicas (layout centralizado)
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
  { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { public: true } },

  // Protegidas (AppLayout com sidebar)
  { path: '/', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
  { path: '/clients', name: 'clients', component: () => import('@/views/ClientsView.vue') },
  { path: '/projects', name: 'projects', component: () => import('@/views/ProjectsView.vue') },
  { path: '/projects/:id', name: 'project-detail', component: () => import('@/views/ProjectDetailView.vue') },
  { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
]
```

**Navigation guard global:**

```typescript
router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (!to.meta.public && !isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.public && isAuthenticated) {
    return { name: 'dashboard' }
  }
})
```

---

## 7. Layout e Componentes

### 7.1 Estrutura de Layout

**`App.vue`** — ponto de decisão de layout:

```vue
<template>
  <AppLayout v-if="isAuthenticated">
    <RouterView />
  </AppLayout>
  <RouterView v-else />
</template>
```

**`src/components/layout/AppLayout.vue`:**
- Sidebar à esquerda (desktop), drawer (mobile)
- Header com nome do usuário + botão logout
- Slot para conteúdo principal

**`src/components/layout/AppSidebar.vue`:**
- Links: Dashboard, Clientes, Projetos, Configurações
- Ícones via `lucide-vue-next`
- Colapsável em tablet, drawer em mobile via `Sheet` do shadcn-vue
- Usar o componente `Sidebar` do shadcn-vue como base

### 7.2 Componentes por Domínio

#### Dashboard (`src/components/dashboard/`)

| Componente | Descrição |
|---|---|
| `DashboardStats.vue` | Grid de 5 cards (total clientes + 4 status). Usa `Card` do shadcn-vue. Valores em BRL. |

#### Clientes (`src/components/clients/`)

| Componente | Descrição |
|---|---|
| `ClientTable.vue` | Tabela responsiva com colunas: nome, email, telefone, empresa, ações. Usa `Table` do shadcn-vue. |
| `ClientFormDialog.vue` | `Dialog` com formulário de criação/edição. Campos: nome (required), email, telefone, empresa. |
| `ClientDeleteDialog.vue` | `AlertDialog` com aviso de cascade (remove projetos e notas). |

#### Projetos (`src/components/projects/`)

| Componente | Descrição |
|---|---|
| `ProjectTable.vue` | Tabela com título, cliente (nome), valor (BRL), status (badge), datas, ações. Filtros por cliente (Select) e status (Select) no topo. |
| `ProjectFormDialog.vue` | `Dialog` com formulário. Campos: cliente (Select), título (required), descrição, valor (required, min 0), data início, data fim. |
| `ProjectDeleteDialog.vue` | `AlertDialog` com aviso de cascade (remove notas). |
| `ProjectStatusBadge.vue` | `Badge` colorido por status. Cores: ORCAMENTO=amarelo, EM_ANDAMENTO=azul, CONCLUIDO=verde, CANCELADO=vermelho. |
| `ProjectStatusActions.vue` | Botões/dropdown para transições válidas de status. Respeita o fluxo: ORCAMENTO→{EM_ANDAMENTO,CANCELADO}, EM_ANDAMENTO→{CONCLUIDO,CANCELADO}. Status finais não exibem ações. |

#### Notas (`src/components/notes/`)

| Componente | Descrição |
|---|---|
| `NoteList.vue` | Lista cronológica de notas. Cada nota mostra conteúdo, data formatada, botão excluir. |
| `NoteForm.vue` | `Textarea` + botão "Enviar". Cria nota via store. |
| `NoteDeleteDialog.vue` | `AlertDialog` de confirmação simples. |

### 7.3 Componentes UI Compartilhados

Os componentes base vêm do shadcn-vue (gerados via CLI em `src/components/ui/`). Não criar wrappers adicionais a menos que necessário.

---

## 8. Views (Páginas)

### `LoginView.vue`
- Layout centralizado (card no centro da tela)
- Formulário: email + senha
- Link para registro
- Validação inline (campo obrigatório)
- Exibe erro da API (401 = credenciais inválidas)

### `RegisterView.vue`
- Layout centralizado
- Formulário: nome + email + senha (min 6 chars)
- Link para login
- Validação inline
- Exibe erro da API (409 = email já cadastrado)

### `DashboardView.vue`
- Chama `dashboardStore.fetchDashboard()` no `onMounted`
- Renderiza `DashboardStats`
- Skeleton loader enquanto carrega
- Estado vazio se não houver dados

### `ClientsView.vue`
- Header com título "Clientes" + botão "Novo Cliente"
- `ClientTable` com dados do `clientsStore`
- `ClientFormDialog` (criar/editar — controlado por state local)
- `ClientDeleteDialog`
- Estado vazio com CTA

### `ProjectsView.vue`
- Header com título "Projetos" + botão "Novo Projeto"
- Filtros: Select de cliente + Select de status
- `ProjectTable` com dados do `projectsStore`
- `ProjectFormDialog` (criar/editar)
- `ProjectDeleteDialog`
- Estado vazio com CTA

### `ProjectDetailView.vue`
- Busca projeto por `route.params.id` (filtra do store ou faz fetch individual)
- Exibe: título, descrição, cliente, valor (BRL), status (badge), datas
- `ProjectStatusActions` para transição de status
- Seção de notas com `NoteForm` + `NoteList`
- Botões editar/excluir projeto

### `SettingsView.vue`
- Seção "Conta" com botão "Excluir minha conta"
- `AlertDialog` com confirmação ("Esta ação é irreversível. Todos os dados serão removidos.")
- Chama `authStore.deleteAccount()`

---

## 9. Utilitários

### `src/lib/utils.ts`

```typescript
// cn helper (já vem com shadcn-vue init)
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação monetária BRL
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// Formatação de data brasileiro
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr))
}

// Map de transições válidas de status
export const STATUS_TRANSITIONS: Record<string, string[]> = {
  ORCAMENTO: ['EM_ANDAMENTO', 'CANCELADO'],
  EM_ANDAMENTO: ['CONCLUIDO', 'CANCELADO'],
  CONCLUIDO: [],
  CANCELADO: [],
}

// Labels legíveis para status
export const STATUS_LABELS: Record<string, string> = {
  ORCAMENTO: 'Orçamento',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}
```

---

## 10. Tratamento de Erros

### Estratégia

| Cenário | Tratamento |
|---|---|
| 401 Unauthorized | Interceptor Axios limpa token e redireciona a `/login` |
| 400 Validation | Extrai `fieldErrors` e exibe inline no formulário |
| 403 Forbidden | Toast de erro "Acesso negado" |
| 404 Not Found | Toast de erro "Recurso não encontrado" |
| 409 Conflict | Toast de erro "Email já cadastrado" (registro) |
| 422 Unprocessable | Toast de erro com mensagem da API (transição de status inválida) |
| Network error | Toast de erro "Erro de conexão com o servidor" |

### Toast

Usar `Sonner` do shadcn-vue (wrapper do sonner-vue). Importar `Toaster` no `App.vue` e usar `toast()` nos stores/componentes.

---

## 11. Responsividade

| Breakpoint | Layout |
|---|---|
| `< 768px` (mobile) | Sidebar oculta, abre como Sheet (drawer) via botão hamburger no header. Tabelas adaptam para layout card/stacked. |
| `768px–1023px` (tablet) | Sidebar colapsada (apenas ícones, expandível ao hover/click). |
| `>= 1024px` (desktop) | Sidebar fixa expandida + conteúdo principal. |

Usar `useMediaQuery` do `@vueuse/core` ou classes Tailwind responsivas para controlar visibilidade.

---

## 12. Estrutura Final de Arquivos

```
src/
├── api/
│   └── index.ts                    # Instância Axios + interceptors
├── assets/
│   └── main.css                    # Imports Tailwind + variáveis CSS shadcn
├── components/
│   ├── ui/                         # Componentes shadcn-vue (gerados via CLI)
│   ├── layout/
│   │   ├── AppLayout.vue           # Layout autenticado (sidebar + content)
│   │   ├── AppSidebar.vue          # Sidebar de navegação
│   │   └── AppHeader.vue           # Header com menu mobile + user actions
│   ├── dashboard/
│   │   └── DashboardStats.vue
│   ├── clients/
│   │   ├── ClientTable.vue
│   │   ├── ClientFormDialog.vue
│   │   └── ClientDeleteDialog.vue
│   ├── projects/
│   │   ├── ProjectTable.vue
│   │   ├── ProjectFormDialog.vue
│   │   ├── ProjectDeleteDialog.vue
│   │   ├── ProjectStatusBadge.vue
│   │   └── ProjectStatusActions.vue
│   └── notes/
│       ├── NoteList.vue
│       ├── NoteForm.vue
│       └── NoteDeleteDialog.vue
├── lib/
│   └── utils.ts                    # cn, formatCurrency, formatDate, STATUS_*
├── router/
│   └── index.ts                    # Rotas + navigation guards
├── stores/
│   ├── auth.ts
│   ├── dashboard.ts
│   ├── clients.ts
│   ├── projects.ts
│   └── notes.ts
├── types/
│   └── index.ts                    # Interfaces TS (Client, Project, Note, etc.)
├── views/
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── DashboardView.vue
│   ├── ClientsView.vue
│   ├── ProjectsView.vue
│   ├── ProjectDetailView.vue
│   └── SettingsView.vue
├── App.vue
└── main.ts
```

---

## 13. Plano de Implementação (Ordem de Tarefas)

### Fase 1 — Fundação

| # | Tarefa | Depende de | Arquivos |
|---|---|---|---|
| 1 | Instalar Tailwind CSS 4 + shadcn-vue (init) | — | `package.json`, configs, `src/assets/main.css`, `src/lib/utils.ts`, `src/components/ui/` |
| 2 | Instalar Axios e @vueuse/core | — | `package.json` |
| 3 | Criar types TypeScript | — | `src/types/index.ts` |
| 4 | Criar instância Axios com interceptors | 2 | `src/api/index.ts` |
| 5 | Criar auth store | 3, 4 | `src/stores/auth.ts` |
| 6 | Criar views de Login e Registro | 1, 5 | `src/views/LoginView.vue`, `src/views/RegisterView.vue` |
| 7 | Configurar rotas + navigation guards | 5, 6 | `src/router/index.ts` |
| 8 | Criar layout (AppLayout, AppSidebar, AppHeader) | 1, 7 | `src/components/layout/*` |
| 9 | Atualizar App.vue (layout condicional + Toaster) | 8 | `src/App.vue` |

### Fase 2 — CRUD Principal

| # | Tarefa | Depende de | Arquivos |
|---|---|---|---|
| 10 | Criar dashboard store + DashboardView | 4, 9 | `src/stores/dashboard.ts`, `src/views/DashboardView.vue`, `src/components/dashboard/DashboardStats.vue` |
| 11 | Criar clients store | 4 | `src/stores/clients.ts` |
| 12 | Criar ClientsView + componentes | 9, 11 | `src/views/ClientsView.vue`, `src/components/clients/*` |
| 13 | Criar projects store | 4 | `src/stores/projects.ts` |
| 14 | Criar ProjectsView + componentes | 9, 11, 13 | `src/views/ProjectsView.vue`, `src/components/projects/*` |
| 15 | Criar utilitários (formatCurrency, formatDate, STATUS_*) | — | `src/lib/utils.ts` (adicionar funções) |

### Fase 3 — Notas e Detalhe

| # | Tarefa | Depende de | Arquivos |
|---|---|---|---|
| 16 | Criar notes store | 4 | `src/stores/notes.ts` |
| 17 | Criar ProjectDetailView + componentes de notas | 13, 16 | `src/views/ProjectDetailView.vue`, `src/components/notes/*` |

### Fase 4 — Polimento

| # | Tarefa | Depende de | Arquivos |
|---|---|---|---|
| 18 | Criar SettingsView (exclusão de conta) | 5, 9 | `src/views/SettingsView.vue` |
| 19 | Adicionar estados vazios e skeletons | 10–17 | Views e componentes existentes |
| 20 | Ajustar responsividade mobile (sidebar drawer) | 8 | `src/components/layout/*` |
| 21 | Remover store stub `counter.ts` e test `App.spec.ts` | — | `src/stores/counter.ts`, `src/__tests__/App.spec.ts` |

---

## 14. Decisões Técnicas Relevantes

| Decisão | Justificativa |
|---|---|
| Token em `localStorage` | Persiste entre refreshes. Interceptor Axios garante injeção e limpeza. Aceitável para app de uso pessoal/freelancer. |
| Filtros de projeto via query params da API | A API suporta `?clientId=&status=`. Usar isso ao invés de filtro puramente client-side para manter dados sincronizados com o servidor. |
| Stores sem cache complexo | Fetch fresh data em cada navegação de página (`onMounted`). Simplicidade sobre otimização prematura. |
| Lazy loading de views | Todas as views usam `() => import(...)` para code splitting automático. |
| shadcn-vue Sidebar component | Usar componente `Sidebar` do shadcn-vue que já implementa colapsável + mobile sheet, evitando implementação manual. |
| Sonner para toasts | shadcn-vue oferece integração com Sonner — mais moderno e configurável que o toast nativo. |
