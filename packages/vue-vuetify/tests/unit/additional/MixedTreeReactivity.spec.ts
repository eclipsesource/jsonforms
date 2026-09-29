import { afterAll, afterEach, beforeEach, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { flushPromises } from '@vue/test-utils';
import type { JsonSchema7 } from '@jsonforms/core';
import { extendedVuetifyRenderers } from '../../../src';
import * as tree from '../../../src/util/mixedTree';
import { mountJsonForms } from '../util';

const wrappers: ReturnType<typeof mountJsonForms>[] = [];
const build = vi.spyOn(tree, 'buildTreeFromData');
afterAll(() => build.mockRestore());
const scrollIntoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
);
beforeEach(() => {
  build.mockClear();
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});
afterEach(async () => {
  await flushPromises();
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  if (scrollIntoView)
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollIntoView',
      scrollIntoView,
    );
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
});
const mountTree = (
  data: unknown,
  treeSchema: JsonSchema7 = { type: ['object', 'null'] },
  options = {},
) => {
  const wrapper = mountJsonForms(
    data,
    {
      type: 'object',
      properties: { tree: treeSchema, outside: { type: 'number' } },
    },
    extendedVuetifyRenderers,
    { type: 'Control', scope: '#/properties/tree', options },
  );
  wrappers.push(wrapper);
  return wrapper;
};
const builds = () =>
  build.mock.calls.filter((args) => args[3] === 'tree').length;

it('does not traverse a large unchanged subtree for unrelated form updates', async () => {
  const data = Object.fromEntries(
    Array.from({ length: 200 }, (_, i) => [`key${i}`, { value: i }]),
  );
  // Exclude the detail form's hundreds of input widgets from this traversal test.
  const wrapper = mountTree({ tree: data, outside: 0 }, undefined, {
    detail: { type: 'VerticalLayout', elements: [] },
  });
  await flushPromises();
  const before = builds();
  for (let i = 1; i <= 10; i++) {
    await wrapper.setProps({ data: { tree: data, outside: i } });
    await nextTick();
  }
  const traversals = builds() - before;
  console.info(
    `Unrelated edits: 10; tree nodes: 401; full tree traversals: ${traversals}`,
  );
  expect(traversals).toBe(0);
});

it('refreshes types, structure and schema restrictions after external changes', async () => {
  const wrapper = mountTree({ tree: { child: 1 }, outside: 0 });
  const before = builds();
  await wrapper.setProps({
    data: { tree: { child: { nested: true } }, outside: 0 },
  });
  await flushPromises();
  expect(builds()).toBeGreaterThan(before);
  expect(
    build.mock.results[build.mock.results.length - 1]?.value[0].children[0]
      .jsonType,
  ).toBe('object');
  const schema: JsonSchema7 = {
    type: 'object',
    properties: { tree: { type: ['object', 'null'], readOnly: true } },
  };
  await wrapper.setProps({ schema });
  await flushPromises();
  const nodes = tree.flattenTree(
    build.mock.results[build.mock.results.length - 1]?.value,
  );
  expect(nodes.every((node) => node.control.readonly && !node.canDelete)).toBe(
    true,
  );
});

it('refreshes permissions without data changes and keeps the selected detail current', async () => {
  const wrapper = mountTree(
    { tree: { child: 1 }, outside: 0 },
    { type: ['object', 'null'], minProperties: 1 },
  );
  const vm = wrapper.findComponent({ name: 'mixed-renderer' })
    .vm as unknown as {
    toggleShowPrimitives(): void;
    activatedTreeNodes: string[];
    selectedNode: tree.MixedTreeNode;
  };
  vm.toggleShowPrimitives();
  await nextTick();
  vm.activatedTreeNodes = [tree.toTreeNodeId('tree.child')];
  await nextTick();
  expect(vm.selectedNode.canDelete).toBe(true);
  await wrapper.setProps({ config: { restrict: true } });
  await nextTick();
  expect(vm.selectedNode.canDelete).toBe(false);
  await wrapper.setProps({
    config: { readonly: true, separateReadonlyFromDisabled: true },
  });
  await nextTick();
  expect(vm.selectedNode.control.readonly).toBe(true);
  await wrapper.setProps({ config: { readonly: false } });
  await nextTick();
  expect(vm.selectedNode.control.readonly).toBe(false);
  const before = builds();
  const input = wrapper
    .findAll('input')
    .find((input) => input.element.value === '1')!;
  await input.setValue('2');
  await vi.waitFor(() => expect(wrapper.vm.event.data.tree.child).toBe(2));
  expect(builds()).toBeGreaterThan(before);
  expect(vm.activatedTreeNodes).toEqual([tree.toTreeNodeId('tree.child')]);
});
