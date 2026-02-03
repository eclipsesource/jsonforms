<template>
  <div :style="{ color: 'red' }">No applicable renderer found.</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UnknownRenderer',
});
</script>
