<template>
  <div :id="id + '-input'" :class="styles.control.radioGroup">
    <div
      v-for="option in options"
      :key="option.value"
      :class="styles.control.radioGroupItem"
    >
      <input
        :id="id + '.' + option.value"
        type="radio"
        :name="id"
        :value="option.value"
        :disabled="!enabled"
        :required="required"
        @change="onChange"
      />

      <label
        :for="id + '.' + option.value"
        :class="styles.control.radioGroupItemLabel"
        >{{ option.label }}</label
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Styles } from '../../styles';

export default defineComponent({
  name: 'RadioGroupControl',
  props: {
    id: {
      required: true,
      type: String,
    },
    enabled: {
      required: false as const,
      type: Boolean,
      default: true,
    },
    required: {
      required: false as const,
      type: Boolean,
      default: false,
    },
    styles: {
      required: true,
      type: Object as PropType<Styles>,
    },
    options: {
      required: true,
      type: Array,
    },
    onChange: {
      required: true,
      type: Function,
    },
  },
});
</script>
