# Repository Guidelines
This repo is a Next.js 16 + React 19 app with shared agent features. Follow the practices below to keep contributions cohesive.

## Project Structure & Module Organization
src/app hosts App Router segments with server/client components side-by-side. Shared UI elements live in src/components/, while cross-cutting state resides in src/context and src/providers. Configuration, routes, and pricing tables live under src/config, with reusable helpers in src/lib and src/utils. Localization strings and request logic sit in src/i18n, with mock data in src/data. Static assets belong in public, while all other notes, docs, etc. live in docs/.

## Coding Style & Naming Conventions
TypeScript is mandatory; prefer server-first components in src/app with thin client wrappers. Keep two-space indentation, double quotes in TSX, and trailing commas as auto-formatted by ESLint. Use PascalCase for components (`ProfileMenu.tsx`), camelCase for variables/hooks (`useProfileDrawer`), and kebab-case route folders (`practice-session`). Tailwind utilities stay in component files, while compound variants live in src/components/ui. When wiring translations, add keys to locale dictionaries in src/i18n and access them via `useTranslations`.

## Testing Guidelines
Vitest with @testing-library/react is configured by vitest.config.ts and vitest.setup.ts. Co-locate tests using `*.test.ts(x)` or `__tests__` folders (see src/app/dal/vocab/__tests__). Run `npm run test:run` before PRs and block merges on coverage regressions; snapshot output belongs in `__snapshots__`. Mock Supabase, email, and AI clients with helpers in src/lib to avoid network calls.

## Commit & Pull Request Practices
Follow Conventional Commits (`feat(practice): ...`, `fix(tutor): ...`); avoid generic `checkpoint` messages outside experimental branches. Each PR should describe scope, link issues, note manual/automated test evidence, and include UI screenshots when appropriate. Ensure `npm run lint`, `npm run typecheck`, and `npm run test:run` pass locally before review, and flag any pending migrations or env updates in the summary.

## Implementation Best Practices

### 0 — Purpose  

These rules ensure maintainability, safety, and developer velocity. 
**MUST** rules are enforced by CI; **SHOULD** rules are strongly recommended.

---

### 1 — Before Coding

- **BP-1 (MUST)** Ask the user clarifying questions.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work.  
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons.

---

### 2 — While Coding

- **C-1 (MUST)** Follow TDD: scaffold stub -> write failing test -> implement.
- **C-2 (MUST)** Name functions with existing domain vocabulary for consistency.  
- **C-3 (SHOULD NOT)** Introduce classes when small testable functions suffice.  
- **C-4 (SHOULD)** Prefer simple, composable, testable functions.
- **C-5 (MUST)** Prefer branded `type`s for IDs
  ```ts
  type UserId = Brand<string, 'UserId'>   // ✅ Good
  type UserId = string                    // ❌ Bad
  ```  
- **C-6 (MUST)** Use `import type { … }` for type-only imports.
- **C-7 (SHOULD NOT)** Add comments except for critical caveats; rely on self‑explanatory code.
- **C-8 (SHOULD)** Default to `type`; use `interface` only when more readable or interface merging is required. 
- **C-9 (SHOULD NOT)** Extract a new function unless it will be reused elsewhere, is the only way to unit-test otherwise untestable logic, or drastically improves readability of an opaque block.

---

### 3 — Testing

- **T-1 (MUST)** For a simple function, colocate unit tests in `*.spec.ts` in same directory as source file.
- **T-2 (MUST)** For any API change, add/extend integration tests in `packages/api/test/*.spec.ts`.
- **T-3 (MUST)** ALWAYS separate pure-logic unit tests from DB-touching integration tests.
- **T-4 (SHOULD)** Prefer integration tests over heavy mocking.  
- **T-5 (SHOULD)** Unit-test complex algorithms thoroughly.
- **T-6 (SHOULD)** Test the entire structure in one assertion if possible
  ```ts
  expect(result).toBe([value]) // Good

  expect(result).toHaveLength(1); // Bad
  expect(result[0]).toBe(value); // Bad
  ```

---

### 4 — Database
- **D-1 (MUST)** All operations on databases need to be documented in `src/lib/supabase/[relevant-dir]`
- **D-2 (MUST)** When creating a new table in DB, always add full definition of this table (with RLS) into `src/lib/supabase/tables/[table-name].sql`
- **D-3 (MUST)** When editing existing table, always edit the corresponding table in `src/lib/supabase/tables/` and create a migration file in `src/lib/supabase/migrations/[file-name].sql` to migrate from old to new version of the table
- **D-4 (MUST)** When creating functions in the DB, add the function definition and code in `src/lib/supabase/functions/`

---

### 5 — Code Organization

- **O-1 (MUST)** Always analyse the project structure and the piece of code you want to add and find the most logical place to put it.

