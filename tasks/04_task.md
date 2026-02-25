# Tarefa 04 — Criar instância Axios com interceptors

## Fase
1 — Fundação

## Depende de
- Tarefa 02 (Axios instalado)

## Descrição
Criar a camada de API centralizada com instância Axios configurada com baseURL, request interceptor (injeta JWT) e response interceptor (trata 401).

## Passos
1. Criar `src/api/index.ts`
2. Configurar instância Axios:
   - `baseURL: 'http://localhost:8080'`
   - `headers: { 'Content-Type': 'application/json' }`
3. Request interceptor: ler token do `localStorage` e injetar `Authorization: Bearer <token>`
4. Response interceptor: em caso de 401, remover token do localStorage e redirecionar a `/login` via router
5. Exportar a instância como default

## Arquivo criado
- `src/api/index.ts`

## Critérios de aceite
- Instância exportada com baseURL correta
- Request interceptor injeta header Authorization quando token existe
- Response interceptor limpa token e redireciona em 401
- Erros não-401 são propagados via `Promise.reject`
- `npm run type-check` passa
