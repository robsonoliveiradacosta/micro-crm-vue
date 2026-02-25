# Tarefa 06 — Criar views de Login e Registro

## Fase
1 — Fundação

## Depende de
- Tarefa 01 (shadcn-vue / Tailwind)
- Tarefa 05 (auth store)

## Descrição
Criar as páginas de Login e Registro com layout centralizado, formulários validados e integração com o auth store.

## Passos

### LoginView.vue
1. Criar `src/views/LoginView.vue`
2. Layout centralizado: card no centro da tela (min-h-screen, flex, items-center, justify-center)
3. Formulário com campos:
   - Email (`Input` + `Label`, required, type="email")
   - Senha (`Input` + `Label`, required, type="password")
4. Botão "Entrar" (`Button`) — chama `authStore.login()`, mostra loading
5. Link "Não tem conta? Cadastre-se" → `/register`
6. Exibir `authStore.error` como mensagem de erro inline
7. Ao sucesso, redirecionar a `/` (dashboard)

### RegisterView.vue
1. Criar `src/views/RegisterView.vue`
2. Mesmo layout centralizado
3. Formulário com campos:
   - Nome (`Input` + `Label`, required)
   - Email (`Input` + `Label`, required, type="email")
   - Senha (`Input` + `Label`, required, type="password", minlength=6)
4. Botão "Cadastrar" — chama `authStore.register()`, mostra loading
5. Link "Já tem conta? Entrar" → `/login`
6. Validação inline: senha mínimo 6 caracteres
7. Ao sucesso, exibir toast de sucesso e redirecionar a `/login`
8. Tratar erro 409 (email já cadastrado)

## Arquivos criados
- `src/views/LoginView.vue`
- `src/views/RegisterView.vue`

## Critérios de aceite
- Formulários funcionais com validação client-side
- Integração com auth store (login armazena token, register redireciona)
- Erros da API exibidos ao usuário
- Loading state no botão durante requisição
- Layout responsivo e centralizado
- Links de navegação entre login e registro
