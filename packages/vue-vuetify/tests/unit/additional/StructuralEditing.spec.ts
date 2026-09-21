import type { ControlElement } from '@jsonforms/core';
import type { JsonSchema7 as JsonSchema } from '@jsonforms/core';
import { nextTick } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VSelect } from 'vuetify/components';
import { extendedVuetifyRenderers } from '../../../src';
import {
  buildTreeFromData,
  flattenTree,
  type MixedTreeNode,
} from '../../../src/util/mixedTree';
import { mountJsonForms } from '../util';

type EditorVM = {
  control: { path: string };
  treeNodes: MixedTreeNode[];
  deleteNode: (node: MixedTreeNode) => void;
  confirmDelete: () => void;
  selectedNode: MixedTreeNode;
  treeSearch: string;
  activatedTreeNodes: string[];
  mixedRenderInfos: { index: number; resolvedSchema: JsonSchema }[];
  selectedIndex: number;
  handleSelectChange: (index: number | null) => void;
  toggleShowPrimitives: () => void;
  renameValue: string;
  renamingNodeId: string | null;
  renamingPropertyName: string | null;
  startRename: (node: MixedTreeNode | string) => void;
  commitRename: (node: MixedTreeNode) => void;
  renameProperty: (name: string) => void;
  newPropertyName: string;
  addProperty: () => void;
  removeProperty: (name: string) => void;
  additionalPropertyItems: { propertyName: string; schema: JsonSchema }[];
};
const wrappers: ReturnType<typeof mountJsonForms>[] = [];
const scrollIntoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
);
const mountEditor = (
  data: unknown,
  schema: JsonSchema,
  config = {},
  uischema: ControlElement = { type: 'Control', scope: '#' },
) => {
  const wrapper = mountJsonForms(
    data,
    schema,
    extendedVuetifyRenderers,
    uischema,
    config,
  );
  wrappers.push(wrapper);
  return wrapper;
};
const vmOf = (wrapper: ReturnType<typeof mountJsonForms>, name: string) =>
  wrapper.findComponent({ name }).vm as unknown as EditorVM;
beforeEach(() => {
  // Vuetify scrolls activated tree nodes; jsdom has no scrolling implementation.
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

describe('AdditionalProperties structural mutations', () => {
  it.each([
    {
      schema: { required: ['key'] },
      config: { restrict: true },
      action: 'delete',
    },
    {
      schema: { minProperties: 1 },
      config: { restrict: true },
      action: 'delete',
    },
    { schema: { maxProperties: 1 }, config: { restrict: true }, action: 'add' },
    { schema: {}, config: { readonly: true }, action: 'add' },
    { schema: {}, config: { readonly: true }, action: 'delete' },
    {
      schema: {},
      config: { readonly: true, separateReadonlyFromDisabled: true },
      action: 'add',
    },
    {
      schema: {},
      config: { readonly: true, separateReadonlyFromDisabled: true },
      action: 'delete',
    },
  ])(
    'guards the $action handler with $schema and $config',
    async ({ schema, config, action }) => {
      const wrapper = mountEditor(
        { key: 1 },
        { type: 'object', additionalProperties: { type: 'number' }, ...schema },
      );
      const vm = vmOf(wrapper, 'additional-properties');
      vm.newPropertyName = 'newKey';
      // Invoke the captured handler after permissions change, bypassing button state.
      await wrapper.setProps({ config });
      if (action === 'add') vm.addProperty();
      else vm.removeProperty('key');
      await nextTick();
      expect(wrapper.vm.event.data).toEqual({ key: 1 });
      expect(
        vm.additionalPropertyItems.map((item) => item.propertyName),
      ).toEqual(['key']);
    },
  );

  it('disables Delete for a required key but permits deleting an optional key', async () => {
    const wrapper = mountEditor(
      { key: 1, optional: 2 },
      {
        type: 'object',
        additionalProperties: { type: 'number' },
        required: ['key'],
      },
      { restrict: true },
    );
    const rows = wrapper.findAll('.additional-property-row');
    expect(
      rows[0].findAll('button').slice(-1)[0].attributes('disabled'),
    ).toBeDefined();
    expect(
      rows[1].findAll('button').slice(-1)[0].attributes('disabled'),
    ).toBeUndefined();
    vmOf(wrapper, 'additional-properties').removeProperty('optional');
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ key: 1 });
  });

  it('allows structural edits when restrict is false', async () => {
    const wrapper = mountEditor(
      { key: 1 },
      {
        type: 'object',
        additionalProperties: { type: 'number' },
        required: ['key'],
        minProperties: 1,
        maxProperties: 1,
      },
      { restrict: false },
    );
    const vm = vmOf(wrapper, 'additional-properties');
    vm.newPropertyName = 'newKey';
    vm.addProperty();
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ key: 1, newKey: 0 });
    vm.removeProperty('key');
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ newKey: 0 });
  });

  it('refreshes delegated schemas and ownership without changing data keys', async () => {
    const wrapper = mountEditor(
      { key: 1, fixed: 2 },
      { type: 'object', additionalProperties: { type: 'number' } },
    );
    const vm = vmOf(wrapper, 'additional-properties');
    await wrapper.setProps({
      schema: {
        type: 'object',
        properties: { fixed: { type: 'number' } },
        additionalProperties: { type: 'string', minLength: 5 },
      },
    });
    expect(vm.additionalPropertyItems.map((item) => item.propertyName)).toEqual(
      ['key'],
    );
    expect(vm.additionalPropertyItems[0].schema).toMatchObject({
      type: 'string',
      minLength: 5,
    });
    expect(wrapper.vm.event.data).toEqual({ key: 1, fixed: 2 });
  });
});

