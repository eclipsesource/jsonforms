<template>
  <div v-if="visible" :class="styles.control.root" :id="id">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { isDescriptionHidden, computeLabel } from '@jsonforms/core';
import { defineComponent, CompType } from '../vue';
import { Styles } from '../styles';
import { Options } from '../util';
import { VContainer } from 'vuetify/lib';

export default defineComponent({
  name: 'control-wrapper',
  components: {
    VContainer,
  },
  props: {
    id: {
      required: true as const,
      type: String,
    },
    description: {
      required: false as const,
      type: String,
      default: undefined,
    },
    errors: {
      required: false as const,
      type: String,
      default: undefined,
    },
    label: {
      required: false as const,
      type: String,
      default: undefined,
    },
    appliedOptions: {
      required: false as const,
      type: Object as CompType<Options, ObjectConstructor>,
      default: undefined,
    },
    visible: {
      required: false as const,
      type: Boolean,
      default: true,
    },
    required: {
      required: false as const,
      type: Boolean,
      default: false,
    },
    isFocused: {
      required: false as const,
      type: Boolean,
      default: false,
    },
    styles: {
      required: true,
      type: Object as CompType<Styles, ObjectConstructor>,
    },
  },
  computed: {
    showDescription(): boolean {
      return !isDescriptionHidden(
        this.visible,
        this.description,
        this.isFocused,
        !!this.appliedOptions?.showUnfocusedDescription
      );
    },
    computedLabel(): string {
      return computeLabel(
        this.label,
        this.required,
        !!this.appliedOptions?.hideRequiredAsterisk
      );
    },
  },
});
</script>
