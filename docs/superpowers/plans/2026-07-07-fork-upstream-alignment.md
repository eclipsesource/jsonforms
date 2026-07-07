# Fork Upstream Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync the fork with upstream v3.8.0 and bring the Svelte binding + svelte-shadcn renderer set to parity with upstream's Vue packages, fixing the reliability bugs found in review.

**Architecture:** Four sequential phases, each on its own branch merged before the next starts: (1) upstream merge, (2) `@jsonforms/svelte` binding parity, (3) `@jsonforms/svelte-shadcn` renderer parity, (4) infra/hygiene. The Svelte binding mirrors `packages/vue` (spec: `docs/superpowers/specs/2026-07-07-fork-upstream-alignment-design.md`).

**Tech Stack:** Svelte 5 (runes), TypeScript, Vitest + @testing-library/svelte (jsdom), pnpm + lerna monorepo.

## Global Constraints

- **pnpm PATH:** prepend to EVERY Bash call that needs pnpm: `export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"`
- Node `^22` required by `engines`; v25 prints an engine warning — ignore it.
- Rune-using modules must be `.svelte.ts`; cross-module reactive values go through Proxy/getter objects (see `packages/svelte/src/compositions.svelte.ts`).
- Svelte 5 only: callback props (no `createEventDispatcher`), `{@const Comp}` dispatch (no `<svelte:component>`).
- Vue `use*` composables port to `get*` names in Svelte.
- Run tests scoped: `pnpm lerna run test --scope=@jsonforms/svelte` (or `--scope=@jsonforms/svelte-shadcn`).
- Each phase branch is created from `master` AFTER the previous phase's PR merged. Worktrees: `git worktree add .worktrees/<name> -b <branch>`, then `pnpm --dir /abs/path install`.
- Commit messages end with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

## Phase 1 — branch `sync/upstream-3.8.0`

### Task 1: Merge upstream/master

**Files:**
- Modify: `pnpm-workspace.yaml` (conflict), `pnpm-lock.yaml` (regenerate)

**Interfaces:**
- Produces: master-mergeable tree containing upstream v3.8.0 (`Id` singleton in `@jsonforms/core`, new vue accessors, CI/dep-policy updates).

- [ ] **Step 1: Create worktree and merge**

```bash
git fetch upstream
git worktree add .worktrees/sync-upstream -b sync/upstream-3.8.0 master
cd .worktrees/sync-upstream
git merge upstream/master
```

Expected: conflicts ONLY in `pnpm-workspace.yaml` and `pnpm-lock.yaml`. Any other conflicted file: stop and report.

- [ ] **Step 2: Resolve pnpm-workspace.yaml**

Union merge: keep the fork's svelte workspace entries AND upstream's additions (upstream added 4 lines; keep both sides, dedupe). Confirm the result lists `packages/svelte-shadcn/example` (or whatever glob covers it) plus upstream's new entries.

- [ ] **Step 3: Regenerate lockfile**

```bash
git checkout --theirs pnpm-lock.yaml
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
pnpm install --no-frozen-lockfile
git add pnpm-workspace.yaml pnpm-lock.yaml
git merge --continue --no-edit
```

- [ ] **Step 4: Verify build + tests**

```bash
pnpm run build
pnpm run test
```

Expected: all packages build and pass, including `@jsonforms/svelte` and `@jsonforms/svelte-shadcn` against core 3.8.0.

- [ ] **Step 5: Commit is the merge commit — nothing extra to commit**

### Task 2: Align svelte package versions with 3.8.0

**Files:**
- Modify: `packages/svelte/package.json`, `packages/svelte-shadcn/package.json`

**Interfaces:**
- Produces: both packages at `"version": "3.8.0"` with exact peer pins `@jsonforms/core: "3.8.0"` (and `@jsonforms/svelte: "3.8.0"` for shadcn), matching how lerna versions the other packages.

- [ ] **Step 1: Bump versions and peer pins**

```bash
cd packages/svelte && pnpm pkg set version=3.8.0 peerDependencies.@jsonforms/core=3.8.0
cd ../svelte-shadcn && pnpm pkg set version=3.8.0 peerDependencies.@jsonforms/core=3.8.0 peerDependencies.@jsonforms/svelte=3.8.0
cd ../.. && pnpm install --no-frozen-lockfile
```

- [ ] **Step 2: Rebuild + retest the two packages**

```bash
pnpm lerna run build --scope=@jsonforms/svelte --scope=@jsonforms/svelte-shadcn
pnpm lerna run test --scope=@jsonforms/svelte --scope=@jsonforms/svelte-shadcn
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte/package.json packages/svelte-shadcn/package.json pnpm-lock.yaml
git commit -m "chore(svelte): align versions and peer pins with upstream 3.8.0"
```

