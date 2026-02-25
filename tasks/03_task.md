# Tarefa 03 — Criar tipos TypeScript

## Fase
1 — Fundação

## Depende de
Nenhuma

## Descrição
Criar o arquivo de tipos TypeScript com todas as interfaces e types que modelam os dados da API. Baseado nos schemas do `api-docs.json`.

## Passos
1. Criar `src/types/index.ts`
2. Definir as interfaces:
   - **Auth:** `RegisterRequest`, `LoginRequest`, `TokenResponse`
   - **Client:** `Client`, `ClientRequest`
   - **Project:** `ProjectStatus` (union type), `Project`, `ProjectRequest`, `ProjectStatusUpdateRequest`
   - **Note:** `Note`, `NoteRequest`
   - **Dashboard:** `Dashboard`
   - **Errors:** `ApiError`, `FieldError`, `ApiValidationError`

## Arquivo criado
- `src/types/index.ts`

## Referência
Copiar definições da seção 3 da techspec. Os tipos devem corresponder exatamente aos schemas da OpenAPI spec.

## Critérios de aceite
- `npm run type-check` passa sem erros
- Todos os campos obrigatórios/opcionais refletem a spec da API
- `ProjectStatus` é um union type literal (não string genérico)
