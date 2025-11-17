<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.1 (PATCH – clarify testing expectations given current lack of test frameworks)
- Modified principles:
  - [PRINCIPLE_1_NAME] → Code Quality & Safety
  - [PRINCIPLE_2_NAME] → Consistent User Experience
  - [PRINCIPLE_3_NAME] → Performance & Reliability
  - [PRINCIPLE_4_NAME] → Testing & Observability Discipline
  - [PRINCIPLE_5_NAME] → Simplicity & Incremental Change
- Added sections: None (initial constitution content filled for existing sections)
- Removed sections: None
- Templates reviewed:
  - ✅ .specify/templates/plan-template.md (updated Constitution Check gates for quality, UX, and performance)
  - ✅ .specify/templates/spec-template.md (already aligned with quality/UX/performance-focused requirements)
  - ✅ .specify/templates/tasks-template.md (reinforced polish tasks for code quality, UX consistency, and performance)
  - ✅ .specify/templates/agent-file-template.md (no changes required)
  - ✅ .specify/templates/checklist-template.md (no changes required)
- Command templates: ✅ N/A (no .specify/templates/commands/*.md files present)
- Deferred TODOs: None (all constitution placeholders resolved)
-->

# Kazala (prev. ASU Events) Constitution

## Core Principles

### Code Quality & Safety

Every change MUST maintain or improve code quality. This means:
- All TypeScript/JavaScript code MUST compile without errors and pass linting/formatting checks.
   - Until automated test frameworks are adopted, critical paths (checkout, payment,
           ticket validation, and access control) MUST at least be exercised manually
           against the relevant user stories and acceptance criteria.
   - Once automated testing frameworks (unit and/or end-to-end) are in place, new
           logic in critical paths SHOULD be covered by appropriate automated tests.
- Functions, components, and modules MUST have a clear single responsibility and avoid unnecessary
  abstraction.
- Security-sensitive areas (auth, payments, wallet passes, PII) MUST be reviewed with extra care
  and use established patterns already present in the codebase.
- All API contracts (tRPC routers) MUST use Zod schemas for runtime validation
- Type assertions (`as`) are DISCOURAGED; use type guards or proper narrowing instead
- `any` type is PROHIBITED except in migration scenarios (requires explicit comment justification)
- All functions with complex logic (>15 lines) SHOULD have JSDoc comments

**Rationale**: Kazala handles real money, tickets, and user identities. High-quality, safe code
reduces production incidents, protects users, and keeps the project approachable for new
contributors.

### Consistent User Experience

The user experience across the site MUST feel cohesive and predictable. This means:
- UI components MUST reuse existing patterns (design, layout, and interaction) whenever possible,
  especially for buttons, form fields, modals, and navigation.
- Visual styling MUST be implemented using the existing TailwindCSS utility conventions and any
  shared components, rather than one-off inline styles.
  - Currently used component libraries and styling solutions are Radix UI, Headless UI, Tailwind CSS. custom components in `/src/components`
- Flows that are similar (e.g., creating, editing, or viewing events and tickets) MUST align in
  copy, validation behavior, and error handling.
- Accessibility and responsiveness MUST be considered for every change; pages MUST remain usable
  on mobile and desktop.
- Forms MUST provide clear error messages and validation feedback
- Loading states MUST be shown for operations taking >500ms
- Toast notifications MUST use the `sonner` library for consistency
- Modal dialogs MUST follow established patterns and allow ESC key dismissal
- Icons MUST use `lucide-react` for visual consistency
- Font sizes MUST be specified in rem units (not px) to respect user preferences

**Rationale**: Consistent UX reduces user confusion, makes support easier, and helps new features
fit naturally into the system.

### Performance & Reliability

The system MUST remain fast and reliable for typical and peak usage. This means:
- User-facing pages SHOULD render meaningful content within a reasonable time on typical student
  devices and networks (aim for <200ms server response for core API routes and <2s first
  meaningful paint for primary pages under normal load).
- Expensive operations (e.g., reporting, large queries, background payouts) MUST be optimized,
  paginated, or moved off the critical request path where feasible.
- Changes that may impact database load, third-party APIs, or ticketing flows MUST include
  explicit consideration of performance and failure modes in the plan/spec.
- Error states MUST be handled gracefully with clear messaging instead of blank screens or
  unhandled crashes.
- Database queries MUST use appropriate indexes (verify with EXPLAIN ANALYZE)

**Rationale**: Event organizers and attendees often use the site in time-sensitive scenarios
(e.g., right before an event). Poor performance or reliability directly reduces trust and
revenue.

### Security and Data Protection

**Statement**: All user data MUST be protected following security best practices. Authentication MUST use industry-standard protocols. Payment data MUST NEVER be stored locally.

**Rationale**: The platform handles personally identifiable information (PII) and processes payments. Security breaches damage user trust irreparably and carry legal liability.

**Requirements**:
- NextAuth.js MUST be used for authentication with secure session management
- All API endpoints MUST validate authentication and authorization on the server
- Environment variables containing secrets MUST NEVER be committed to version control
- Payment processing MUST use Stripe's client-side tokenization (no raw card data on servers)
- SQL queries MUST use parameterized statements (Prisma ORM enforces this)
- User inputs MUST be sanitized before rendering. Use react-hook-form and Zod schema validation to help take care of this. Be cautious with `dangerouslySetInnerHTML`.


---

### Error Handling and Observability

**Statement**: All errors MUST be handled gracefully with user-friendly messages. Production systems MUST provide observability through logging, monitoring, and alerting.

**Rationale**: Errors are inevitable; how we handle them determines user experience quality. Observability enables rapid incident response and proactive issue detection.

**Requirements**:
- All async operations MUST have try-catch blocks or `.catch()` handlers
- User-facing error messages MUST be actionable (not raw stack traces or technical jargon)
- All API errors MUST return appropriate HTTP status codes and structured error objects
- Backend errors MUST be logged to Sentry with sufficient context (user ID, request metadata)
- Frontend errors MUST be captured by Sentry's React error boundaries
- Console logs MUST NOT contain sensitive data (tokens, PII, passwords)
- Development environment MUST use verbose logging; production MUST log errors and warnings only
- All database operations MUST handle constraint violations gracefully
- Network failures MUST show retry mechanisms or clear user guidance

**Compliance Check**: Manual code review for error handling patterns, Sentry dashboard monitoring for error rates and new error types.

---

### Maintainability and Documentation

**Statement**: Code MUST be self-documenting through clear naming and structure. Complex logic MUST be accompanied by explanatory comments. Architecture decisions MUST be documented.

**Rationale**: The project welcomes contributors with varying experience levels. Clear documentation lowers the barrier to entry and reduces onboarding time, enabling faster iterations.

**Requirements**:
- Functions and variables MUST have descriptive names (avoid abbreviations like `evt`, prefer `event`)
- Magic numbers MUST be extracted to named constants (e.g., `MAX_TICKET_QUANTITY = 10`)
- Complex algorithms or business logic MUST have explanatory comments (why, not what)
- API routes MUST document expected inputs, outputs, and error cases
- Environment variables MUST be documented in `.env.example` with descriptions
- Database schema changes MUST be accompanied by migration scripts (Prisma migrations)
- Breaking changes MUST be documented in pull request descriptions
- Deprecated features MUST be marked with `@deprecated` JSDoc tags and removal timelines
- README files MUST be kept up-to-date with setup instructions and tech stack changes
- Architecture Decision Records (ADRs) SHOULD be created for major technical decisions

**Compliance Check**: Manual review during pull request approval, onboarding feedback from new contributors.

### Testing & Observability Discipline

Testing and observability MUST be sufficient to detect regressions in quality, UX, and
performance. This means:
- In the current phase (without established unit/end-to-end test frameworks), critical flows
  (ticket purchase, check-in, payouts) MUST be validated with clear, repeatable manual checks
  tied to user stories and success criteria.
- Once an automated testing stack is adopted, those same critical flows MUST gain automated test
  coverage (unit, integration, and/or end-to-end) within a reasonable number of feature cycles.
- New features SHOULD plan for future automated tests by clearly documenting intended behaviors
  (including at least one key error path) in specs and plans.
- Logs and monitoring (including Sentry and any runtime logs) MUST be used thoughtfully—log
  actionable information and avoid logging sensitive data.
- When a production incident occurs, a minimal regression check (manual or automated, once the
  stack exists) MUST be added to prevent the same class of issue from silently recurring.

**Rationale**: Without tests and observability, we cannot reliably maintain quality, UX, or
performance as the codebase evolves.

### Simplicity & Incremental Change

The simplest solution that satisfies the requirements and principles above MUST be preferred.
This means:
- Start with the minimal implementation that supports the prioritized user stories and success
  criteria, then iterate.
- Avoid premature generalization (e.g., complex abstraction layers, unused configuration, or
  speculative multi-tenant support) unless clearly justified in the plan.
- Large changes SHOULD be broken into reviewable, deployable increments aligned with user
  stories.
- When modifying existing flows, prefer extending and improving current patterns instead of
  introducing competing approaches without strong justification.

**Rationale**: Simplicity keeps the project welcoming to new contributors, reduces bugs, and
helps us ship improvements quickly without sacrificing quality, UX, or performance.

## Quality, UX, and Performance Standards

For this project:

- **Tech Stack**: Next.js (App Router where applicable), React, tRPC, MySQL (PlanetScale),
  TailwindCSS, React Query, and related tooling defined in the repository.
- **Code Quality Baseline**:
  - Linting and formatting MUST run clean for all touched files before merge.
  - TypeScript types MUST be respected; `any` usage MUST be justified in code comments.
  - New modules MUST include brief inline documentation or self-documenting names.
- **UX Consistency Baseline**:
  - Shared UI components and patterns SHOULD be used for forms, buttons, typography, and
    layout.
  - Error messages MUST be clear and user-friendly, not raw exception text.
  - All new or changed pages MUST be visually checked on both mobile and desktop breakpoints.
- **Performance Baseline**:
  - Database queries in hot paths MUST avoid N+1 patterns; use relations, batching, or caching
    where appropriate.
  - Network requests SHOULD be minimized and batched where possible.
  - Where relevant, performance expectations (e.g., p95 latency) SHOULD be captured in the
    feature’s spec and plan.

These standards are the default bar for all new work and refactors. Deviations MUST be called
out explicitly in the plan and PR with rationale.

## Development Workflow & Quality Gates

The development workflow for features and fixes MUST respect this constitution:

- **Spec & Plan Phase**:
  - Each feature MUST have a spec and implementation plan that explicitly consider:
    - Code quality impact (complexity, testing approach, risks)
    - UX consistency (affected journeys, components reused, copy implications)
    - Performance (expected load, data volume, latency sensitivity)
  - The “Constitution Check” section in plans MUST answer how the work satisfies the core
    principles above or list justified exceptions.
- **Implementation Phase**:
  - Tasks MUST be organized by user story so that each story can be developed, tested, and
    (if desired) deployed independently.
  - Before merging, changes MUST be exercised (at minimum manually, and via automated tests
    once frameworks are introduced) against the defined user stories and success criteria in
    the spec.
  - Any incident fixes MUST include a short note in the plan or tasks about root cause and how
    we will prevent recurrence (tests, monitoring, or process change).
- **Review & Deployment**:
  - Code reviews MUST check for alignment with this constitution, not just correctness.
  - Breaking changes to public contracts (APIs, event schemas, ticket formats) MUST include a
    migration or compatibility plan.
  - Deployments SHOULD be incremental and reversible where possible (feature flags, safe
    rollbacks, etc.).

## Governance

This constitution defines the non-negotiable standards for the Kazala (prev. ASU Events)
project. It applies to all contributors and all changes to this repository.

- **Authority & Scope**:
  - This constitution supersedes informal habits and undocumented practices.
  - When in doubt, favor decisions that better uphold code quality, UX consistency, and
    performance.
- **Amendments**:
  - Amendments MUST be proposed via PR that:
    - Explains the rationale for the change.
    - Updates the constitution text.
    - Updates or confirms alignment of SpecKit templates (plan, spec, tasks, and any
      checklists or guidance docs).
  - Approval by at least one technical maintainer (e.g., technical director or designated
    senior contributor) is REQUIRED before merging governance changes.
- **Versioning**:
  - The constitution uses semantic versioning: `MAJOR.MINOR.PATCH`.
    - **MAJOR**: Backward-incompatible policy changes or removal/redefinition of existing
      principles.
    - **MINOR**: New principles, new sections, or materially expanded guidance.
    - **PATCH**: Clarifications, wording fixes, or non-semantic refinements.
  - Each amendment MUST bump the version and update the “Last Amended” date.
- **Compliance & Review**:
  - PR reviewers MUST explicitly consider this constitution when approving changes.
  - Spec and plan templates MUST continue to include a “Constitution Check” gate that references
    code quality, UX consistency, and performance.
  - At least once per semester (or major feature cycle), maintainers SHOULD briefly review
    whether the constitution still fits how the project is evolving and propose updates if
    needed.

For day-to-day implementation details (folder structure, commands, style), refer to the
Development Guidelines document generated from feature plans and kept alongside SpecKit
artifacts.

**Version**: 1.0.1 | **Ratified**: 2025-11-17 | **Last Amended**: 2025-11-17
