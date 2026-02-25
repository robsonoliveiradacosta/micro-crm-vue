# Tarefa 10 — Criar utilitários (formatCurrency, formatDate, STATUS_*)

## Fase
2 — CRUD Principal

## Depende de
- Tarefa 01 (shadcn-vue init já cria `src/lib/utils.ts` com `cn`)

## Descrição
Adicionar funções utilitárias e constantes ao `src/lib/utils.ts` que serão usadas em múltiplos componentes.

## Passos
1. Adicionar ao `src/lib/utils.ts` (sem remover o `cn` existente):

   - **`formatCurrency(value: number): string`**
     - Usa `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
     - Ex: `1500` → `"R$ 1.500,00"`

   - **`formatDate(dateStr: string): string`**
     - Usa `Intl.DateTimeFormat('pt-BR')`
     - Ex: `"2024-02-01"` → `"01/02/2024"`

   - **`STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]>`**
     - `ORCAMENTO → ['EM_ANDAMENTO', 'CANCELADO']`
     - `EM_ANDAMENTO → ['CONCLUIDO', 'CANCELADO']`
     - `CONCLUIDO → []`
     - `CANCELADO → []`

   - **`STATUS_LABELS: Record<ProjectStatus, string>`**
     - `ORCAMENTO → 'Orçamento'`
     - `EM_ANDAMENTO → 'Em Andamento'`
     - `CONCLUIDO → 'Concluído'`
     - `CANCELADO → 'Cancelado'`

## Arquivo modificado
- `src/lib/utils.ts`

## Critérios de aceite
- Funções exportadas e tipadas corretamente
- `formatCurrency` formata em BRL com separadores brasileiros
- `formatDate` formata em dd/mm/aaaa
- Constantes STATUS_* tipadas com `ProjectStatus`
- `npm run type-check` passa