describe.each([false, true])('pending rename (tree=%s)', (tree) => {
  it('discards a draft when external data replaces the same key', async () => {
    const wrapper = mountEditor(
      { key: 1 },
      {
        type: tree ? ['object', 'string'] : 'object',
        additionalProperties: { type: 'number' },
      },
    );
    const vm = vmOf(wrapper, tree ? 'mixed-renderer' : 'additional-properties');
    if (tree) {
      vm.toggleShowPrimitives();
      await nextTick();
    }
    const node = tree
      ? flattenTree(vm.treeNodes).find((node) => node.control.path === 'key')!
      : undefined;
    vm.startRename(node ?? 'key');
    vm.renameValue = 'renamed';
    await wrapper.setProps({ data: { key: 99 } });
    // A late Enter/blur from the obsolete editor must not rename the replacement.
    if (tree) vm.commitRename(node!);
    else vm.renameProperty('key');
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ key: 99 });
    expect(tree ? vm.renamingNodeId : vm.renamingPropertyName).toBeNull();
  });
});

describe('MixedRenderer type editing', () => {
  it('does not reset an already selected type', async () => {
    const wrapper = mountEditor('keep me', {
      type: ['string', 'number'],
      default: 'default',
    });
    const vm = vmOf(wrapper, 'mixed-renderer');
    vm.handleSelectChange(vm.selectedIndex);
    await nextTick();
    expect(wrapper.vm.event.data).toBe('keep me');
  });

  it.each([
    { readonly: true },
    { readonly: true, separateReadonlyFromDisabled: true },
  ])('rechecks type-change permissions with %j', async (config) => {
    const wrapper = mountEditor('keep me', { type: ['string', 'number'] });
    const vm = vmOf(wrapper, 'mixed-renderer');
    const numberIndex = vm.mixedRenderInfos.find(
      (info) => info.resolvedSchema.type === 'number',
    )!.index;
    await wrapper.setProps({ config });
    vm.handleSelectChange(numberIndex);
    await nextTick();
    expect(wrapper.vm.event.data).toBe('keep me');
  });

  it('prevents clearing a homogeneous array slot while allowing JSON null', async () => {
    const wrapper = mountEditor(['keep'], {
      type: 'array',
      items: { type: ['string', 'number', 'null'] },
    });
    const mixed = wrapper.findComponent({ name: 'mixed-renderer' });
    expect(mixed.exists()).toBe(true);
    const vm = mixed.vm as unknown as EditorVM;
    expect(mixed.findComponent(VSelect).props('clearable')).toBe(false);
    vm.handleSelectChange(null);
    await nextTick();
    expect(wrapper.vm.event.data).toEqual(['keep']);
    vm.handleSelectChange(
      vm.mixedRenderInfos.find((info) => info.resolvedSchema.type === 'null')!
        .index,
    );
    await nextTick();
    expect(wrapper.vm.event.data).toEqual([null]);
  });

  it.each([
    { value: { name: 'Ada' }, type: 'object' },
    { value: null, type: 'null' },
  ])(
    'allows changing the selected $type node using its original union',
    async ({ value }) => {
      const wrapper = mountEditor(
        { child: value },
        {
          type: ['object', 'string'],
          properties: {
            child: {
              type: ['object', 'string', 'null'],
              properties: { name: { type: 'string' } },
            },
          },
        },
      );
      const root = vmOf(wrapper, 'mixed-renderer');
      root.toggleShowPrimitives();
      await nextTick();
      root.activatedTreeNodes = ['$path:child'];
      await nextTick();
      const detail = wrapper.find('.mixed-detail-pane');
      const selected = detail.findComponent({ name: 'mixed-renderer' });
      expect(selected.exists()).toBe(true);
      expect(detail.find('.mixed-nested-complex').exists()).toBe(false);
      const vm = selected.vm as unknown as EditorVM;
      vm.handleSelectChange(
        vm.mixedRenderInfos.find(
          (info) => info.resolvedSchema.type === 'string',
        )!.index,
      );
      await nextTick();
      expect(wrapper.vm.event.data).toEqual({ child: '' });
    },
  );

  it('uses object-detail in the workspace root instead of generating every field', () => {
    const wrapper = mountEditor(
      { shown: 'visible', hidden: 'secret' },
      {
        type: ['object', 'string'],
        properties: { shown: { type: 'string' }, hidden: { type: 'string' } },
      },
      {},
      {
        type: 'Control',
        scope: '#',
        options: {
          'object-detail': {
            type: 'VerticalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/shown',
                label: 'Chosen field',
              },
            ],
          },
        },
      },
    );
    const detail = wrapper.find('.mixed-detail-pane');
    expect(detail.text()).toContain('Chosen field');
    expect(
      detail.findAll('input').map((input) => input.element.value),
    ).not.toContain('secret');
  });
});