---

### 6 — Tooling Gates

- **G-1 (MUST)** `prettier --check` passes.
- **G-2 (MUST)** `npm run lint` passes.

---

### 7 - Git

- **GH-1 (MUST**) Use Conventional Commits format when writing commit messages: https://www.conventionalcommits.org/en/v1.0.0
- **GH-2 (SHOULD NOT**) Refer to Claude or Anthropic in commit messages.

---

## Writing Functions Best Practices

When evaluating whether a function you implemented is good or not, use this checklist:

1. Can you read the function and HONESTLY easily follow what it's doing? If yes, then stop here.
2. Does the function have very high cyclomatic complexity? (number of independent paths, or, in a lot of cases, number of nesting if if-else as a proxy). If it does, then it's probably sketchy.
3. Are there any common data structures and algorithms that would make this function much easier to follow and more robust? Parsers, trees, stacks / queues, etc.
4. Are there any unused parameters in the function?
5. Are there any unnecessary type casts that can be moved to function arguments?
6. Is the function easily testable without mocking core features (e.g. sql queries, redis, etc.)? If not, can this function be tested as part of an integration test?
7. Does it have any hidden untested dependencies or any values that can be factored out into the arguments instead? Only care about non-trivial dependencies that can actually change or affect the function.
8. Brainstorm 3 better function names and see if the current name is the best, consistent with rest of codebase.

IMPORTANT: you SHOULD NOT refactor out a separate function unless there is a compelling need, such as:
  - the refactored function is used in more than one place
  - the refactored function is easily unit testable while the original function is not AND you can't test it any other way
  - the original function is extremely hard to follow and you resort to putting comments everywhere just to explain it

## Writing Tests Best Practices

When evaluating whether a test you've implemented is good or not, use this checklist:

1. SHOULD parameterize inputs; never embed unexplained literals such as 42 or "foo" directly in the test.
2. SHOULD NOT add a test unless it can fail for a real defect. Trivial asserts (e.g., expect(2).toBe(2)) are forbidden.
3. SHOULD ensure the test description states exactly what the final expect verifies. If the wording and assert don’t align, rename or rewrite.
4. SHOULD compare results to independent, pre-computed expectations or to properties of the domain, never to the function’s output re-used as the oracle.
5. SHOULD follow the same lint, type-safety, and style rules as prod code (prettier, ESLint, strict types).
6. SHOULD express invariants or axioms (e.g., commutativity, idempotence, round-trip) rather than single hard-coded cases whenever practical. Use `fast-check` library e.g.
```
import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { getCharacterCount } from './string';

describe('properties', () => {
  test('concatenation functoriality', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (a, b) =>
          getCharacterCount(a + b) ===
          getCharacterCount(a) + getCharacterCount(b)
      )
    );
  });
});
```

7. Unit tests for a function should be grouped under `describe(functionName, () => ...`.
8. Use `expect.any(...)` when testing for parameters that can be anything (e.g. variable ids).
9. ALWAYS use strong assertions over weaker ones e.g. `expect(x).toEqual(1)` instead of `expect(x).toBeGreaterThanOrEqual(1)`.
10. SHOULD test edge cases, realistic input, unexpected input, and value boundaries.
11. SHOULD NOT test conditions that are caught by the type checker.

## Code Organization

### Directory Structure

The codebase follows a **feature-first organization** pattern with clear separation of concerns:

#### Core Directories

- **`/src/app/`** - Next.js App Router pages and API routes
  - `[locale]/` - All routes wrapped with internationalization
  - `(protected)/` - Authenticated routes requiring user login
  - `actions/` - Server actions for mutations
  - `api/` - API routes organized by feature domain
  - `dal/` - Data Access Layer with consistent patterns per feature

- **`/src/components/`** - React components organized by feature
  - Feature-specific directories (e.g., `chat/`, `practice/`, `landing/`)
  - `ui/` - Reusable UI primitives following shadcn/ui patterns
  - `global/` - Shared components used across features

- **`/src/lib/`** - Library code and configurations
  - `supabase/` - Database schemas, migrations, and functions
  - External service integrations and shared utilities

- **`/src/utils/`** - Utility functions
  - Feature-specific subdirectories for domain logic
  - General utilities for common operations

- **`/src/hooks/`** - Custom React hooks
  - Feature-based organization (e.g., `chat/` for chat-specific hooks)
  - Consistent use of TanStack Query for data fetching

### Organization Principles

- **CO-1 (MUST)** Organize code by feature/domain, not by technical layer
- **CO-2 (MUST)** Place feature-specific code in dedicated directories
- **CO-3 (MUST)** Keep Data Access Layer (DAL) consistent:
  - `actions.ts` for server actions (mutations)
  - `api/route.ts` for API routes (queries)
  - `types.ts` for TypeScript type definitions
