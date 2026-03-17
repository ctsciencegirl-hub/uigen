# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface; Claude generates code using tool-use to write to an in-memory virtual file system, which is then rendered live in an iframe.

## Commands

```bash
npm run setup          # First-time setup: install + prisma generate + migrate
npm run dev            # Start dev server (Turbopack)
npm run build          # Production build
npm run lint           # ESLint
npm test               # Run vitest unit tests (jsdom environment)
npm run db:reset       # Reset local SQLite database (destructive)
```

Run a single test file:
```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```

## Code Style

- Use comments sparingly — only on complex or non-obvious logic.

## Architecture

### Request Flow

User chat → `POST /api/chat` (`src/app/api/chat/route.ts`) → `getLanguageModel()` (`src/lib/provider.ts`) → Claude with two tools → `VirtualFileSystem` → streamed back to client → `PreviewFrame` re-renders live.

### Key Abstractions

- **`VirtualFileSystem`** (`src/lib/file-system.ts`): Entirely in-memory file tree. No disk I/O. Serialized to JSON for database persistence. The file system state is passed through `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`).

- **Language Model Provider** (`src/lib/provider.ts`): `getLanguageModel()` returns the Anthropic Claude model when `ANTHROPIC_API_KEY` is set, or `MockLanguageModel` (hardcoded demo response) otherwise. The mock enables development without an API key.

- **Claude Tools** (`src/lib/tools/`): Claude is given two tools during generation:
  - `str_replace_editor` — create/modify files in the virtual filesystem
  - `file_manager` — rename/delete files

- **PreviewFrame** (`src/components/preview/PreviewFrame.tsx`): Renders components in an iframe using Babel standalone to transpile JSX on the client side. Reacts to virtual filesystem changes.

- **System Prompt** (`src/lib/prompts/generation.tsx`): The canonical source for how Claude is instructed to generate components. Edit this to change generation behavior.

### Authentication & Persistence

- Session-based auth with JWT (`jose`) and bcrypt passwords, stored in SQLite via Prisma.
- Anonymous users are tracked via `src/lib/anon-work-tracker.ts`.
- Projects store messages and virtual filesystem state as JSON blobs in the `Project` table.
- Database schema: `prisma/schema.prisma`. After schema changes, run `npx prisma migrate dev`.

### Environment

Create a `.env` file with:
```
ANTHROPIC_API_KEY=""   # Optional — omit or leave empty to use mock responses
```
