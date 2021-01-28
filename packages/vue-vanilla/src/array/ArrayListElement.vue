<template>
  <div
    @click="expandClicked"
    :class="toolbarClasses"
  >
    <div :class="styles.arrayList.itemLabel">{{ label }}</div>
    <button
      @click="moveUpClicked"
      :disabled="!moveUpEnabled"
      :class="styles.arrayList.itemMoveUp"
    >
      ↑
    </button>
    <button
      @click="moveDownClicked"
      :disabled="!moveDownEnabled"
      :class="styles.arrayList.itemMoveDown"
    >
      ↓
    </button>
    <button @click="deleteClicked" :class="styles.arrayList.itemDelete">
      🗙
    </button>
  </div>
  <div :class="contentClasses">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, CompType } from '../../config';
import { classes, Styles } from '../styles';

const listItem = defineComponent({
  name: 'array-list-element',
  props: {
    initiallyExpanded: {
      required: false,
      type: Boolean,
      default: false
    },
    label: {
      required: false,
      type: String,
      default: ''
    },
    moveUpEnabled: {
      required: false,
      type: Boolean,
      default: true
    },
    moveDownEnabled: {
      required: false,
      type: Boolean,
      default: true
    },
    moveUp: {
      required: false,
      type: Function,
      default: undefined
    },
    moveDown: {
      required: false,
      type: Function,
      default: undefined
    },
    delete: {
      required: false,
      type: Function,
      default: undefined
    },
    styles: {
      required: true,
      type: Object as CompType<Styles, ObjectConstructor>,
    }
  },
  data() {
    return {
      expanded: this.initiallyExpanded
    };
  },
  computed: {
    contentClasses(): string {
      return classes`${this.styles.arrayList.itemContent} ${
        this.expanded && this.styles.arrayList.itemExpanded
      }`;
    },
    toolbarClasses(): string {
      return classes`${this.styles.arrayList.itemToolbar} ${
        this.expanded && this.styles.arrayList.itemExpanded
      }`;
    }
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
    }
  }
});

export default listItem;
</script>