- **CO-4 (MUST)** Colocate related code within feature boundaries
- **CO-5 (SHOULD)** Use path aliases (`@/`) for imports from `src/`
- **CO-6 (MUST)** Follow the established patterns when adding new features:
  ```
  src/
  ├── app/
  │   ├── api/[feature]/          # API routes
  │   └── dal/[feature]/          # Server actions and types
  ├── components/[feature]/       # Feature components
  ├── hooks/[feature]/            # Feature hooks
  └── utils/[feature]/            # Feature utilities
  ```

## Remember Shortcuts

Remember the following shortcuts which the user may invoke at any time.

### QNEW

When I type "qnew", this means:

```
Understand all BEST PRACTICES listed in AGENTS.md.
Your code SHOULD ALWAYS follow these best practices.
```

### QPLAN
When I type "qplan", this means:
```
Analyze similar parts of the codebase and determine whether your plan:
- is consistent with rest of codebase
- introduces minimal changes
- reuses existing code
```

## QCODE

When I type "qcode", this means:

```
Implement your plan and make sure your new tests pass.
Always run tests to make sure you didn't break anything else.
Always run `prettier` on the newly created files to ensure standard formatting.
Always run `turbo typecheck lint` to make sure type checking and linting passes.
```

## QDOC

When I type "qdoc", this means:

```
Create a comprehensive markdown document with all the changes since last commit/push in /docs directory
First look how many files are there already so you can assign a proper number in front of a new file
Follow this patter [number e.g. 005]_[info]_[timestamp].md
Append all related files or necessary information to this document
It's a file for future you and other developers documenting the changes
```

### QCHECK

When I type "qcheck", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR code change you introduced (skip minor changes):

1. AGENTS.MD checklist Writing Functions Best Practices.
2. AGENTS.MD checklist Writing Tests Best Practices.
3. AGENTS.MD checklist Implementation Best Practices.
```

### QCHECKF

When I type "qcheckf", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR function you added or edited (skip minor changes):

1. AGENTS.MD checklist Writing Functions Best Practices.
```

### QCHECKT

When I type "qcheckt", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR test you added or edited (skip minor changes):

1. AGENTS.MD checklist Writing Tests Best Practices.
```

### QUX

When I type "qux", this means:

```
Imagine you are a human UX tester of the feature you implemented. 
Output a comprehensive list of scenarios you would test, sorted by highest priority.
```

### QCHANGELOG

When I type "qchangelog", this means:

```
Add a new version entry to the changelog with all changes since last push.

Process:
1. Read the current changelog structure in src/data/changelog.ts
3. Increment the version number appropriately (patch level: 0.4.8 -> 0.4.9)
4. Create detailed, user-focused changelog entries that explain:
   - What the user will experience differently
   - What problems were solved
   - What new capabilities they have
   - Focus on benefits, not technical implementation details
5. Organize changes into appropriate sections (Improvements, Fixes, New Features, etc.)
6. Write in clear, non-technical language that helps users understand exactly what to expect
7. Include translations for ALL supported languages found in messages/ directory:
   - English (en)
   - Spanish (es) 
   - Polish (pl)
   - German (de)
   - French (fr)
   - Italian (it)
   - Dutch (nl)
   - Portuguese (pt)
8. Follow the established changelog format and tone
9. Focus on "How does it apply to the user" - Why, How, Where.
10. Ensure all language versions convey the same information with culturally appropriate phrasing
11. Make it concise and to the point, write what's neccessary and that's it
12. Keep 1 item entry per change/feature/fix, etc.

The changelog should paint a clear picture for users about what changed and why they should care, regardless of their language.
```

### QFAGAN

When I type 'qfagan', this means:

```
Let's do this step by step, we're going to go full "Fagan Inspection" here.
```

### QGIT

When I type "qgit", this means:

```
Add all changes to staging, create a commit, and push to remote.

