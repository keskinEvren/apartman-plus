# Contributing to ASANMOD Enterprise Template

Thank you for your interest in contributing to ASANMOD! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (see CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/masan3134/asanmod-enterprise/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check existing [Issues](https://github.com/masan3134/asanmod-enterprise/issues) for similar suggestions
2. Create a new issue with:
   - Clear use case description
   - Expected benefits
   - Implementation ideas (optional)

### Contributing Code

#### Development Setup

```bash
# Clone the repository
git clone https://github.com/masan3134/asanmod-enterprise.git
cd asanmod-enterprise/asan-enterprise-template

# Install dependencies
npm install

# Initialize the project
node scripts/mod-tools/asan-init.js

# Run verification
npm run verify
```

#### Creating a New Module

ASANMOD uses a modular architecture. To add a new feature module:

1. Create directory structure:

```
src/modules/your-module/
├── schema.ts      # Drizzle tables
├── router.ts      # tRPC endpoints
├── types.ts       # Zod validators
└── components/    # UI components
```

2. Export from `src/db/schema.ts`:

```typescript
export * from "../modules/your-module/schema";
```

3. Add router to `src/server/index.ts`:

```typescript
import { yourModuleRouter } from "@/modules/your-module/router";

export const appRouter = router({
  // ...existing routers
  yourModule: yourModuleRouter,
});
```

#### Quality Standards

Before submitting a PR, ensure:

- ✅ **Zero Lint Errors**: `npm run lint`
- ✅ **Zero Type Errors**: `npx tsc --noEmit`
- ✅ **Verification Passes**: `npm run verify` (or `asan verify`)
- ✅ **Code Follows Conventions**: Mobile-first CSS, no `any` types, proper Zod validation
- ✅ **Modules are Isolated**: No cross-module imports

#### Pull Request Process

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the quality standards
4. **Commit** with descriptive messages:
   ```
   ID: FEATURE-001 | Add billing module with Stripe integration
   ```
5. **Push** to your fork: `git push origin feature/your-feature-name`
6. **Create a Pull Request** with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots/examples if applicable

#### Commit Message Format

We follow the ASANMOD commit format:

```
ID: <TASK-ID> | <Description>
```

Examples:

- `ID: FEAT-042 | Add user authentication module`
- `ID: FIX-013 | Fix tRPC CORS issue in production`
- `ID: DOCS-007 | Update Ghost-Dev protocol documentation`

### Documentation

- Update `README.md` if adding new features
- Update `docs/` if changing protocols or architecture
- Add inline comments for complex logic
- Update `CHANGELOG.md` (we'll handle versioning)

## Architecture Principles

1. **Modular by Design**: Each feature is a self-contained module
2. **Type-Safe**: End-to-end type safety with Zod + Drizzle + tRPC
3. **Mobile-First**: All UI must be responsive
4. **Zero Tolerance**: No lint errors, no type errors, no console.log in server code
5. **Autonomous**: Code should be agent-readable and self-documenting

## Questions?

- Open an issue for discussion
- Check existing documentation in `docs/`
- Read the Ghost-Dev Protocol: `docs/GHOST_DEV_PROTOCOL.md`

---

**Thank you for contributing to ASANMOD! 🚀**
