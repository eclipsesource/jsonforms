<template>
  <div v-if="visible" :class="styles.control.root" :id="id">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, CompType } from '../vue';
import { Styles } from '../styles';

export default defineComponent({
  name: 'control-wrapper',
  props: {
    id: {
      required: true as const,
      type: String,
    },
    visible: {
      required: false as const,
      type: Boolean,
      default: true,
    },
    styles: {
      required: true,
      type: Object as CompType<Styles, ObjectConstructor>,
    },
  },
});
</script>