- [ ] **Step 4: PR + merge**

Push, `gh pr create` (base master, title "sync: merge upstream v3.8.0"), merge with `gh pr merge --merge`. Then `git worktree remove` the worktree.

---

## Phase 2 — branch `feature/svelte-binding-parity` (packages/svelte)

### Task 3: Context accessors getJsonForms / getDispatch

**Files:**
- Modify: `packages/svelte/src/context.svelte.ts`, `packages/svelte/src/index.ts`
- Test: `packages/svelte/tests/context.test.ts` (extend; follow the existing fixture-component pattern in that file — context functions must be called during component init)

**Interfaces:**
- Consumes: existing `getJsonFormsContext()`.
- Produces (exact signatures, used by Tasks 4–6):

```ts
export function getJsonForms(): JsonFormsSubStates;
export function getJsonForms(optional: true): JsonFormsSubStates | undefined;
export function getDispatch(): Dispatch<CoreActions>;
export function getDispatch(optional: true): Dispatch<CoreActions> | undefined;
```

- [ ] **Step 1: Write failing tests** — four cases, each via a small fixture `.svelte` component that calls the accessor in init and exposes the result (mirror how `context.test.ts` fixtures work): (a) `getJsonForms()` inside `JsonForms` returns the substates object; (b) `getJsonForms()` outside a provider throws `/couldn't be injected/`; (c) `getJsonForms(true)` outside a provider returns `undefined` without throwing; (d) same trio for `getDispatch` (function returned).

- [ ] **Step 2: Run to verify fail**

```bash
pnpm lerna run test --scope=@jsonforms/svelte
```

Expected: FAIL — `getJsonForms is not a function` (not yet exported).

- [ ] **Step 3: Implement** — append to `context.svelte.ts` (mirrors upstream vue `useJsonForms`/`useDispatch` from `packages/vue/src/jsonFormsCompositions.ts`):

```ts
export function getJsonForms(): JsonFormsSubStates;
export function getJsonForms(optional: true): JsonFormsSubStates | undefined;
export function getJsonForms(optional?: true) {
  const jsonforms = getJsonFormsContext()?.jsonforms;
  if (!jsonforms && !optional) {
    throw new Error(
      "'jsonforms' context couldn't be injected. Are you within JSON Forms?"
    );
  }
  return jsonforms;
}

export function getDispatch(): Dispatch<CoreActions>;
export function getDispatch(optional: true): Dispatch<CoreActions> | undefined;
export function getDispatch(optional?: true) {
  const dispatch = getJsonFormsContext()?.dispatch;
  if (!dispatch && !optional) {
    throw new Error(
      "'dispatch' context couldn't be injected. Are you within JSON Forms?"
    );
  }
  return dispatch;
}
```

Add `getJsonForms, getDispatch` to the context export block in `index.ts`.

- [ ] **Step 4: Run tests — PASS**
- [ ] **Step 5: Commit** `feat(svelte): add getJsonForms/getDispatch context accessors`

### Task 4: getTranslator / getAjv accessors

