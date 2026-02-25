# Tarefa 05 — Criar auth store

## Fase
1 — Fundação

## Depende de
- Tarefa 03 (tipos TypeScript)
- Tarefa 04 (instância Axios)

## Descrição
Criar o Pinia store de autenticação usando setup store style. Gerencia token JWT, login, registro, logout e exclusão de conta.

## Passos
1. Criar `src/stores/auth.ts`
2. Implementar com `defineStore('auth', () => { ... })`:
   - **State:** `token: ref<string | null>`, `loading: ref(false)`, `error: ref<string | null>(null)`
   - **Computed:** `isAuthenticated: computed(() => !!token.value)`
   - **Actions:**
     - `initialize()` — lê token do localStorage e seta no state
     - `login(credentials: LoginRequest)` — `POST /v1/auth/login`, armazena token no state + localStorage
     - `register(data: RegisterRequest)` — `POST /v1/auth/register`, retorna sucesso (não armazena token)
     - `logout()` — limpa token do state + localStorage, redireciona a `/login`
     - `deleteAccount()` — `DELETE /v1/auth/account`, depois chama `logout()`
3. Tratar erros de API (setar `error` com mensagem legível)
4. Remover o store stub `src/stores/counter.ts`

## Arquivos criados/modificados
- `src/stores/auth.ts` (criar)
- `src/stores/counter.ts` (remover)

## Critérios de aceite
- Store funcional com login/register/logout/deleteAccount
- Token persistido em localStorage e sincronizado com state
- `isAuthenticated` reativo
- Erros da API capturados e expostos via `error`
- `npm run type-check` passa
