<template>
  <splitpanes v-bind="$attrs" class="v-splitpanes" :rtl="rtl.isRtl.value">
    <slot />
  </splitpanes>
</template>

<script lang="ts">
import { Splitpanes } from 'splitpanes';
import { defineComponent } from 'vue';
import { useRtl } from 'vuetify';
import './VSplitpanes.sass';

export default defineComponent({
  name: 'VSplitpanes',
  components: {
    Splitpanes,
  },
  inheritAttrs: false,
  setup() {
    const rtl = useRtl();

    return {
      rtl,
    };
  },
});
</script>
