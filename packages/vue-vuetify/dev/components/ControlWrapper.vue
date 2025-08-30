<template>
  <div
    class="control-wrapper"
    v-if="appStore.overrideControlTemplate && visible"
    :class="[styles?.control.root, { 'focused-wrapper': isFocused }]"
    :id="id"
  >
    <label :for="id">{{ label }} {{ required ? '(required)' : '' }}</label>
    <template v-for="vnode in processedSlot">
      <component :is="vnode" />
    </template>
  </div>

  <default-control-wrapper v-else v-bind="props">
    <slot></slot>
  </default-control-wrapper>
</template>

<script setup lang="ts">
import DefaultControlWrapper from '@/controls/components/DefaultControlWrapper.vue';
import type { ControlWrapperProps } from '@/util';
import { cloneVNode, computed, defineProps, useSlots } from 'vue';
import { useAppStore } from '../store';
const appStore = useAppStore();

const props = defineProps<ControlWrapperProps>();
const slots = useSlots();

/**
 * Recursively clones a VNode and removes 'label' prop from Vuetify input components.
 */
function stripLabel(vnode: any) {
  if (!vnode) return vnode;

  const hasLabel = vnode.props && 'label' in vnode.props;
  if (hasLabel) {
    vnode = cloneVNode(vnode, { label: undefined });
  }

  if (vnode.children && Array.isArray(vnode.children)) {
    vnode.children = vnode.children.map(stripLabel);
  }

  return vnode;
}

const processedSlot = computed(() => {
  if (!slots.default) return [];
  return slots.default().map(stripLabel);
});
</script>

<style scoped>
.control-wrapper {
  position: relative;
  padding: 8px;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  border-radius: 6px;
}

/* Subtle focus effect */
.focused-wrapper {
  background-color: rgba(25, 118, 210, 0.05); /* soft glow */
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.3);
}
</style>