it('enforces parent constraints from every matching pattern, including references', () => {
  const schema: JsonSchema = {
    type: 'object',
    patternProperties: {
      '^parent': { type: 'object' },
      parent$: { $ref: '#/definitions/limits' },
    },
    definitions: {
      limits: {
        type: 'object',
        required: ['key'],
        minProperties: 2,
        propertyNames: { pattern: '^key' },
      },
    },
  };
  const nodes = flattenTree(
    buildTreeFromData(
      { parent: { key: 1, keyOther: 2 } },
      schema,
      schema,
      '',
      '',
      true,
      false,
      true,
      (index) => `${index}`,
      true,
    ),
  );
  expect(
    nodes.find((node) => node.control.path === 'parent.key'),
  ).toMatchObject({ canRename: false, canDelete: false });
  expect(
    nodes.find((node) => node.control.path === 'parent.keyOther')?.canDelete,
  ).toBe(false);
  expect(
    nodes.find((node) => node.control.path === 'parent')?.control.schema,
  ).toHaveProperty('propertyNames');
});

describe.each([false, true])(
  'pending rename during array reorder (tree=%s)',
  (tree) => {
    it('does not apply an obsolete rename to the new item at index zero', async () => {
      const wrapper = mountEditor([{ key: 1 }, { key: 2 }], {
        type: tree ? ['array', 'string'] : 'array',
        items: { type: 'object', additionalProperties: { type: 'number' } },
      });
      const vm = vmOf(
        wrapper,
        tree ? 'mixed-renderer' : 'additional-properties',
      );
      if (tree) {
        vm.toggleShowPrimitives();
        await nextTick();
      }
      const node = tree
        ? flattenTree(vm.treeNodes).find(
            (node) => node.control.path === '0.key',
          )!
        : undefined;
      vm.startRename(node ?? 'key');
      vm.renameValue = 'renamed';
      await wrapper.setProps({ data: [{ key: 2 }, { key: 1 }] });
      if (tree) vm.commitRename(node!);
      else vm.renameProperty('key');
      await nextTick();
      expect(wrapper.vm.event.data).toEqual([{ key: 2 }, { key: 1 }]);
    });
  },
);

