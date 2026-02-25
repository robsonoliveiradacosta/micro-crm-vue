# PRD — Micro CRM

## 1. Visão Geral

**Micro CRM** é uma aplicação web responsiva voltada a **freelancers** para gerenciamento de clientes, projetos e notas. O frontend consome uma API REST (documentada em `api-docs.json`) e oferece uma interface moderna, limpa e funcional.

### Stack

| Camada | Tecnologia |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Linguagem | TypeScript (strict) |
| Build | Vite |
| Estilização | Tailwind CSS 4 |
| Componentes UI | shadcn-vue |
| Roteamento | Vue Router 4 (history mode) |
| Estado global | Pinia (setup stores) |
| HTTP Client | Axios (interceptors para JWT) |

### API Backend

Base URL: `http://localhost:8080`

Autenticação via JWT Bearer Token. Multi-tenant — cada usuário acessa apenas seus dados.

---

## 2. Personas e Objetivo

**Persona principal:** freelancer que precisa organizar clientes, acompanhar projetos (do orçamento à conclusão) e registrar notas de acompanhamento.

**Objetivo:** fornecer um painel prático e responsivo onde o freelancer visualiza seus indicadores financeiros, gerencia clientes e projetos, e mantém histórico de comunicações via notas.

---

## 3. Funcionalidades

### 3.1 Autenticação

| Feature | Descrição |
|---|---|
| Registro | Formulário com nome, e-mail e senha (min 6 chars). `POST /v1/auth/register` |
| Login | Formulário com e-mail e senha. `POST /v1/auth/login` → armazena JWT |
| Logout | Remove token do storage e redireciona ao login |
| Exclusão de conta | Confirmação em modal + `DELETE /v1/auth/account`. Remove todos os dados |
| Guard de rotas | Rotas protegidas redirecionam para `/login` se não autenticado |
| Interceptor Axios | Injeta `Authorization: Bearer <token>` em toda requisição; redireciona ao login em caso de 401 |

### 3.2 Dashboard (`/`)

Tela inicial após login. Exibe resumo financeiro e operacional via `GET /v1/dashboard`.

**Dados exibidos:**
- Total de clientes cadastrados
- Cards por status de projeto com soma dos valores:
  - Orçamento (`ORCAMENTO`)
  - Em andamento (`EM_ANDAMENTO`)
  - Concluído (`CONCLUIDO`)
  - Cancelado (`CANCELADO`)

**UI:** 4 cards (ou KPIs) + 1 indicador de total de clientes. Valores monetários formatados em BRL (`R$ 1.500,00`).

### 3.3 Clientes (`/clients`)

| Ação | Endpoint | UI |
|---|---|---|
| Listar | `GET /v1/clients` | Tabela/lista responsiva com nome, e-mail, telefone, empresa |
| Criar | `POST /v1/clients` | Modal/drawer com formulário (nome obrigatório; e-mail, telefone, empresa opcionais) |
| Editar | `PUT /v1/clients/{id}` | Mesmo formulário, preenchido com dados atuais |
| Excluir | `DELETE /v1/clients/{id}` | Confirmação em modal (aviso de cascade: remove projetos e notas) |

### 3.4 Projetos (`/projects`)

| Ação | Endpoint | UI |
|---|---|---|
| Listar | `GET /v1/projects` | Tabela/lista com título, cliente, valor, status, datas. Filtros por cliente e status |
| Criar | `POST /v1/projects` | Modal/drawer com: cliente (select), título, descrição, valor (min 0), data início, data fim |
| Editar | `PUT /v1/projects/{id}` | Mesmo formulário (não altera status) |
| Alterar status | `PATCH /v1/projects/{id}/status` | Botões/dropdown contextual respeitando fluxo de transição |
| Excluir | `DELETE /v1/projects/{id}` | Confirmação em modal (aviso de cascade: remove notas) |

**Fluxo de status:**
```
ORCAMENTO → EM_ANDAMENTO → CONCLUIDO
    ↓              ↓
 CANCELADO     CANCELADO
```

**Regras de UI:** exibir apenas transições válidas. Status finais (`CONCLUIDO`, `CANCELADO`) não oferecem botão de transição.

### 3.5 Notas (`/projects/:projectId/notes`)

Acessíveis dentro do contexto de um projeto (detalhe do projeto ou seção expandida).

| Ação | Endpoint | UI |
|---|---|---|
| Listar | `GET /v1/projects/{projectId}/notes` | Lista cronológica de notas dentro do projeto |
| Criar | `POST /v1/projects/{projectId}/notes` | Campo de texto + botão enviar |
| Excluir | `DELETE /v1/notes/{id}` | Botão excluir com confirmação |

---

## 4. Estrutura de Páginas e Rotas

| Rota | Componente | Auth | Descrição |
|---|---|---|---|
| `/login` | LoginView | Não | Tela de login |
| `/register` | RegisterView | Não | Tela de cadastro |
| `/` | DashboardView | Sim | Dashboard com KPIs |
| `/clients` | ClientsView | Sim | CRUD de clientes |
| `/projects` | ProjectsView | Sim | CRUD de projetos com filtros |
| `/projects/:id` | ProjectDetailView | Sim | Detalhe do projeto + notas |
| `/settings` | SettingsView | Sim | Configurações (exclusão de conta) |