**Files:**
- Modify: `packages/svelte/src/context.svelte.ts`, `packages/svelte/src/index.ts`, `packages/svelte/package.json` (devDep `ajv` if TS can't resolve the type import)
- Test: `packages/svelte/tests/context.test.ts`

**Interfaces:**
- Produces:

```ts
export function getTranslator(): Translator;               // throws without i18n
export function getTranslator(optional: true): Translator | undefined;
export function getAjv(): Ajv;                              // throws without core.ajv
export function getAjv(optional: true): Ajv | undefined;
```

- [ ] **Step 1: Write failing tests** — (a) with `<JsonForms i18n={{ translate: (k, d) => 'translated:' + k }}>`, a fixture calling `getTranslator()` gets a function; calling it returns `'translated:foo'` for key `'foo'`; (b) `getTranslator()` without i18n prop throws `/i18n/`; (c) `getTranslator(true)` without i18n returns `undefined`; (d) `getAjv()` inside JsonForms returns an object with `.validate`; (e) `getAjv(true)` outside a provider returns `undefined`.

- [ ] **Step 2: Run — FAIL (not exported)**

- [ ] **Step 3: Implement** in `context.svelte.ts` (imports: add `Translator` to the `@jsonforms/core` type import; add `import type Ajv from 'ajv';`):

```ts
export function getTranslator(): Translator;
export function getTranslator(optional: true): Translator | undefined;
export function getTranslator(optional?: true) {
  const jsonforms = optional === true ? getJsonForms(true) : getJsonForms();
  if (!jsonforms?.i18n?.translate) {
    if (optional) {
      return undefined;
    }
    throw new Error(
      "'jsonforms i18n' couldn't be injected. Are you within JSON Forms?"
    );
  }
  // Delegate per call so consumers always see the current translator
  // (the context object is reactive state; reads register dependencies).
  const translate = ((key, defaultMessage, values) => {
    const t = jsonforms.i18n?.translate;
    if (!t) {
      throw new Error(
        "'jsonforms i18n' couldn't be injected. Are you within JSON Forms?"
      );
    }
    return t(key, defaultMessage as string, values);
  }) as Translator;
  return translate;
}

export function getAjv(): Ajv;
export function getAjv(optional: true): Ajv | undefined;
export function getAjv(optional?: true) {
  const jsonforms = optional === true ? getJsonForms(true) : getJsonForms();
  if (!optional && !jsonforms?.core?.ajv) {
    throw new Error(
      "'jsonforms ajv' couldn't be injected. Are you within JSON Forms?"
    );
  }
  return jsonforms?.core?.ajv as Ajv;
}
```

If `import type Ajv from 'ajv'` fails to resolve: `pnpm --dir packages/svelte add -D ajv@^8.6.1` (matches vue). Export both from `index.ts`.

- [ ] **Step 4: Run tests — PASS. Also `pnpm lerna run lint --scope=@jsonforms/svelte` (svelte-check must be clean).**
- [ ] **Step 5: Commit** `feat(svelte): add getTranslator/getAjv accessors`

### Task 5: Id singleton + internal accessor refactor

**Files:**
- Modify: `packages/svelte/src/compositions.svelte.ts`
- Test: `packages/svelte/tests/compositions.test.ts` (extend)

**Interfaces:**
- Consumes: `getJsonForms`/`getDispatch` from Task 3; `Id` from `@jsonforms/core` 3.8.0.
- Produces: id generation overridable via `Id.createId`/`Id.removeId`; no behavior change otherwise.

- [ ] **Step 1: Write failing test** — override `Id.createId`/`Id.removeId`, render a control fixture (reuse the existing control fixture in `compositions.test.ts` that exposes `control.id`), assert the id comes from the override; restore originals in `finally`/`afterEach`:

```ts
import { Id } from '@jsonforms/core';

it('uses the Id singleton so id generation is overridable', () => {
  const original = { createId: Id.createId, removeId: Id.removeId };
  try {
    Id.createId = (proposed) => `custom-${proposed}`;
    Id.removeId = () => true;
    // render existing control fixture with a scoped Control uischema
    // assert exposed control.id === 'custom-#/properties/name' (adjust to fixture scope)
  } finally {
    Id.createId = original.createId;
    Id.removeId = original.removeId;
  }
});
```

- [ ] **Step 2: Run — FAIL (id still comes from bare createId, not the override)**

- [ ] **Step 3: Implement** in `compositions.svelte.ts`:
  - Import list: replace `createId,` and `removeId,` with `Id,`.
  - In `useControl`'s `$effect`: `id = Id.createId(...)` and `Id.removeId(id)`.
  - Replace `const { jsonforms, dispatch } = requireJsonFormsContext();` in `useControl` with:

```ts
const jsonforms = getJsonForms();
const dispatch = getDispatch();
```

  - In `getJsonFormsRenderer`, replace `const { jsonforms } = requireJsonFormsContext();` with `const jsonforms = getJsonForms();`.
  - Update the import from `'./context.svelte'` to `{ getDispatch, getJsonForms }`. `requireJsonFormsContext` stays exported from context for backward compat.

- [ ] **Step 4: Run full package tests + lint — PASS**
- [ ] **Step 5: Commit** `feat(svelte): use overridable Id singleton and context accessors internally`

### Task 6: Resolved config for testers (DispatchRenderer / DispatchCell)

**Files:**
- Modify: `packages/svelte/src/DispatchRenderer.svelte:17`, `packages/svelte/src/DispatchCell.svelte:16`
- Test: `packages/svelte/tests/DispatchRenderer.test.ts`, `packages/svelte/tests/DispatchCell.test.ts` (extend)

**Interfaces:**
- Consumes: `bindings.renderer.config` / `cell.config` (already present in the mapped state props).
- Produces: testers receive the RESOLVED config (core state config), mirroring upstream vue fix `c0c33f51`.

- [ ] **Step 1: Write failing test** (DispatchRenderer; analogous one for DispatchCell using `cells`):

```ts
it('passes the resolved config to testers', () => {
  let seenConfig: unknown;
  const spyEntry = {
    renderer: SomeExistingFixtureRenderer,
    tester: (_uischema: any, _schema: any, context: any) => {
      seenConfig = context.config;
      return 1;
    },
  };
  render(JsonForms as any, {
    props: {
      schema: { type: 'string' },
      uischema: { type: 'Control', scope: '#' },
      data: 'x',
      config: { myOption: 'from-config' },
      renderers: [spyEntry],
    },
  });
  expect((seenConfig as any)?.myOption).toBe('from-config');
});
```

(Use an existing fixture renderer component from the tests dir for `renderer:`.)

- [ ] **Step 2: Run — FAIL: `seenConfig` is `undefined` (raw prop passed today)**

- [ ] **Step 3: Fix** — `DispatchRenderer.svelte`: `config: props.config` → `config: bindings.renderer.config`. `DispatchCell.svelte`: `config: props.config` → `config: cell.config`.

- [ ] **Step 4: Run tests — PASS**
- [ ] **Step 5: Commit** `fix(svelte): pass resolved config to renderer/cell testers`

### Task 7: Phase 2 wrap-up

- [ ] Full verify: `pnpm lerna run build --scope=@jsonforms/svelte --scope=@jsonforms/svelte-shadcn && pnpm lerna run lint --scope=@jsonforms/svelte && pnpm lerna run test --scope=@jsonforms/svelte --scope=@jsonforms/svelte-shadcn`
- [ ] PR "feat(svelte): binding parity with upstream 3.8.0 vue changes", merge, remove worktree.

---

## Phase 3 — branch `feature/svelte-shadcn-parity` (packages/svelte-shadcn)

### Task 8: CategorizationRenderer visibility filtering

**Files:**
- Modify: `packages/svelte-shadcn/src/layouts/CategorizationRenderer.svelte`
- Test: `packages/svelte-shadcn/tests/layouts/CategorizationRenderer.test.ts` (extend)

**Interfaces:**
- Consumes: `getJsonFormsCategorization` (each category binding exposes reactive `.visible`, `.enabled`, `.uischema`, `.schema`, `.path`, `.renderers`, `.cells`).
- Produces: only visible categories rendered; tab values keyed by ORIGINAL category index (upstream fix `c0c33f51` semantics); active tab resets to first visible when the current one disappears; disabled categories get disabled triggers.

- [ ] **Step 1: Write failing tests** (append to the existing describe; reuse its `schema`):

```ts
const hiddenUischema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'First',
      elements: [{ type: 'Control', scope: '#/properties/a' }],
      rule: {
        effect: 'HIDE',
        condition: { scope: '#/properties/a', schema: { const: 'hide-first' } },
      },
    },
    {
      type: 'Category',
      label: 'Second',
      elements: [{ type: 'Control', scope: '#/properties/b' }],
    },
  ],
} as const;

it('does not render tabs for invisible categories', () => {
  const { queryByText } = render(JsonForms as any, {
    props: {
      schema,
      uischema: hiddenUischema,
      data: { a: 'hide-first', b: 'world' },
      renderers: [categorizationRendererEntry, stringControlRendererEntry],
    },
  });
  expect(queryByText('First')).toBeNull();
  expect(queryByText('Second')).toBeTruthy();
});

it('activates the first visible category and renders its content', () => {
  const { container } = render(JsonForms as any, {
    props: {
      schema,
      uischema: hiddenUischema,
      data: { a: 'hide-first', b: 'world' },
      renderers: [categorizationRendererEntry, stringControlRendererEntry],
    },
  });
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input).toBeTruthy();
  expect(input.value).toBe('world'); // content of the ORIGINAL index-1 category
});
```

- [ ] **Step 2: Run — FAIL (both categories render; first/hidden category is active)**

- [ ] **Step 3: Implement** — replace `CategorizationRenderer.svelte` body:

```svelte
<script lang="ts">
  import { getJsonFormsCategorization, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import Tabs from '../ui/tabs/tabs.svelte';
  import TabsList from '../ui/tabs/tabs-list.svelte';
  import TabsTrigger from '../ui/tabs/tabs-trigger.svelte';
  import TabsContent from '../ui/tabs/tabs-content.svelte';

  let props: LayoutProps = $props();
  const { layout, categories } = getJsonFormsCategorization(props);

  // Preserve the ORIGINAL index when filtering so tab identity is stable
  // even as earlier categories toggle visibility (upstream fix semantics).
  const visibleCategories = $derived(
    categories
      .map((category, originalIndex) => ({ category, originalIndex }))
      .filter((entry) => entry.category.visible)
  );

  let active = $state('');
  $effect(() => {
    const values = visibleCategories.map((e) => String(e.originalIndex));
    if (!values.includes(active)) {
      active = values[0] ?? '';
    }
  });
</script>

{#if layout.visible}
  <Tabs value={active} onValueChange={(v) => { active = v; }}>
    <TabsList>
      {#each visibleCategories as { category, originalIndex } (originalIndex)}
        <TabsTrigger value={String(originalIndex)} disabled={!category.enabled}>
          {(category.uischema as any).label}
        </TabsTrigger>
      {/each}
    </TabsList>
    {#each visibleCategories as { category, originalIndex } (originalIndex)}
      <TabsContent value={String(originalIndex)}>
        {#each (category.uischema as any).elements as el}
          <DispatchRenderer
            schema={category.schema}
            uischema={el}
            path={category.path}
            enabled={category.enabled}
            renderers={category.renderers}
            cells={category.cells}
          />
        {/each}
      </TabsContent>
    {/each}
  </Tabs>
{/if}
```

- [ ] **Step 4: Run package tests — all PASS (existing 3 + new 2)**
- [ ] **Step 5: Commit** `fix(svelte-shadcn): filter invisible categories, key tabs by original index`

### Task 9: TimeControlRenderer

**Files:**
- Create: `packages/svelte-shadcn/src/controls/TimeControlRenderer.svelte`, `packages/svelte-shadcn/src/controls/TimeControlRenderer.ts`
- Modify: `packages/svelte-shadcn/src/controls/index.ts`
- Test: `packages/svelte-shadcn/tests/controls/TimeControlRenderer.test.ts`

**Interfaces:**
- Consumes: `useShadcnControl` (`adaptValue` hook), `getJsonFormsControl`, `ControlWrapper`, `Input` ui primitive.
- Produces: `timeControlRendererEntry` (`{ renderer, tester: rankWith(2, isTimeControl) }`) registered in `controlRenderers`.

- [ ] **Step 1: Write failing tests** (model on the vue-vanilla spec; mount via `JsonForms` like the other control tests in this package):

```ts
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { timeControlRendererEntry } from '../../src/controls/TimeControlRenderer';

const schema = { type: 'string', title: 'My Time', format: 'time' };
const uischema = {
  type: 'Control',
  scope: '#',
  options: { placeholder: 'time placeholder' },
};

const mountProps = (data: string, extra: Record<string, unknown> = {}) => ({
  props: {
    schema,
    uischema,
    data,
    renderers: [timeControlRendererEntry],
    ...extra,
  },
});

describe('TimeControlRenderer', () => {
  it('renders a time input with placeholder', () => {
    const { container } = render(JsonForms as any, mountProps('00:20:00'));
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('time placeholder');
  });

  it('renders title as label', () => {
    const { getByText } = render(JsonForms as any, mountProps('00:20:00'));
    expect(getByText('My Time')).toBeTruthy();
  });

  it('appends seconds when value is HH:MM', async () => {
    let latest: unknown;
    const { container } = render(
      JsonForms as any,
      mountProps('00:20:00', { onchange: (e: { data: unknown }) => (latest = e.data) })
    );
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '01:30' } });
    expect(latest).toBe('01:30:00');
  });

  it('preserves seconds when value is already HH:MM:SS', async () => {
    let latest: unknown;
    const { container } = render(
      JsonForms as any,
      mountProps('00:20:00', { onchange: (e: { data: unknown }) => (latest = e.data) })
    );
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '01:30:45' } });
    expect(latest).toBe('01:30:45');
  });
});
```

- [ ] **Step 2: Run — FAIL (module not found)**

- [ ] **Step 3: Implement**

`TimeControlRenderer.svelte`:

```svelte
<script lang="ts">
  import { getJsonFormsControl, type ControlProps } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Input from '../ui/input/input.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({
    input: getJsonFormsControl(props),
    adaptValue: (value) => {
      const v = (value as string) || undefined;
      // Browsers report HH:MM when seconds are zero; normalize to HH:MM:SS
      // so the value round-trips through AJV 'time' format validation.
      return v && /^\d{2}:\d{2}$/.test(v) ? `${v}:00` : v;
    },
  });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <Input
    id={b.control.id}
    type="time"
    step={typeof b.appliedOptions.step === 'number' ? b.appliedOptions.step : 1}
    placeholder={b.appliedOptions.placeholder}
    value={b.control.data ?? ''}
    disabled={!b.control.enabled}
    oninput={(e) => b.onChange((e.currentTarget as HTMLInputElement).value)}
    onfocus={() => (b.isFocused = true)}
    onblur={() => (b.isFocused = false)}
  />
</ControlWrapper>
```

`TimeControlRenderer.ts`:

```ts
import { rankWith, isTimeControl } from '@jsonforms/core';
import Component from './TimeControlRenderer.svelte';

export const timeControlRendererEntry = {
  renderer: Component,
  tester: rankWith(2, isTimeControl),
};
```

`controls/index.ts`: import and append `timeControlRendererEntry` to `controlRenderers`.

- [ ] **Step 4: Run tests — PASS**
- [ ] **Step 5: Commit** `feat(svelte-shadcn): add TimeControlRenderer`

### Task 10: CategorizationStepperRenderer

**Files:**
- Create: `packages/svelte-shadcn/src/layouts/CategorizationStepperRenderer.svelte`, `packages/svelte-shadcn/src/layouts/CategorizationStepperRenderer.ts`
- Modify: `packages/svelte-shadcn/src/layouts/index.ts`
- Test: `packages/svelte-shadcn/tests/layouts/CategorizationStepperRenderer.test.ts`

**Interfaces:**
- Consumes: `getJsonFormsCategorization`, `useShadcnLayout` (for `appliedOptions.showNavButtons`), `Button` ui primitive (`../ui/button/button.svelte` — check the existing import style in `array/ArrayListRenderer.svelte` and match it), `Separator` (`../ui/separator/separator.svelte`).
- Produces: `categorizationStepperRendererEntry` with tester `rankWith(3, and(isCategorization, categorizationHasCategory, optionIs('variant', 'stepper')))`, registered AFTER `categorizationRendererEntry` in `layoutRenderers`.

- [ ] **Step 1: Write failing tests**:

```ts
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { categorizationStepperRendererEntry } from '../../src/layouts/CategorizationStepperRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

const schema = {
  type: 'object',
  properties: { a: { type: 'string' }, b: { type: 'string' } },
};
const stepperUischema = (extraOptions: Record<string, unknown> = {}) => ({
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'StepA',
      elements: [{ type: 'Control', scope: '#/properties/a' }],
    },
    {
      type: 'Category',
      label: 'StepB',
      elements: [{ type: 'Control', scope: '#/properties/b' }],
    },
  ],
  options: { variant: 'stepper', ...extraOptions },
});
const mount = (uischema: unknown, extra: Record<string, unknown> = {}) =>
  render(JsonForms as any, {
    props: {
      schema,
      uischema,
      data: { a: 'hello', b: 'world' },
      renderers: [categorizationStepperRendererEntry, stringControlRendererEntry],
      ...extra,
    },
  });

describe('CategorizationStepperRenderer', () => {
  it('renders both step labels', () => {
    const { getByText } = mount(stepperUischema());
    expect(getByText('StepA')).toBeTruthy();
    expect(getByText('StepB')).toBeTruthy();
  });

  it('shows only the first step content initially', () => {
    const { container } = mount(stepperUischema());
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(1);
    expect((inputs[0] as HTMLInputElement).value).toBe('hello');
  });

  it('shows nav buttons when showNavButtons is set and Next advances', async () => {
    const { container, getByText } = mount(stepperUischema({ showNavButtons: true }));
    const next = getByText('Next');
    await fireEvent.click(next);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('world');
  });

  it('does not render nav buttons without showNavButtons', () => {
    const { queryByText } = mount(stepperUischema());
    expect(queryByText('Next')).toBeNull();
  });
});
```

- [ ] **Step 2: Run — FAIL (module not found)**

- [ ] **Step 3: Implement**

`CategorizationStepperRenderer.svelte`:

```svelte
<script lang="ts">
  import { getJsonFormsCategorization, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import { useShadcnLayout } from '../util/composition.svelte';
  import Button from '../ui/button/button.svelte';
  import Separator from '../ui/separator/separator.svelte';

  let props: LayoutProps = $props();
  const { layout, categories } = getJsonFormsCategorization(props);
  const shadcn = useShadcnLayout({ input: { layout } });

  const visibleCategories = $derived(
    categories
      .map((category, originalIndex) => ({ category, originalIndex }))
      .filter((entry) => entry.category.visible)
  );

  // Index into visibleCategories (vue-vanilla stepper semantics).
  let selected = $state(0);
  $effect(() => {
    if (selected >= visibleCategories.length) {
      selected = Math.max(0, visibleCategories.length - 1);
    }
  });
</script>

{#if layout.visible}
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      {#each visibleCategories as entry, i (entry.originalIndex)}
        <Button
          variant={selected === i ? 'default' : 'outline'}
          size="sm"
          disabled={!entry.category.enabled}
          onclick={() => (selected = i)}
        >
          <span
            class="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs"
            >{i + 1}</span
          >
          {(entry.category.uischema as any).label}
        </Button>
        {#if i !== visibleCategories.length - 1}
          <Separator class="flex-1" />
        {/if}
      {/each}
    </div>

    {#if visibleCategories[selected]}
      <div class="flex flex-col gap-2">
        {#each (visibleCategories[selected].category.uischema as any).elements as el}
          <DispatchRenderer
            schema={visibleCategories[selected].category.schema}
            uischema={el}
            path={visibleCategories[selected].category.path}
            enabled={visibleCategories[selected].category.enabled}
            renderers={visibleCategories[selected].category.renderers}
            cells={visibleCategories[selected].category.cells}
          />
        {/each}
      </div>
    {/if}

    {#if shadcn.appliedOptions?.showNavButtons}
      <footer class="flex items-center justify-between">
        <div>
          {#if selected > 0}
            <Button
              variant="outline"
              disabled={!visibleCategories[selected - 1].category.enabled}
              onclick={() => (selected = selected - 1)}>Back</Button
            >
          {/if}
        </div>
        <div>
          {#if selected + 1 < visibleCategories.length}
            <Button
              disabled={!visibleCategories[selected + 1].category.enabled}
              onclick={() => (selected = selected + 1)}>Next</Button
            >
          {/if}
        </div>
      </footer>
    {/if}
  </div>
{/if}
```

(Adjust `Button`/`Separator` import paths and prop names to match the actual ui primitives — check `src/ui/button/` and one existing consumer before writing.)

`CategorizationStepperRenderer.ts`:

```ts
import {
  and,
  categorizationHasCategory,
  isCategorization,
  optionIs,
  rankWith,
} from '@jsonforms/core';
import Component from './CategorizationStepperRenderer.svelte';

export const categorizationStepperRendererEntry = {
  renderer: Component,
  tester: rankWith(
    3,
    and(
      isCategorization,
      categorizationHasCategory,
      optionIs('variant', 'stepper')
    )
  ),
};
```

`layouts/index.ts`: import and append `categorizationStepperRendererEntry`.

- [ ] **Step 4: Run tests — PASS (stepper wins over tabs renderer for variant=stepper because rank 3 > 2)**
- [ ] **Step 5: Commit** `feat(svelte-shadcn): add CategorizationStepperRenderer`

### Task 11: Phase 3 wrap-up

- [ ] Full verify: build + lint + test both svelte packages (commands as Task 7).
- [ ] Manual check: `cd packages/svelte-shadcn && pnpm run dev`, open the categorization example, confirm tabs/stepper behavior and the time control (use a schema with `format: time` via the i18n/data editors if no example covers it). Screenshot-level verification is enough; kill the dev server after.
- [ ] PR "feat(svelte-shadcn): renderer parity (categorization fix, Time, Stepper)", merge, remove worktree.

---

## Phase 4 — branch `chore/svelte-infra-hygiene`

### Task 12: Coverage wiring (test-cov)

**Files:**
- Modify: `packages/svelte/package.json`, `packages/svelte/vitest.config.ts`, `packages/svelte-shadcn/package.json`, `packages/svelte-shadcn/vitest.config.ts`

**Interfaces:**
- Produces: `pnpm run test-cov` at root now includes both svelte packages; lcov lands at `packages/<pkg>/coverage/lcov.info` where the root `merge-report` glob (`packages/**/coverage/lcov.info`) picks it up.

- [ ] **Step 1: Add scripts + devDep**

```bash
cd packages/svelte && pnpm pkg set scripts.test-cov="vitest run --coverage"
cd ../svelte-shadcn && pnpm pkg set scripts.test-cov="vitest run --coverage"
cd ../.. && pnpm --dir packages/svelte add -D @vitest/coverage-v8@^2.1.8 && pnpm --dir packages/svelte-shadcn add -D @vitest/coverage-v8@^2.1.8
```

(Match the installed vitest 2.x version; if the merge bumped vitest, match that version instead.)

- [ ] **Step 2: Add coverage config** to BOTH `vitest.config.ts` files, inside `test: {}`:

```ts
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text-summary'],
      include: ['src/**'],
    },
```

- [ ] **Step 3: Verify**

```bash
pnpm lerna run test-cov --scope=@jsonforms/svelte --scope=@jsonforms/svelte-shadcn
ls packages/svelte/coverage/lcov.info packages/svelte-shadcn/coverage/lcov.info
```

Expected: both files exist. Confirm `coverage/` is gitignored in each package (add to the package `.gitignore` if not).

- [ ] **Step 4: Commit** `chore(svelte): wire test-cov so CI coverage job runs svelte tests`

### Task 13: Publish workflow peer-dep rewrite

**Files:**
- Modify: `.github/workflows/publish.yaml` ("Adjust PeerDependencies" step)

- [ ] **Step 1: Append after the `vue-vuetify` line** (same style):

```yaml
          cd ../svelte && pnpm pkg set peerDependencies.@jsonforms/core="${{ github.event.inputs.next_version }}"
          cd ../svelte-shadcn && pnpm pkg set peerDependencies.@jsonforms/core="${{ github.event.inputs.next_version }}" && pnpm pkg set peerDependencies.@jsonforms/svelte="${{ github.event.inputs.next_version }}"
```

- [ ] **Step 2: Validate YAML**: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/publish.yaml'))"` → no error.
- [ ] **Step 3: Commit** `fix(ci): include svelte packages in release peer-dependency rewrite`

### Task 14: Example app fixes + combined examples-app aggregation

**Files:**
- Modify: `packages/svelte-shadcn/example/package.json` (lodash), `packages/svelte-shadcn/example/vite.config.ts` (base), `packages/svelte-shadcn/package.json` (script), `packages/examples-app/prepare-examples-app.js`, `packages/examples-app/index.html`

- [ ] **Step 1: Fix lodash pin**

```bash
cd packages/svelte-shadcn/example && pnpm pkg set dependencies.lodash="^4.17.21"
cd ../../.. && pnpm install --no-frozen-lockfile
```

- [ ] **Step 2: Make the example servable from a subdirectory** — in `example/vite.config.ts` add `base: './',` to the config object (assets must resolve relative when served at `/svelte-shadcn/`).

- [ ] **Step 3: Add aggregation build script** — in `packages/svelte-shadcn/package.json`: `"build:examples-app": "cd example && vite build"` (root `build:examples-app` runs `lerna run build:examples-app`, which will now include this package).

- [ ] **Step 4: Register in the aggregator** — `prepare-examples-app.js` `examples` object, add:

```js
  'svelte-shadcn': join(packagesDir, 'svelte-shadcn', 'example', 'dist'),
```

`index.html`, after the vue-vuetify `<li>`:

```html
      <li><a href="svelte-shadcn">Svelte shadcn Renderers</a></li>
```

- [ ] **Step 5: Verify**

```bash
pnpm run build:examples-app
ls packages/examples-app/dist/svelte-shadcn/index.html
python3 -m http.server 9090 --directory packages/examples-app/dist &
# curl the sub-app, then kill the server
curl -s localhost:9090/svelte-shadcn/ | head -5
```

Expected: dist contains the svelte-shadcn app and it serves.

- [ ] **Step 6: Commit** `feat(examples-app): include svelte-shadcn example; fix lodash pin`

### Task 15: README event-API fix

**Files:**
- Modify: `packages/svelte-shadcn/README.md` (usage snippet), check `packages/svelte/README.md` for the same mistake.

- [ ] **Step 1: Replace** `on:change={(e) => (data = e.detail.data)}` with `onchange={(event) => (data = event.data)}` (JsonForms emits `JsonFormsChangeEvent` objects via the `onchange` callback prop — see `packages/svelte/src/JsonForms.svelte`). Fix in both READMEs if present.
- [ ] **Step 2: Commit** `docs(svelte-shadcn): correct change-event API in usage example`

### Task 16: License headers

**Files:**
- Modify: all files under `packages/svelte/src`, `packages/svelte/tests`, `packages/svelte-shadcn/src`, `packages/svelte-shadcn/tests`, `packages/svelte-shadcn/example/src` lacking a license header.

- [ ] **Step 1: Write insertion script** in the scratchpad (NOT the repo). Header text = the repo-standard block from `packages/core/src/index.ts:1` verbatim (MIT / EclipseSource Munich — the svelte code is derived from the vue packages carrying that header). Rules:
  - `.ts` / `.svelte.ts`: prepend the `/* ... */` block + blank line.
  - `.svelte`: prepend the same text wrapped in `<!-- ... -->` + blank line (before `<script>`).
  - Skip files already containing `The MIT License`. Skip `dist/`, `.svelte-kit/`, config files (`*.config.ts`), `d.ts` outputs.
- [ ] **Step 2: Run script; spot-check 3 files of each type; `git diff --stat` should touch ~100+ files with header-only additions.**
- [ ] **Step 3: Verify nothing broke**: build + lint + test both packages (svelte-check must still pass — HTML comments before `<script>` are valid).
- [ ] **Step 4: Commit** `chore(svelte): add MIT license headers to source files`

### Task 17: Phase 4 wrap-up

- [ ] Full-repo verify: `pnpm run build && pnpm run test` (and `pnpm run lint` if time allows — CI runs it anyway).
- [ ] PR "chore: svelte infra hygiene (coverage, publish, examples-app, docs, headers)", merge, remove worktree.
- [ ] Final report to user: summary of all merged PRs and any deviations from this plan.