it('refreshes dynamic editors when only the referenced root definition changes', async () => {
  const schema: JsonSchema = {
    type: 'object',
    additionalProperties: { $ref: '#/definitions/value' },
    definitions: { value: { type: 'number' } },
  };
  const wrapper = mountEditor({ key: 1 }, schema);
  const vm = vmOf(wrapper, 'additional-properties');
  const updatedSchema: JsonSchema = {
    ...schema,
    definitions: { value: { type: 'string' } },
  };
  await wrapper.setProps({ schema: updatedSchema });
  expect(vm.additionalPropertyItems[0].schema.type).toBe('string');
  expect(wrapper.vm.event.data).toEqual({ key: 1 });
});

it('gives object-detail precedence over general detail at a non-root scope', () => {
  const wrapper = mountEditor(
    { profile: { shown: 'visible', hidden: 'secret' } },
    {
      type: 'object',
      properties: {
        profile: {
          type: ['object', 'string'],
          properties: { shown: { type: 'string' }, hidden: { type: 'string' } },
        },
      },
    },
    {},
    {
      type: 'Control',
      scope: '#/properties/profile',
      options: {
        detail: {
          type: 'VerticalLayout',
          elements: [{ type: 'Control', scope: '#/properties/hidden' }],
        },
        'object-detail': {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/shown',
              label: 'Chosen field',
            },
          ],
        },
      },
    },
  );
  const detail = wrapper.find('.mixed-detail-pane');
  expect(detail.text()).toContain('Chosen field');
  expect(
    detail.findAll('input').map((input) => input.element.value),
  ).not.toContain('secret');
});

