<template>
  <div :class="toolbarClasses" @click="expandClicked">
    <div>{{ label }}</div>
    <div class="btn-group" role="group">
      <button
        :disabled="!moveUpEnabled"
        class="btn btn-secondary"
        type="button"
        @click="moveUpClicked"
      >
        <i :class="styles.itemMoveUp ?? 'bi bi-arrow-up'"></i>
      </button>
      <button
        :disabled="!moveDownEnabled"
        class="btn btn-secondary"
        type="button"
        @click="moveDownClicked"
      >
        <i :class="styles.itemMoveDown ?? 'bi bi-arrow-down'"></i>
      </button>
      <button
        :disabled="!deleteEnabled"
        class="btn btn-secondary"
        type="button"
        @click="deleteClicked"
      >
        <i :class="styles.itemMoveDown ?? 'bi bi-x-lg'"></i>
      </button>
    </div>
  </div>
  <div :class="contentClasses">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { classes, Styles } from '../styles';

const listItem = defineComponent({
  name: 'ArrayListElement',
  props: {
    initiallyExpanded: {
      required: false,
      type: Boolean,
      default: false,
    },
    label: {
      required: false,
      type: String,
      default: '',
    },
    moveUpEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    moveDownEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    moveUp: {
      required: false,
      type: Function,
      default: undefined,
    },
    moveDown: {
      required: false,
      type: Function,
      default: undefined,
    },
    deleteEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    delete: {
      required: false,
      type: Function,
      default: undefined,
    },
    styles: {
      required: true,
      type: Object as PropType<Styles>,
    },
  },
  data() {
    return {
      expanded: this.initiallyExpanded,
    };
  },
  computed: {
    contentClasses(): string {
      return "";
    },
    toolbarClasses(): string {
      return "";
    },
  },
  methods: {
    expandClicked(): void {
      this.expanded = !this.expanded;
    },
    moveUpClicked(event: Event): void {
      event.stopPropagation();
      this.moveUp?.();
    },
    moveDownClicked(event: Event): void {
      event.stopPropagation();
      this.moveDown?.();
    },
    deleteClicked(event: Event): void {
      event.stopPropagation();
      this.delete?.();
    },
  },
});

export default listItem;
</script>
