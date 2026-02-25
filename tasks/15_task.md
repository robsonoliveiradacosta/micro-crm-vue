# Tarefa 15 — Criar SettingsView (exclusão de conta)

## Fase
4 — Polimento

## Depende de
- Tarefa 05 (auth store — deleteAccount)
- Tarefa 09 (App.vue com layout)

## Descrição
Criar a página de configurações com a funcionalidade de exclusão de conta do usuário.

## Passos
1. Criar `src/views/SettingsView.vue`
2. Título "Configurações"
3. Seção "Conta":
   - Card com título "Zona de Perigo" (estilização destrutiva — borda vermelha ou texto warning)
   - Texto explicativo: "Ao excluir sua conta, todos os dados (clientes, projetos e notas) serão permanentemente removidos."
   - Botão "Excluir minha conta" (variante destructive do `Button`)
4. `AlertDialog` de confirmação:
   - Título: "Excluir conta permanentemente?"
   - Descrição: "Esta ação é irreversível. Todos os seus dados serão removidos."
   - Botão confirmar (destructive): "Sim, excluir minha conta"
   - Botão cancelar: "Cancelar"
5. Ao confirmar: chama `authStore.deleteAccount()`, que deleta a conta e executa logout

## Arquivo criado
- `src/views/SettingsView.vue`

## Critérios de aceite
- Botão de exclusão abre dialog de confirmação
- Confirmação chama API `DELETE /v1/auth/account`
- Após exclusão, usuário é deslogado e redirecionado ao login
- Erros tratados com toast
- Visual indica claramente que é uma ação destrutiva
