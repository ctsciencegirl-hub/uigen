---
name: workspace-instructions
description: "Project-level instructions for Copilot/AI agents: developer setup, key commands, and where to find important files."
applyTo:
  - "src/**"
  - "package.json"
  - "README.md"
---

**Purpose**: Help AI agents and new contributors get productive quickly: how to set up, run, test, and where to look for prompts and conventions.

- **Setup**: create a `.env` at project root and add any keys required (e.g., `ANTHROPIC_API_KEY` if using Claude). Then run:

```bash
npm install
npm run setup
```

- **Common scripts** (see `package.json`):
  - **dev**: starts Next.js in development
  - **build**: production build
  - **start**: start the built app
  - **test**: runs `vitest`
  - **setup**: installs deps + `prisma generate` + migrations (DB dev setup)

- **Testing**: `npm test` uses `vitest` (jsdom environment). Run focused tests with `npm test -- path/to/test`.

- **Database**: Prisma schema is at `prisma/schema.prisma`. Use `npm run setup` to create and migrate the dev DB; `npm run db:reset` resets local DB.

- **Where prompts and generation logic live**:
  - Prompt templates: `src/lib/prompts/` (e.g., generation prompts)
  - Model/provider wrappers: `src/lib/provider.ts`

- **Key directories**:
  - `src/app` — Next App Router pages and layout
  - `src/components` — UI components and feature folders (`chat`, `editor`, `auth`, `preview`)
  - `src/lib` — helpers, prompts, providers, contexts
  - `prisma/` — schema and migrations

- **Agent guidance / best practices**:
  - Prefer non-destructive suggestions. If making edits, keep changes minimal and explain rationale.
  - When running tools or commands that access the filesystem, limit scope to relevant subfolders (use `--add-dir` or similar flags) and request permission before altering large areas.
  - Use the prompt templates in `src/lib/prompts/` as canonical sources when generating components or code.
  - If a task requires database changes, recommend clear migration steps using Prisma and prefer adding migrations rather than editing the schema directly without one.

- **Example prompts for agents**:
  - "Run the dev server locally and open the app" — use `npm run dev`.
  - "Run unit tests for the file-tree component" — `npm test -- src/components/editor/__tests__/file-tree.test.tsx`.
  - "Generate a new chat message component consistent with existing UI primitives" — consult `src/components/ui` and `src/components/chat`.

If you'd like, I can:
- add short, focused example prompts to `.github/copilot-instructions.md` or a separate `/.github/prompts/` file;
- create an `AGENTS.md` with custom agent definitions (skills/hooks) for common workflows.