Follow this checklist for writing your commit message:
- SHOULD use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- SHOULD NOT refer to Claude or Anthropic in the commit message.
- SHOULD structure commit message as follows:
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
- commit SHOULD contain the following structural elements to communicate intent: 
fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.
```

## Core Architectural Principles

### Data Access Layer (DAL) Pattern

All database operations follow a consistent DAL pattern:

**Server Actions Structure:**
- Centralized location for all database operations
- Consistent return format with data and error handling
- Authentication validation for all operations
- Input validation using custom sanitization functions
- Multi-tenancy support with proper user filtering

**CRUD Operations Standards:**
- Implement consistent naming conventions across all entities
- Support paginated fetching for list operations
- Use soft delete patterns to maintain data integrity
- ALWAYS Use TanStack Query for all CRUD operations with optimistic updates
- Provide both single-item and batch operations where appropriate
- Use server actions (actions.ts) for POST operations
- Use api/route.ts for GET operations

**Type Safety:**
- Generate TypeScript types from validation schemas
- Separate schemas for create, update, and full entity types
- Omit server-managed fields from user input schemas
- Maintain strict type safety throughout the data flow

### Advanced Data Management

**Table System Philosophy:**
- Build reusable, feature-rich table components
- Support dynamic column configuration
- Implement advanced filtering with type-specific operators
- Provide drag-and-drop functionality for user customization
- Optimize for performance with virtualization and debouncing

**Data Fetching Strategy:**
- Use hierarchical query key patterns for cache management
- ALWAYS Use TanStack Query for all CRUD operations with optimistic updates
- Handle loading and error states gracefully
- Support infinite scroll and pagination patterns

### Form Handling Standards

**Client-Server Integration:**
- Use React Query for data handling
- Combine server actions with client-side mutations
- Implement optimistic updates for responsive UX
- Provide immediate feedback for all user actions

**Validation Approach:**
- Validate data on both client and server
- Provide real-time input validation feedback
- Use consistent error messaging patterns
- Handle edge cases and network failures gracefully

## Component Architecture

### Organization Principles

**File Structure:**
- Separate concerns between data access, routing, and UI components
- Group related functionality by feature/entity
- Maintain clear boundaries between server and client components
- Use consistent naming conventions across the codebase

**Component Design:**
- Build reusable components with clear interfaces
- Implement proper error boundaries and loading states
- Support customization through props and composition
- Maintain accessibility standards throughout

### Database Integration

**Client Management:**
- Use appropriate client types for server vs. client operations  
- Implement proper authentication flows
- Handle connection errors and retries gracefully
- Maintain security through Row Level Security patterns

**Data Patterns:**
- Filter all queries by authenticated user context
- Use soft delete patterns to preserve data relationships
- Implement proper indexing for performance
- Handle concurrent operations safely

## Development Standards

### Validation and Error Handling

**Input Validation:**
- Always validate user input on both client and server
- Provide immediate feedback for validation errors
- Use consistent validation schemas across operations
- Handle both synchronous and asynchronous validation

**Error Management:**
- Implement consistent error handling patterns
- Provide meaningful error messages to users
- Log errors appropriately for debugging
- Handle network failures and timeouts gracefully

### User Experience Principles

**Responsiveness:**
- Provide immediate feedback for all user actions using TanStack Query optimistic updates
- Use optimistic updates to reduce perceived latency and improve user experience
- Implement proper loading states and skeleton screens
- Handle slow network conditions gracefully

**Accessibility:**
- Follow WCAG guidelines for all interactive elements
- Provide proper keyboard navigation support
- Implement appropriate ARIA labels and roles
- Ensure sufficient color contrast and visual hierarchy

## Technical Stack Guidelines

### Framework Usage

**Next.js Best Practices:**
- Leverage App Router for optimal performance
- Use Server Components where appropriate
- Implement proper data fetching patterns
- Follow Next.js caching and revalidation strategies

**React Patterns:**
- Use hooks appropriately for state management
- Implement proper component lifecycle management
- Handle side effects with useEffect properly
- Maintain component purity where possible

### State Management

**Caching Strategy:**
- Use TanStack Query for all data fetching operations
- Implement proper cache invalidation patterns
- Handle stale data and background updates
- Provide offline support where appropriate

**Client State:**
- Use React state for component-local data
- Implement proper state lifting and prop drilling avoidance
- Handle complex state with useReducer when appropriate
- Maintain state consistency across components

## Code Quality Standards

### Development Practices

**Code Organization:**
- Write production-ready, optimized code
- Maintain comprehensive documentation
- Follow established architectural patterns consistently
- Implement proper testing strategies

**Performance Optimization:**
- Optimize bundle size and loading performance
- Implement proper code splitting strategies
- Use efficient rendering patterns
- Monitor and optimize Core Web Vitals

### Styling and UI

**Design System:**
- Use consistent component library throughout
- Implement responsive design patterns
- Maintain visual consistency across the application
- Follow accessibility guidelines for UI components

**Enhancement Philosophy:**
- Build upon established design systems
- Add aesthetic enhancements while maintaining usability
- Implement consistent interaction patterns
- Provide smooth animations and transitions

## Security and Authentication

### Data Protection

**Authentication Flow:**
- Validate user authentication for all protected operations
- Implement proper session management
- Handle authentication errors gracefully
- Support proper logout and session cleanup

**Authorization Patterns:**
- Implement role-based access control where needed
- Filter data based on user permissions
- Validate access rights on both client and server
- Handle unauthorized access attempts appropriately

### Input Sanitization

**Data Validation:**
- Sanitize all user inputs before processing
- Validate data types and formats consistently
- Handle malicious input attempts safely
- Implement proper SQL injection prevention