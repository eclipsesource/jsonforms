<template>
  <div
    v-if="appStore.overrideControlTemplate && visible"
    :class="['control-wrapper', { 'focused-wrapper': isFocused }]"
    :id="id"
  >
    <slot></slot>
  </div>
  <default-control-wrapper v-else v-bind="props">
    <slot></slot>
  </default-control-wrapper>
</template>

<script setup lang="ts">
import DefaultControlWrapper from '@/controls/components/DefaultControlWrapper.vue';
import type { ControlWrapperProps } from '@/util';
import { useAppStore } from '../store';
import { defineProps } from 'vue';
const appStore = useAppStore();

const props = defineProps<ControlWrapperProps>();
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

/* Override icon in the corner */
.override-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

/* Slight icon animation on focus */
.focused-wrapper .override-icon {
  transform: scale(1.3);
  color: #1976d2;
}

/* Error styling */
.error-alert {
  margin-top: 4px;
  padding: 4px 8px;
  font-size: 0.85rem;
}
</style>
