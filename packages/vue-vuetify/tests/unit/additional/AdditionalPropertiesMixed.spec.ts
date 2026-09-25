import type { MixedTreeNode } from '../../../src/util/mixedTree';
import { clearAllIds } from '@jsonforms/core';
import { nextTick } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { extendedVuetifyRenderers } from '../../../src';
import { mountJsonForms } from '../util';

describe('AdditionalProperties mixed values', () => {
  const schema = {
    type: 'object' as const,
    additionalProperties: {},
  };
  const uischema = { type: 'Control' as const, scope: '#' };

  beforeEach(() => {
    clearAllIds();
  });

  const mountDeletion = (value: unknown = { nested: true }, config = {}) => {
    const wrapper = mountJsonForms(
      { child: value },
      { type: ['object', 'string'], minProperties: 1 },
      extendedVuetifyRenderers,
      uischema,
      config,
    );
    const vm = wrapper.findComponent({ name: 'mixed-renderer' })
      .vm as unknown as {
      treeNodes: MixedTreeNode[];
      pendingDeleteNode: MixedTreeNode | null;
      deleteNode: (node: MixedTreeNode) => void;
      confirmDelete: () => void;
    };
    return { wrapper, vm, node: vm.treeNodes[0].children![0] };
  };

  it.each([{ value: { nested: true } }, { value: [true] }])(
    'requires confirmation for nonempty %j and supports cancellation',
    async ({ value }) => {
      const { wrapper, vm, node } = mountDeletion(value);
      vm.deleteNode(node);
      await nextTick();
      expect(vm.pendingDeleteNode?.nodeId).toBe(node.nodeId);
      expect(wrapper.vm.event.data).toEqual({ child: value });
      expect(document.body.textContent).toContain('all its nested content');
      vm.pendingDeleteNode = null;
      vm.confirmDelete();
      await nextTick();
      expect(wrapper.vm.event.data).toEqual({ child: value });
      vm.deleteNode(node);
      await flushPromises();
      document.body
        .querySelector<HTMLButtonElement>('.mixed-confirm-delete')!
        .click();
      await nextTick();
      expect(wrapper.vm.event.data).toEqual({});
      await flushPromises();
      wrapper.unmount();
    },
  );

  it.each([{ value: {} }, { value: [] }])(
    'deletes empty %j immediately',
    async ({ value }) => {
      const { wrapper, vm, node } = mountDeletion(value);
      vm.deleteNode(node);
      await nextTick();
      expect(vm.pendingDeleteNode).toBeNull();
      expect(wrapper.vm.event.data).toEqual({});
      await flushPromises();
      wrapper.unmount();
    },
  );

  it.each([
    { restrict: true },
    { readonly: true, separateReadonlyFromDisabled: true },
  ])('rechecks permissions at confirmation with %j', async (config) => {
    const { wrapper, vm, node } = mountDeletion();
    vm.deleteNode(node);
    await wrapper.setProps({ config });
    vm.confirmDelete();
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ child: { nested: true } });
    // A previously captured node cannot bypass the updated permissions either.
    vm.deleteNode(node);
    expect(vm.pendingDeleteNode).toBeNull();
    await flushPromises();
    wrapper.unmount();
  });

  it('cancels pending deletion when external data replaces the target', async () => {
    const { wrapper, vm, node } = mountDeletion();
    vm.deleteNode(node);
    await wrapper.setProps({ data: { child: { replacement: true } } });
    expect(vm.pendingDeleteNode).toBeNull();
    vm.confirmDelete();
    await nextTick();
    expect(wrapper.vm.event.data).toEqual({ child: { replacement: true } });
    await flushPromises();
    wrapper.unmount();
  });

  it('updates the mixed renderer when an existing property changes type', async () => {
    const wrapper = mountJsonForms(
      { dynamic: 'text' },
      schema,
      extendedVuetifyRenderers,
      uischema,
    );

    expect(wrapper.find('.mixed-primitive').exists()).toBe(true);

    await wrapper.setProps({ data: { dynamic: { nested: true } } });
    await nextTick();

    expect(wrapper.find('.mixed-tree-container').exists()).toBe(true);
  });

  it.each(['object', 'array'] as const)(
    'opens the collapsible panel when selecting the %s type',
    async (type) => {
      const wrapper = mountJsonForms(
        { dynamic: 'text' },
        schema,
        extendedVuetifyRenderers,
        uischema,
      );
      const mixedRenderer = wrapper.findComponent({ name: 'mixed-renderer' });
      const vm = mixedRenderer.vm as unknown as {
        mixedRenderInfos: Array<{
          index: number;
          resolvedSchema: { type?: string };
        }>;
        handleSelectChange: (index: number) => void;
      };
      const selected = vm.mixedRenderInfos.find(
        (info) => info.resolvedSchema.type === type,
      );

      expect(selected).toBeDefined();
      vm.handleSelectChange(selected!.index);
      await nextTick();

      expect(wrapper.find('.v-expansion-panel--active').exists()).toBe(true);
      expect(wrapper.find('.mixed-tree-container').exists()).toBe(true);
    },
  );
});