**Layout:** páginas autenticadas usam layout com sidebar/navbar + área de conteúdo. Páginas públicas (login, registro) usam layout centralizado.

---

## 5. Arquitetura Frontend

```
src/
├── api/              # Instância Axios + interceptors
│   └── index.ts
├── assets/           # Ícones, imagens, estilos globais
├── components/
│   ├── ui/           # Componentes shadcn-vue
│   ├── layout/       # AppSidebar, AppHeader, AppLayout
│   ├── clients/      # ClientForm, ClientCard, ClientTable
│   ├── projects/     # ProjectForm, ProjectCard, ProjectStatusBadge
│   ├── notes/        # NoteList, NoteForm
│   └── dashboard/    # DashboardCard, DashboardStats
├── composables/      # Hooks reutilizáveis (useAuth, useConfirmDialog, etc.)
├── lib/              # Utilitários (formatCurrency, formatDate, cn helper)
├── router/
│   └── index.ts      # Definição de rotas + navigation guards
├── stores/
│   ├── auth.ts       # Pinia store: token, user, login/logout/register
│   ├── clients.ts    # Pinia store: CRUD clientes
│   ├── projects.ts   # Pinia store: CRUD projetos + status
│   ├── notes.ts      # Pinia store: CRUD notas
│   └── dashboard.ts  # Pinia store: dados do dashboard
├── types/            # Interfaces TypeScript (Client, Project, Note, Dashboard, API errors)
├── views/            # Componentes de página (1:1 com rotas)
├── App.vue
└── main.ts
```

### Stores (Pinia — setup style)

Cada store encapsula:
- **State:** dados da entidade + loading + error
- **Actions:** chamadas à API via Axios, atualização reativa do estado
- **Getters:** dados derivados (ex.: projetos filtrados por status)

### API Layer

- Instância Axios com `baseURL: http://localhost:8080`
- Request interceptor: injeta token do `authStore`
- Response interceptor: em caso de 401, limpa token e redireciona ao login

---

## 6. Modelos de Dados (TypeScript)

```typescript
interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  createdAt: string
}

interface Project {
  id: string
  clientId: string
  title: string
  description?: string
  value: number
  status: 'ORCAMENTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  startDate?: string
  endDate?: string
  createdAt: string
}

interface Note {
  id: string
  projectId: string
  content: string
  createdAt: string
}

interface Dashboard {
  totalClients: number
  totalByStatus: Record<Project['status'], number>
}
```

---

## 7. UI / UX

### Design System
- **shadcn-vue** como base de componentes (Button, Input, Dialog, Table, Card, Badge, Select, DropdownMenu, Separator, Toast)
- **Tailwind CSS 4** para utilidades e responsividade
- Tema claro por padrão, com possibilidade de dark mode via `class` strategy

### Layout Responsivo
- **Desktop (lg+):** sidebar fixa à esquerda + conteúdo principal
- **Tablet (md):** sidebar colapsável (ícones)
- **Mobile (sm):** hamburger menu com sidebar drawer

### Feedback ao Usuário
- **Loading:** skeleton loaders ou spinner nos cards/tabelas
- **Sucesso:** toast notifications (via shadcn-vue Toast/Sonner)
- **Erro:** toast de erro + mensagens inline em formulários (validação campo a campo)
- **Confirmação de exclusão:** modal com aviso de cascade quando aplicável
- **Estados vazios:** mensagem amigável + CTA para criar o primeiro recurso

### Formatação
- Valores monetários: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Datas: formato brasileiro `dd/mm/aaaa`

---

## 8. Requisitos Não-Funcionais

| Requisito | Meta |
|---|---|
| Responsividade | Mobile-first, funcional de 320px a 1920px+ |
| Performance | First Contentful Paint < 1.5s (build produção) |
| Acessibilidade | Componentes shadcn-vue já oferecem ARIA; manter labels e contraste WCAG AA |
| Segurança | JWT armazenado em memória (Pinia) ou localStorage com cuidado; sem dados sensíveis expostos no client |
| Tratamento de erros | Todos os endpoints tratados com feedback visual; 401 redireciona ao login; 403/404/422 com mensagens claras |

---

## 9. Fases de Implementação

### Fase 1 — Fundação
1. Setup do projeto (Vite + Vue 3 + TS + Tailwind 4 + shadcn-vue)
2. Configuração de rotas (Vue Router) e layout base (sidebar + content area)
3. Camada de API (Axios instance + interceptors)
4. Types TypeScript
5. Auth store + telas de Login/Registro
6. Navigation guards

### Fase 2 — CRUD Principal
7. Dashboard store + DashboardView com cards KPI
8. Clients store + ClientsView (listar, criar, editar, excluir)
9. Projects store + ProjectsView (listar, criar, editar, excluir, filtros)
10. Transição de status de projetos

### Fase 3 — Notas e Detalhe
11. ProjectDetailView com informações do projeto
12. Notes store + listagem/criação/exclusão de notas dentro do detalhe

### Fase 4 — Polimento
13. SettingsView (exclusão de conta)
14. Estados vazios, skeletons, toasts
15. Responsividade mobile (sidebar drawer)
16. Revisão de acessibilidade e ajustes finais
