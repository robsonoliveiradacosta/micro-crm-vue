# Tarefa 07 — Configurar rotas e navigation guards

## Fase
1 — Fundação

## Depende de
- Tarefa 05 (auth store)
- Tarefa 06 (views de login/registro)

## Descrição
Reescrever o router com todas as rotas da aplicação, lazy loading de views, e navigation guard global para proteção de rotas.

## Passos
1. Reescrever `src/router/index.ts`
2. Definir rotas com lazy loading:
   - `/login` — `LoginView`, `meta: { public: true }`
   - `/register` — `RegisterView`, `meta: { public: true }`
   - `/` — `DashboardView` (protegida)
   - `/clients` — `ClientsView` (protegida)
   - `/projects` — `ProjectsView` (protegida)
   - `/projects/:id` — `ProjectDetailView` (protegida)
   - `/settings` — `SettingsView` (protegida)
3. Implementar `router.beforeEach`:
   - Se rota protegida e não autenticado → redireciona a `/login`
   - Se rota pública e autenticado → redireciona a `/` (dashboard)
4. Autenticação verificada via `localStorage.getItem('token')`

## Arquivo modificado
- `src/router/index.ts`

## Notas
- As views protegidas (Dashboard, Clients, etc.) ainda não existem — criar stubs mínimos se necessário ou usar placeholder components
- O guard deve funcionar mesmo antes das views estarem implementadas

## Critérios de aceite
- Todas as 7 rotas definidas com lazy loading
- Navigation guard redireciona corretamente:
  - Não autenticado tentando acessar `/` → `/login`
  - Autenticado tentando acessar `/login` → `/`
- `npm run type-check` passa
