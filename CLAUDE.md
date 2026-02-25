# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Micro CRM — a responsive web application for freelancers to manage clients, projects, and notes. Built with Vue 3 + TypeScript + Vite, targeting a REST API (spec in `api-docs.json`).

Planned stack: **Vue 3, TypeScript, Tailwind CSS 4, Vite, Vue Router, Pinia, shadcn-vue**.

## Commands

```bash
# Development
npm run dev           # Start dev server with HMR

# Build
npm run build         # Type-check + compile for production
npm run build-only    # Compile only (skip type-check)
npm run preview       # Preview production build

# Testing
npm run test:unit              # Run unit tests (Vitest, watch mode)
npx vitest run                 # Run unit tests once (CI mode)
npx vitest run src/__tests__/Foo.spec.ts   # Run a single test file
npm run test:e2e               # Run Playwright e2e tests (requires built app)
npm run test:e2e -- --project=chromium     # E2e on Chromium only
npm run test:e2e -- --debug               # E2e in debug mode

# Lint & Format
npm run lint          # Run oxlint then eslint (both with --fix)
npm run format        # Prettier format src/
npm run type-check    # vue-tsc type check only
```

> E2e tests require `npm run build` first, then `npm run test:e2e`.

## Architecture

### Entry points
- `src/main.ts` — bootstraps Vue app with Pinia and Vue Router
- `src/App.vue` — root component
- `src/router/index.ts` — Vue Router config (web history, `@/` alias resolves to `src/`)

### Key directories
- `src/stores/` — Pinia stores (composable/setup store style)
- `src/__tests__/` — Vitest unit tests (co-located style, jsdom environment)
- `e2e/` — Playwright end-to-end tests

### Path alias
`@` maps to `src/` in both Vite and TypeScript configs.

### Linting pipeline
Two linters run in sequence via `lint:*` scripts:
1. **oxlint** (fast Rust linter) — configured in `.oxlintrc.json`, runs first
2. **eslint** — configured in `eslint.config.ts`, defers to oxlint for rules it covers via `eslint-plugin-oxlint`

Prettier handles formatting separately; ESLint is configured to skip formatting rules (`eslint-config-prettier`).

## API

Backend runs at `http://localhost:8080`. Full OpenAPI 3.1 spec is in `api-docs.json`.

Authentication: JWT Bearer token obtained via `POST /v1/auth/login`. All protected endpoints require `Authorization: Bearer <token>`.

**Resources and endpoints:**
- `POST /v1/auth/register` / `POST /v1/auth/login` / `DELETE /v1/auth/account`
- `GET|POST /v1/clients` / `PUT|DELETE /v1/clients/{id}`
- `GET|POST /v1/projects` / `PUT|DELETE /v1/projects/{id}` / `PATCH /v1/projects/{id}/status`
- `GET|POST /v1/projects/{projectId}/notes` / `DELETE /v1/notes/{id}`
- `GET /v1/dashboard`

**Project status flow:** `ORCAMENTO` → `EM_ANDAMENTO` or `CANCELADO`; `EM_ANDAMENTO` → `CONCLUIDO` or `CANCELADO`. Invalid transitions return 422.

**Cascade deletes:** deleting a client removes all its projects and notes; deleting a project removes all its notes.
