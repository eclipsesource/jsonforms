import { nextTick } from 'vue';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import type { JsonSchema } from '@jsonforms/core';
import { extendedVuetifyRenderers } from '../../../src';
import { flattenTree, type MixedTreeNode } from '../../../src/util/mixedTree';
import { mountJsonForms } from '../util';

// jsdom does not implement scrolling; Vuetify scrolls the newly selected node.
const scrollIntoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
);
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});
afterAll(() => {
  if (scrollIntoView)
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollIntoView',
      scrollIntoView,
    );
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
});

type RenameVM = {
  treeNodes: MixedTreeNode[];
  renameValue: string;
  renameError: string | null;
  toggleShowPrimitives: () => void;
  startRename: (node: MixedTreeNode | string) => void;
  commitRename: (node: MixedTreeNode) => void;
  renameProperty: (name: string) => void;
  renamePropertyDisabled: (name: string) => boolean;
  newPropertyName: string;
  addProperty: () => void;
};

const mountRename = async (
  tree: boolean,
  schema: JsonSchema = {},
  config = {},
) => {
  const wrapper = mountJsonForms(
    { first: 1, dynamic: 2, last: 3 },
    {
      type: tree ? ['object', 'string'] : 'object',
      additionalProperties: { type: 'number' },
      ...schema,
    },
    extendedVuetifyRenderers,
    { type: 'Control', scope: '#' },
    config,
  );
  const vm = wrapper.findComponent({
    name: tree ? 'mixed-renderer' : 'additional-properties',
  }).vm as unknown as RenameVM;
  if (tree) {
    vm.toggleShowPrimitives();
    await nextTick();
  }
  const node = tree
    ? flattenTree(vm.treeNodes).find((node) => node.control.path === 'dynamic')!
    : undefined;
  return {
    wrapper,
    vm,
    start: () => vm.startRename(node ?? 'dynamic'),
    commit: () =>
      tree ? vm.commitRename(node!) : vm.renameProperty('dynamic'),
  };
};

describe.each([false, true])('rename permissions (tree=%s)', (tree) => {
  it.each([
    { readonly: true, separateReadonlyFromDisabled: true },
    { readonly: true },
    { restrict: true },
  ])('rechecks permissions after editing begins: %j', async (config) => {
    const { wrapper, vm, start, commit } = await mountRename(tree, {
      required: ['dynamic'],
    });
    start();
    vm.renameValue = 'renamed';
    await wrapper.setProps({ config });
    commit();
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ first: 1, dynamic: 2, last: 3 });
    await flushPromises();
    wrapper.unmount();
  });

  it('preserves value and order without enforcing property-count limits on rename', async () => {
    const { wrapper, vm, start, commit } = await mountRename(
      tree,
      { minProperties: 3, maxProperties: 3 },
      { restrict: true },
    );
    start();
    vm.renameValue = 'renamed';
    commit();
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ first: 1, renamed: 2, last: 3 });
    expect(Object.keys(wrapper.vm.event.data)).toEqual([
      'first',
      'renamed',
      'last',
    ]);
    await flushPromises();
    wrapper.unmount();
  });

  it('allows renaming a required dynamic name when restrict is off', async () => {
    const { wrapper, vm, start, commit } = await mountRename(tree, {
      required: ['dynamic'],
    });
    start();
    vm.renameValue = 'renamed';
    commit();
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ first: 1, renamed: 2, last: 3 });
    await flushPromises();
    wrapper.unmount();
  });

  it.each([false, true])(
    'reserves absent declared names with restrict=%s',
    async (restrict) => {
      const { wrapper, vm, start, commit } = await mountRename(
        tree,
        {
          properties: { fixed: { type: 'number' } },
          patternProperties: { '^fixed$': { type: 'number' } },
        },
        { restrict },
      );
      start();
      vm.renameValue = 'fixed';
      if (!tree) expect(vm.renamePropertyDisabled('dynamic')).toBe(true);
      commit();
      await nextTick();
      expect(vm.renameError).toContain('already defined');
      expect(wrapper.vm.event.data).toEqual({ first: 1, dynamic: 2, last: 3 });
      // A rejected attempt must not prevent a subsequent valid rename.
      vm.renameValue = 'available';
      commit();
      await nextTick();
      expect(wrapper.vm.event.data).toEqual({
        first: 1,
        available: 2,
        last: 3,
      });
      await flushPromises();
      wrapper.unmount();
    },
  );

  it('keeps shared name validation active', async () => {
    const { wrapper, vm, start, commit } = await mountRename(tree, {
      propertyNames: { minLength: 5 },
      patternProperties: { '^dynamic': { type: 'number' } },
      additionalProperties: false,
    });
    start();
    vm.renameValue = 'wrong_name';
    commit();
    await nextTick();
    expect(vm.renameError).toBeTruthy();
    expect(wrapper.vm.event.data.dynamic).toBe(2);
    await flushPromises();
    wrapper.unmount();
  });
});

it('uses the resolved tuple item schema for tree rename', async () => {
  const wrapper = mountJsonForms(
    [{ old: {} }, { old: {} }],
    {
      type: ['array', 'string'],
      items: [
        { type: 'object', propertyNames: { pattern: '^first' } },
        { $ref: '#/definitions/second' },
      ],
      definitions: {
        second: { type: 'object', propertyNames: { pattern: '^second' } },
      },
    } as JsonSchema,
    extendedVuetifyRenderers,
    { type: 'Control', scope: '#' },
  );
  const vm = wrapper.findComponent({ name: 'mixed-renderer' })
    .vm as unknown as RenameVM;
  const node = flattenTree(vm.treeNodes).find(
    (node) => node.control.path === '1.old',
  )!;
  vm.startRename(node);
  vm.renameValue = 'firstName';
  vm.commitRename(node);
  await nextTick();
  expect(vm.renameError).toBeTruthy();
  expect(wrapper.vm.event.data).toEqual([{ old: {} }, { old: {} }]);
  vm.renameValue = 'secondName';
  vm.commitRename(node);
  await nextTick();
  expect(wrapper.vm.event.data).toEqual([{ old: {} }, { secondName: {} }]);
  await flushPromises();
  wrapper.unmount();
});

it('rejects adding an absent declared key in the submission handler', async () => {
  const { wrapper, vm } = await mountRename(false, {
    properties: { fixed: { type: 'number' } },
  });
  vm.newPropertyName = 'fixed';
  vm.addProperty();
  await nextTick();
  expect(wrapper.vm.event.data).toEqual({ first: 1, dynamic: 2, last: 3 });
  await flushPromises();
  wrapper.unmount();
});
