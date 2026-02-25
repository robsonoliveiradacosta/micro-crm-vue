# Tarefa 12 — Criar clients store + ClientsView + componentes

## Fase
2 — CRUD Principal

## Depende de
- Tarefa 04 (instância Axios)
- Tarefa 09 (App.vue com layout)
- Tarefa 10 (utilitários)

## Pré-requisito: componentes shadcn-vue
```bash
npx shadcn-vue@latest add table dropdown-menu
```

## Descrição
Implementar o CRUD completo de clientes: store Pinia, view com tabela, dialogs de criação/edição e exclusão.

## Passos

### Clients Store
1. Criar `src/stores/clients.ts`
2. Setup store com:
   - **State:** `clients: ref<Client[]>([])`, `loading`, `error`
   - **Actions:**
     - `fetchClients()` — `GET /v1/clients`
     - `createClient(data: ClientRequest)` — `POST /v1/clients`, adiciona ao array
     - `updateClient(id: string, data: ClientRequest)` — `PUT /v1/clients/{id}`, atualiza no array
     - `deleteClient(id: string)` — `DELETE /v1/clients/{id}`, remove do array

### ClientTable.vue
1. Criar `src/components/clients/ClientTable.vue`
2. Tabela (`Table` shadcn-vue) com colunas: Nome, Email, Telefone, Empresa, Ações
3. Coluna Ações: dropdown menu com "Editar" e "Excluir"
4. Emite eventos `edit(client)` e `delete(client)`
5. Estado vazio quando lista está vazia (mensagem + CTA "Cadastrar primeiro cliente")

### ClientFormDialog.vue
1. Criar `src/components/clients/ClientFormDialog.vue`
2. `Dialog` do shadcn-vue
3. Props: `open: boolean`, `client?: Client` (para edição)
4. Campos: Nome (required), Email, Telefone, Empresa
5. Validação: nome obrigatório
6. Submit: chama `createClient` ou `updateClient` conforme modo
7. Fecha dialog e exibe toast de sucesso
8. Exibe erros de validação inline (fieldErrors da API)

### ClientDeleteDialog.vue
1. Criar `src/components/clients/ClientDeleteDialog.vue`
2. `AlertDialog` com aviso: "Ao excluir este cliente, todos os seus projetos e notas também serão removidos."
3. Confirma → `deleteClient(id)`, toast de sucesso

### ClientsView.vue
1. Criar `src/views/ClientsView.vue`
2. Header: título "Clientes" + botão "Novo Cliente"
3. `onMounted` → `clientsStore.fetchClients()`
4. Compõe: `ClientTable` + `ClientFormDialog` + `ClientDeleteDialog`
5. State local controla: qual dialog está aberto, qual cliente selecionado

## Arquivos criados
- `src/stores/clients.ts`
- `src/components/clients/ClientTable.vue`
- `src/components/clients/ClientFormDialog.vue`
- `src/components/clients/ClientDeleteDialog.vue`
- `src/views/ClientsView.vue`

## Critérios de aceite
- Listar clientes em tabela responsiva
- Criar cliente via dialog → aparece na tabela sem reload
- Editar cliente → dados atualizados na tabela
- Excluir cliente com confirmação de cascade → removido da tabela
- Validação inline nos formulários
- Toast de sucesso/erro em cada operação
- Estado vazio quando não há clientes
