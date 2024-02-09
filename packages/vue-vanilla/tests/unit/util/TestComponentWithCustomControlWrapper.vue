<script lang="ts">
import { defineComponent } from 'vue';
// eslint-disable-next-line vue/no-unused-components
import CustomControlWrapper from './CustomControlWrapper.vue';
import TestComponent from './TestComponent.vue';

export default defineComponent({
  name: 'TestComponentWithCustomWrapper',
  components: {
    TestComponent,
  },
  provide() {
    return {
      'custom-control-wrapper': { component: CustomControlWrapper },
    };
  },
});
</script>

<template>
  <TestComponent />
</template>
