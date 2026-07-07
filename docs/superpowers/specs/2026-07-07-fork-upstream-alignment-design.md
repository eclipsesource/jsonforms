# Fork Review & Upstream Alignment — Design

**Date:** 2026-07-07
**Status:** Approved
**Scope:** `packages/svelte`, `packages/svelte-shadcn` (incl. example app), fork-touched shared infra (CI, publish workflow, examples-app aggregation). Upstream package internals are only changed via the upstream merge itself.

## Goal

Bring the fork to a reliable, secure, upstream-current state:

1. Sync with `eclipsesource/jsonforms` `upstream/master` (v3.8.0).
2. Port upstream Vue-binding changes into the Svelte binding.
3. Close renderer parity gaps and fix latent bugs in `svelte-shadcn`.
4. Fix release/CI/docs hygiene issues found in review.

## Findings driving this design

### Bugs

| # | Issue | Location |
|---|---|---|
| B1 | Testers receive raw `config` prop (always `undefined`) instead of resolved config; upstream fixed the Vue equivalent in `c0c33f51` | `packages/svelte/src/DispatchRenderer.svelte`, `DispatchCell.svelte` |
| B2 | `CategorizationRenderer` renders invisible categories (no visibility filtering) and does not forward `readonly` to children | `packages/svelte-shadcn/src/layouts/CategorizationRenderer.svelte` |
| B3 | Release peer-dependency rewrite skips both svelte packages → published artifacts would carry stale `@jsonforms/core` peer ranges | `.github/workflows/publish.yaml` (rewrite block) |
| B4 | Svelte packages lack `test-cov` scripts → tests silently skipped on the ubuntu CI job (the only coverage job); they run only on macOS/Windows | `.github/workflows/ci.yaml`, both svelte `package.json` |
| B5 | Example app pins `lodash: ^4.18.1` — version does not exist | `packages/svelte-shadcn/example/package.json` |
| B6 | README documents Vue-style `on:change` / `e.detail`; actual API is `onchange` / `event.data` | `packages/svelte-shadcn/README.md` |

### Parity gaps vs upstream Vue binding (post-3.8.0)

- Missing public accessors `useJsonForms` / `useDispatch` / `useTranslator` / `useAjv` (with optional overloads) — added upstream in `c0c33f51` / `6db5bc87`.
- Still imports bare `createId` / `removeId`; upstream moved to an overridable `Id` singleton (`e797a3d8`).
- `svelte-shadcn` lacks `TimeControlRenderer` and `CategorizationStepperRenderer` (both present and tested in vue-vanilla).

### Hygiene

- No MIT license headers on any svelte source file (repo standard everywhere else).
- svelte-shadcn example excluded from `packages/examples-app` aggregation.

### Security review result

Clean. No `{@html}` / `eval` / `innerHTML` / dynamic code execution in the svelte packages or example app. The example's i18n textarea uses guarded `JSON.parse` + `lodash.get` (data lookup only). Schema/uischema are consumed as objects, never parsed from strings. Upstream sync additionally brings the minimum-dependency-age supply-chain policy.

## Design

### Branch strategy

Four sequential branches, one worktree each under `.worktrees/`, each PR'd and merged before the next starts:

1. `sync/upstream-3.8.0`
2. `feature/svelte-binding-parity`
3. `feature/svelte-shadcn-parity`
4. `chore/svelte-infra-hygiene`

### Branch 1 — upstream sync

Merge `upstream/master` into master. Known conflicts (verified via `git merge-tree`):

- `pnpm-workspace.yaml`: keep fork's svelte workspace entries, take upstream's additions (union merge).
- `pnpm-lock.yaml`: discard both sides, regenerate with `pnpm install`.

Post-merge: align the svelte packages' versions and `@jsonforms/*` peer pins with the upstream version bump (3.8.0 line), then full `pnpm run build` + `pnpm run test` to validate the fork's packages against new core (`Id` utility, `generateUISchema` nullable handling).

### Branch 2 — binding parity (`packages/svelte`)

Mirrors upstream Vue changes, keeping the fork's `get*` naming convention:

- New public accessors in `compositions.svelte.ts` (or `context.svelte.ts` as appropriate): `getJsonForms(optional?)`, `getDispatch(optional?)`, `getTranslator(optional?)`, `getAjv(optional?)`. Non-optional calls throw a descriptive error outside a `JsonForms` provider; `optional: true` returns `undefined`.
- Internal compositions (`useControl`, `getJsonFormsRenderer`, …) refactored to consume the new accessors, as upstream did.
- Replace bare `createId` / `removeId` imports with the `Id` singleton (`Id.createId` / `Id.removeId`) so id generation is overridable.
- Fix B1: `DispatchRenderer.svelte` passes `bindings.renderer.config` to testers; `DispatchCell.svelte` passes `cell.config`.
- TDD: tests for accessor behavior inside/outside provider (optional and throwing variants), tester-receives-resolved-config regression, Id override.

### Branch 3 — renderer set parity (`packages/svelte-shadcn`)

- Fix B2 in `CategorizationRenderer.svelte` using upstream's fixed algorithm: `categories.map((category, originalIndex) => …).filter(visible)` so tab keys/values preserve original indices; reset the active tab to the first visible category when the current one becomes invisible; forward `readonly` to child `DispatchRenderer`s.
- Add `TimeControlRenderer` (shadcn-styled time input, `isTimeControl` tester), ported from vue-vanilla.
- Add `CategorizationStepperRenderer` (next/back navigation, `showNavButtons` option), ported from vue-vanilla with the upstream step-order fix baked in.
- Register both in `renderers.ts`; export from `index.ts`.
- TDD: port vue-vanilla's `TimeControlRenderer` and `CategorizationStepperRenderer` specs; add visibility-filtering and readonly-forwarding regression tests for Categorization.

### Branch 4 — infra & hygiene

- **CI coverage (B4):** add `"test-cov": "vitest run --coverage"` + `@vitest/coverage-v8` (lcov reporter) to both svelte packages so the ubuntu job runs them and Coveralls sees their coverage.
- **Publish (B3):** add both svelte packages to the peer-dependency rewrite block in `publish.yaml`.
- **Example app (B5 + aggregation):** fix lodash to `^4.17.21`; add svelte-shadcn to `packages/examples-app/prepare-examples-app.js` and the index page.
- **Docs (B6):** correct the README usage snippet to `onchange={(event) => (data = event.data)}`.
- **License headers:** add the repo-standard MIT header block to all svelte source files (scripted insertion, spot-checked; excludes generated/config files).

### Verification

Per branch: scoped `pnpm lerna run build|lint|test` for affected packages, plus a full-repo `pnpm run build && pnpm run test` before PR. After branch 3: run the example app and manually verify categorization (visibility + stepper) and the new Time control. After branch 4: `pnpm run build:examples-app` and confirm the svelte-shadcn entry appears and loads.

## Out of scope

- Changes to upstream package internals beyond the merge.
- New features beyond parity (e.g. additional renderer types not in vue-vanilla).
- ESLint/typescript-eslint major upgrades in the svelte packages (noted as future work; upstream may do this globally).
- Tests for presentational `ui/*` primitives (covered indirectly via renderer tests).
