# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup          # Install deps + generate Prisma client + run migrations
npm run dev            # Start dev server with Turbopack (localhost:3000)
npm run build          # Production build
npm run test           # Run all tests with Vitest
npm run lint           # ESLint
npm run db:reset       # Reset SQLite database
```

Run a single test file:
```bash
npx vitest run src/lib/__tests__/file-system.test.ts
```

## Architecture

**UIGen** is an AI-powered React component generator. Users describe components in natural language, Claude generates them, and they render in a live preview iframe.

### Core Data Flow

1. **Chat Input** → User describes a component
2. **API Route** (`/api/chat/route.ts`) → Streams response from Claude with tools
3. **Tool Calls** → Claude uses `str_replace_editor` and `file_manager` tools to create/modify files
4. **Virtual File System** → Files stored in memory, never written to disk
5. **Preview Frame** → JSX transformed client-side with Babel, rendered in iframe via import maps

### Key Abstractions

**Virtual File System** (`/src/lib/file-system.ts`):
- In-memory tree structure with `FileNode` objects
- All file operations (create, update, delete, rename) happen here
- Serializes to JSON for database persistence
- Root component must be `/App.jsx` with default export

**Contexts** (`/src/lib/contexts/`):
- `FileSystemProvider` - manages virtual FS state, handles tool calls from AI
- `ChatProvider` - wraps Vercel AI SDK's `useChat`, manages message persistence

**AI Tools** (`/src/lib/tools/`):
- `str_replace_editor` - view, create, str_replace, insert operations
- `file_manager` - rename, delete operations

**Preview System** (`/src/lib/transform/jsx-transformer.ts`):
- Transforms JSX to JS using Babel standalone
- Creates import maps with blob URLs for custom files
- Uses esm.sh CDN for npm packages (React, etc.)

### Database Schema

SQLite via Prisma. Projects store chat messages and file system data as JSON strings:
```prisma
model Project {
  messages  String   @default("[]")   // JSON chat history
  data      String   @default("{}")   // JSON serialized virtual FS
  userId    String?                   // Optional - supports anonymous users
}
```

### Authentication

- JWT tokens via `jose` library stored in httpOnly cookies
- Server actions in `/src/actions/` for auth operations
- Middleware protects `/api/projects` and `/api/filesystem` routes

## Conventions

- **Path alias**: Use `@/` for imports from `src/` (e.g., `import { cn } from "@/lib/utils"`)
- **Server actions**: All DB/auth logic via server actions in `/src/actions/`
- **Client components**: All UI components use `"use client"` directive
- **Context pattern**: Each context exports both Provider and hook (e.g., `FileSystemProvider` + `useFileSystem`)
- **Styling**: Tailwind CSS with `cn()` utility for class merging
- **Comments**: Use sparingly, only for complex code
- **Database**: Reference `prisma/schema.prisma` to understand data structure

## Environment Variables

```
ANTHROPIC_API_KEY=""   # Optional - falls back to mock provider with static responses
JWT_SECRET=""          # Optional - defaults to "development-secret-key"
```