it('preserves a nested control’s object-detail when selecting it directly in the tree', async () => {
  const wrapper = mountEditor(
    { child: { shown: 'visible', hidden: 'secret' } },
    {
      type: ['object', 'string'],
      properties: {
        child: {
          type: ['object', 'string'],
          properties: { shown: { type: 'string' }, hidden: { type: 'string' } },
        },
      },
    },
    {},
    {
      type: 'Control',
      scope: '#',
      options: {
        'object-detail': {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/child',
              options: {
                'object-detail': {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/shown',
                      label: 'Nested chosen field',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  );
  vmOf(wrapper, 'mixed-renderer').activatedTreeNodes = ['$path:child'];
  await nextTick();
  const detail = wrapper.find('.mixed-detail-pane');
  expect(detail.text()).toContain('Nested chosen field');
  expect(
    detail.findAll('input').map((input) => input.element.value),
  ).not.toContain('secret');
});

it('validates rename against a referenced propertyNames from the second parent pattern', async () => {
  const wrapper = mountEditor(
    { parent: { key: 1 } },
    {
      type: ['object', 'string'],
      patternProperties: {
        '^parent': { type: 'object' },
        parent$: {
          type: 'object',
          propertyNames: { $ref: '#/definitions/name' },
        },
      },
      definitions: { name: { type: 'string', pattern: '^allowed' } },
    },
  );
  const vm = vmOf(wrapper, 'mixed-renderer');
  vm.toggleShowPrimitives();
  await nextTick();
  const node = flattenTree(vm.treeNodes).find(
    (node) => node.control.path === 'parent.key',
  )!;
  vm.startRename(node);
  vm.renameValue = 'wrong';
  vm.commitRename(node);
  await nextTick();
  expect(wrapper.vm.event.data).toEqual({ parent: { key: 1 } });
  vm.renameValue = 'allowedName';
  vm.commitRename(node);
  await nextTick();
  expect(wrapper.vm.event.data).toEqual({ parent: { allowedName: 1 } });
});

it('renders one editor when several parent patterns constrain the same object', async () => {
  const wrapper = mountEditor(
    { parent: { key: 1 } },
    {
      type: ['object', 'string'],
      patternProperties: {
        '^parent': { type: 'object', additionalProperties: { type: 'number' } },
        parent$: { type: 'object', minProperties: 1 },
      },
    },
  );
  vmOf(wrapper, 'mixed-renderer').activatedTreeNodes = ['$path:parent'];
  await nextTick();
  expect(
    wrapper.find('.mixed-detail-pane').findAll('.additional-properties-card'),
  ).toHaveLength(1);
});

it('keeps the renamed property selected and editable when search hides its row', async () => {
  const wrapper = mountEditor(
    { customer: { name: 'Ada' } },
    {
      type: ['object', 'string'],
      additionalProperties: {
        type: 'object',
        properties: { name: { type: 'string' } },
      },
    },
  );
  const vm = vmOf(wrapper, 'mixed-renderer');
  vm.treeSearch = 'customer';
  vm.activatedTreeNodes = ['$path:customer'];
  await nextTick();
  const node = flattenTree(vm.treeNodes).find(
    (node) => node.control.path === 'customer',
  )!;
  vm.startRename(node);
  vm.renameValue = 'client';
  vm.commitRename(node);
  await flushPromises();
  expect(vm.treeSearch).toBe('customer');
  expect(vm.activatedTreeNodes).toEqual(['$path:client']);
  expect(wrapper.find('.mixed-detail-pane').find('input').element.value).toBe(
    'Ada',
  );
  // Vuetify hides filtered rows through its stylesheet, which jsdom does not load.
  const renamedTitle = wrapper
    .findAll('.mixed-tree-title')
    .find((title) => title.text() === 'client')!;
  expect(
    renamedTitle.element.closest('.v-treeview-item--filtered'),
  ).not.toBeNull();
  await wrapper.find('.mixed-detail-pane').find('input').setValue('Grace');
  await wrapper.find('.mixed-detail-pane').find('input').trigger('blur');
  await flushPromises();
  expect(wrapper.vm.event.data).toEqual({ client: { name: 'Grace' } });
  vm.treeSearch = '';
  await flushPromises();
  expect(vm.activatedTreeNodes).toEqual(['$path:client']);
  expect(
    wrapper
      .findAll('.mixed-tree-title')
      .find((title) => title.text() === 'client')!
      .element.closest('.v-treeview-item--filtered'),
  ).toBeNull();
});

it('keeps the selected detail when the primitive toggle hides its row', async () => {
  const wrapper = mountEditor(
    { value: 'keep editing' },
    {
      type: ['object', 'string'],
      additionalProperties: { type: 'string' },
    },
  );
  const vm = vmOf(wrapper, 'mixed-renderer');
  vm.toggleShowPrimitives();
  await nextTick();
  vm.activatedTreeNodes = ['$path:value'];
  await nextTick();
  vm.toggleShowPrimitives();
  await flushPromises();
  expect(vm.activatedTreeNodes).toEqual(['$path:value']);
  expect(
    flattenTree(vm.treeNodes).some((node) => node.control.path === 'value'),
  ).toBe(false);
  expect(wrapper.find('.mixed-detail-pane').find('input').element.value).toBe(
    'keep editing',
  );
  // Actual removal, unlike filtering, must reconcile to a surviving node.
  await wrapper.setProps({ data: {} });
  expect(vm.activatedTreeNodes).toEqual(['$root']);
});

it('keeps the detail panel after a selected object becomes a hidden primitive', async () => {
  const wrapper = mountEditor(
    { child: {} },
    {
      type: ['object', 'string'],
      additionalProperties: { type: ['object', 'string'] },
    },
  );
  const root = vmOf(wrapper, 'mixed-renderer');
  root.activatedTreeNodes = ['$path:child'];
  await nextTick();
  const selected = wrapper
    .find('.mixed-detail-pane')
    .findComponent({ name: 'mixed-renderer' }).vm as unknown as EditorVM;
  selected.handleSelectChange(
    selected.mixedRenderInfos.find(
      (info) => info.resolvedSchema.type === 'string',
    )!.index,
  );
  await flushPromises();
  expect(root.activatedTreeNodes).toEqual(['$path:child']);
  expect(
    flattenTree(root.treeNodes).some((node) => node.control.path === 'child'),
  ).toBe(false);
  expect(
    wrapper.find('.mixed-detail-pane').find('.mixed-primitive').exists(),
  ).toBe(true);
  expect(wrapper.vm.event.data).toEqual({ child: '' });
});

describe('MixedRenderer selection after deletion', () => {
  it.each([
    {
      data: ['Alice', 'Bob', 'Carol'],
      selected: '2',
      deleted: '0',
      expected: '1',
      value: 'Carol',
    },
    {
      data: ['Alice', 'Bob', 'Carol'],
      selected: '1',
      deleted: '0',
      expected: '0',
      value: 'Bob',
    },
    {
      data: { people: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }] },
      selected: 'people.2.name',
      deleted: 'people.0',
      expected: 'people.1.name',
      value: 'Carol',
    },
    {
      data: ['Alice', 'Bob', 'Carol'],
      selected: '0',
      deleted: '2',
      expected: '0',
      value: 'Alice',
    },
    {
      data: { item: 1, itemCode: 'keep' },
      selected: 'itemCode',
      deleted: 'item',
      expected: 'itemCode',
      value: 'keep',
    },
    // Index 10 is a sibling of index 1, and shifts to 9 rather than selecting the parent.
    {
      data: Array.from({ length: 11 }, (_, i) => `Item ${i}`),
      selected: '10',
      deleted: '1',
      expected: '9',
      value: 'Item 10',
    },
    {
      data: { parent: { child: 1, keep: 2 } },
      selected: 'parent.child',
      deleted: 'parent.child',
      expected: 'parent',
      value: { keep: 2 },
    },
    {
      data: { parent: { child: { name: 'Alice' }, keep: 2 } },
      selected: 'parent.child.name',
      deleted: 'parent.child',
      expected: 'parent',
      value: { keep: 2 },
    },
  ])(
    'keeps the correct target when deleting $deleted with $selected selected',
    async ({ data, selected, deleted, expected, value }) => {
      const wrapper = mountEditor(data, { type: ['object', 'array', 'null'] });
      const vm = vmOf(wrapper, 'mixed-renderer');
      vm.toggleShowPrimitives();
      await nextTick();
      vm.activatedTreeNodes = [`$path:${selected}`];
      await nextTick();
      const node = flattenTree(vm.treeNodes).find(
        (node) => node.control.path === deleted,
      )!;
      vm.deleteNode(node);
      vm.confirmDelete();
      await nextTick();
      expect(vm.activatedTreeNodes).toEqual([`$path:${expected}`]);
      expect(vm.selectedNode.control.path).toBe(expected);
      const selectedValue = expected
        .split('.')
        .reduce((data, key) => data[key], wrapper.vm.event.data);
      expect(selectedValue).toEqual(value);
    },
  );
});
