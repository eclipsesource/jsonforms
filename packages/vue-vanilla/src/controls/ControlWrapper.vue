<template>
  <div v-if="visible" :id="id" :class="styles.control.root">
    <label
      :for="id + '-input'"
      :class="[styles.control.label, required ? styles.control.required : '']"
    >
      {{ label }}
      <span v-if="showAsterisk" :class="styles.control.asterisk">*</span>
    </label>
    <div :class="styles.control.wrapper">
      <slot></slot>
    </div>
    <div :class="errors ? styles.control.error : styles.control.description">
      {{ errors ? errors : showDescription ? description : null }}
    </div>
  </div>
</template>

<script lang="ts">
import { isDescriptionHidden } from '@jsonforms/core';
import { defineComponent, PropType } from 'vue';
import { Styles } from '../styles';
import { Options } from '../util';

export default defineComponent({
  name: 'ControlWrapper',
  props: {
    id: {
      required: true,
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
      type: Object as PropType<Options>,
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
      type: Object as PropType<Styles>,
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
    showAsterisk(): boolean {
      return this.required && !this.appliedOptions?.hideRequiredAsterisk;
    },
  },
});
</script>
