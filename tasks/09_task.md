# Tarefa 09 — Atualizar App.vue (layout condicional + Toaster)

## Fase
1 — Fundação

## Depende de
- Tarefa 08 (layout criado)

## Descrição
Atualizar o componente raiz `App.vue` para renderizar o layout autenticado condicionalmente e configurar o sistema de toasts global.

## Passos
1. Reescrever `src/App.vue`:
   - Importar `AppLayout` e `authStore`
   - Renderizar `<AppLayout>` com `<RouterView />` dentro quando autenticado
   - Renderizar `<RouterView />` diretamente quando não autenticado (login/registro)
2. Adicionar componente `<Toaster />` do Sonner (shadcn-vue) no template para toasts globais
3. Chamar `authStore.initialize()` no setup (para recuperar token do localStorage no boot)
4. Atualizar `src/main.ts` se necessário (import do CSS)
5. Remover `src/__tests__/App.spec.ts` (teste do stub original)

## Arquivos modificados
- `src/App.vue`
- `src/main.ts` (se necessário)

## Arquivos removidos
- `src/__tests__/App.spec.ts`

## Critérios de aceite
- Páginas públicas (login/registro) renderizam sem sidebar
- Páginas protegidas renderizam com AppLayout (sidebar + header)
- Toaster global renderizado e funcional (`toast()` exibe notificações)
- Token recuperado do localStorage no boot da aplicação
- `npm run dev` funciona com fluxo completo: login → dashboard com layout
