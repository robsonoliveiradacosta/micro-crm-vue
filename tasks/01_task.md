# Tarefa 01 — Setup Tailwind CSS 4 + shadcn-vue

## Fase
1 — Fundação

## Depende de
Nenhuma

## Descrição
Instalar e configurar Tailwind CSS 4 e shadcn-vue no projeto. Isso inclui rodar o init do shadcn-vue (que configura Tailwind, variáveis CSS, `cn` helper, etc.) e adicionar os componentes UI necessários via CLI.

## Passos
1. Rodar `npx shadcn-vue@latest init` e seguir o setup para Vite + Tailwind v4
2. Verificar que `@tailwindcss/vite` foi adicionado como plugin no `vite.config.ts`
3. Verificar que `src/assets/main.css` importa Tailwind e as variáveis CSS do tema shadcn
4. Verificar que `src/lib/utils.ts` foi criado com o helper `cn`
5. Importar o CSS em `src/main.ts`
6. Adicionar componentes shadcn-vue necessários para a Fase 1:
   ```bash
   npx shadcn-vue@latest add button input label card dialog alert-dialog sonner
   ```
7. Confirmar que `npm run build` passa sem erros

## Arquivos criados/modificados
- `package.json` (novas deps)
- `vite.config.ts` (plugin Tailwind)
- `src/assets/main.css` (ou `index.css`)
- `src/lib/utils.ts` (`cn` helper)
- `src/main.ts` (import CSS)
- `src/components/ui/` (componentes gerados)
- `components.json` (config shadcn-vue)
- `tsconfig.app.json` (paths se necessário)

## Critérios de aceite
- `npm run dev` inicia sem erros
- Classes Tailwind funcionam nos templates
- Componentes shadcn-vue importáveis e renderizáveis
- `npm run build` compila sem erros
