<template>
  <pane v-bind="$attrs" class="v-pane">
    <slot />
  </pane>
</template>

<script lang="ts">
import { Pane } from 'splitpanes';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VPane',
  components: {
    Pane,
  },
  inheritAttrs: false,
});
</script>
