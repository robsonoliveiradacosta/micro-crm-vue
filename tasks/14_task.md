# Tarefa 14 — Criar notes store + ProjectDetailView + componentes de notas

## Fase
3 — Notas e Detalhe

## Depende de
- Tarefa 04 (instância Axios)
- Tarefa 13 (projects store)

## Pré-requisito: componentes shadcn-vue
```bash
npx shadcn-vue@latest add textarea
```

## Descrição
Criar o store de notas e a view de detalhe do projeto, que exibe informações completas do projeto e permite gerenciar notas.

## Passos

### Notes Store
1. Criar `src/stores/notes.ts`
2. Setup store com:
   - **State:** `notes: ref<Note[]>([])`, `loading`, `error`
   - **Actions:**
     - `fetchNotes(projectId: string)` — `GET /v1/projects/{projectId}/notes`
     - `createNote(projectId: string, data: NoteRequest)` — `POST /v1/projects/{projectId}/notes`
     - `deleteNote(id: string)` — `DELETE /v1/notes/{id}`

### NoteForm.vue
1. Criar `src/components/notes/NoteForm.vue`
2. `Textarea` + botão "Enviar"
3. Props: `projectId: string`
4. Validação: conteúdo não pode ser vazio
5. Ao enviar: chama `notesStore.createNote()`, limpa campo, toast de sucesso

### NoteList.vue
1. Criar `src/components/notes/NoteList.vue`
2. Lista cronológica de notas
3. Cada nota exibe: conteúdo, data formatada (`formatDate`), botão excluir
4. Estado vazio: "Nenhuma nota registrada"

### NoteDeleteDialog.vue
1. Criar `src/components/notes/NoteDeleteDialog.vue`
2. `AlertDialog` simples de confirmação

### ProjectDetailView.vue
1. Criar `src/views/ProjectDetailView.vue`
2. Obtém `id` de `route.params.id`
3. Busca projeto do `projectsStore` (fetch se necessário)
4. Seção de informações do projeto:
   - Título, Descrição, Cliente (nome), Valor (BRL), Status (badge), Datas
   - Botões: Editar (abre `ProjectFormDialog`), Excluir (abre `ProjectDeleteDialog`)
   - `ProjectStatusActions` para transição de status
5. Seção de notas:
   - `NoteForm` no topo
   - `NoteList` abaixo
   - `onMounted` → `notesStore.fetchNotes(id)`
6. Botão "Voltar" para `/projects`

## Arquivos criados
- `src/stores/notes.ts`
- `src/components/notes/NoteForm.vue`
- `src/components/notes/NoteList.vue`
- `src/components/notes/NoteDeleteDialog.vue`
- `src/views/ProjectDetailView.vue`

## Critérios de aceite
- Detalhe do projeto exibe todas as informações formatadas
- Transição de status funcional no detalhe
- Editar/excluir projeto funcional no detalhe
- Criar nota → aparece na lista imediatamente
- Excluir nota com confirmação → removida da lista
- Estado vazio para notas
- Navegação de volta para lista de projetos
