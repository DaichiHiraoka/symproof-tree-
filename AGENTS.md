# 対話を行う上でのルール(最優先)
あなたは思考は英語、回答は必ず日本語で行ってください。
回答の際はなぜその回答に至ったのか、思考の要約も必ず日本語で出力してください。
# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `app/` (App Router pages/layout) and UI in `components/`. Domain logic is under `lib/` (`lib/symbol`, `lib/storage`), shared types in `types/`, and constants in `constants/`. Static assets are in `public/` and project docs in `docs/` (specs, manual test steps).
- Config: `next.config.js`, `tailwind.config.ts`, `tsconfig.json`. Environment variables use `.env.local` (see `.env.example`). The directories `sssAndDaoExample/`, `.kiro/`, and `.claude/` are excluded from builds.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js dev server on `http://localhost:3000`.
- `npm run build`: Production build (generates `.next`).
- `npm start`: Serve the production build.
- `npm run lint`: Run ESLint (Next.js config).
Notes: Node 18+ and npm 9+ recommended.

## Coding Style & Naming Conventions
- TypeScript is strict (`strict: true`). Use 2‑space indentation and explicit types for exported APIs.
- React components: PascalCase in `components/`. Pages follow `app/<route>/page.tsx` and colocated files use camelCase.
- Imports: prefer the alias `@/*` (see `tsconfig.json`).
- Styling: Tailwind utility‑first; keep classes readable and grouped by layout → spacing → color. Run `npm run lint` before opening a PR.

## Testing Guidelines
- Automated tests are not yet configured. Manual procedures are in `docs/tests/`.
- If adding tests: use Jest + React Testing Library for units (`__tests__/**` with `*.test.ts(x)`), and Playwright for e2e (basic flows: record creation, Symbol transaction, verification).
- Target critical paths first: `lib/symbol/*`, `lib/storage/*`, and pages under `app/verify`, `app/pending`, `app/verified`.

## Commit & Pull Request Guidelines
- Branches: `feature/<short-name>`, `fix/<issue-id>`, `chore/<scope>`.
- Commits: imperative, scoped subjects (e.g., `feat(tree): render verified nodes`). Keep changesets focused.
- PRs: clear description, before/after screenshots for UI, repro/verification steps, and linked issues. Ensure `npm run lint` and `npm run build` pass locally.

## Security & Configuration Tips
- Do not commit `.env.local`. Only expose safe values via `NEXT_PUBLIC_*`.
- Symbol Testnet settings must match `README.md` values. Avoid Node‑only APIs on the client; WebAssembly and browser crypto are enabled via `next.config.js`.
