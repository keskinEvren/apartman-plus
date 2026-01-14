---
type: documentation
agent_role: all
context_depth: 2
required_knowledge: ["asanmod_core"]
last_audited: "2026-01-14"
---

# Changelog

All notable changes to this project will be documented in this file.

## [2.0.2] - 2026-01-14
### Added
- **Self-Healing Setup**: Added `npm run doctor` for deep environment diagnosis.
- **In-Memory Postgres**: Integrated `pg-mem` for zero-config integration tests.
- **Agent Knowledge Mesh**: Added `docs/ARCH.md` and `docs/AUDIT_TEMPLATE.md`.
- **DB Auto-Auth**: Wizard now offers to create PG roles.

### Fixed
- **Decisive ESM Fix**: Downgraded `superjson` to v1.13.3 for Jest compatibility.
- **Test Isolation**: Restricted Jest to core folders to avoid MCP collisions.

## [2.0.1] - 2026-01-14

### Enterprise Certification (Green Run)
- **Verified:** Passed all 6 quality gates (Lint, TSC, Test, Audit, Build, Env).
- **Fixed:** Downgraded ESLint to v8.57.0 to resolve v9 conflict.
- **Fixed:** Resolved TypeScript module resolution errors in `server/index.ts`.
- **Fixed:** Corrected `jest.config.js` and `setup.ts` for strictly typed environment.
- **Certified:** Infrastructure is now fully deterministic and agent-ready.

---

## [2.0.0] - 2026-01-13

### Initial Release
- Complete Next.js 15 + tRPC + PostgreSQL template.
- ASANMOD v1.1.1 Governance included.


## [0.0.1] - [WIZARD_WILL_FILL_DATE]

### Added

- Project initialized with ASANMOD Enterprise Template v2.0
- Selected modules: [WIZARD_WILL_FILL_MODULES]
- Database configured: [WIZARD_WILL_FILL_DB_NAME]

---

_This file is maintained by ASANMOD governance._
