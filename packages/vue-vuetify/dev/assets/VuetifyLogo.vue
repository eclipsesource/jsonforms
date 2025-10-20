<template>
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 87.5 100"
    :width="width"
    :height="height"
    :class="play ? 'animate' : null"
  >
    <title>Vuetify Logo</title>
    <polyline
      :style="{ fill: primaryColor }"
      points="43.75 0 23.31 0 43.75 48.32"
    />
    <polygon
      :style="{ fill: primaryLightColor }"
      points="43.75 62.5 43.75 100 0 14.58 22.92 14.58 43.75 62.5"
    />
    <polyline
      :style="{ fill: primaryDarkColor }"
      points="43.75 0 64.19 0 43.75 48.32"
    />
    <polygon
      :style="{ fill: primaryLighterColor }"
      points="64.58 14.58 87.5 14.58 43.75 100 43.75 62.5 64.58 14.58"
    />
  </svg>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const props = defineProps<{
  width: string | number;
  height: string | number;
  animate?: boolean;
}>();

// Custom color manipulation functions
function lighten(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
}

function darken(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
}

const primaryColor = computed(() => theme.current.value.colors.primary);
const primaryLightColor = computed(() => lighten(primaryColor.value, 20)); // Lighten by 2 steps
const primaryDarkColor = computed(() => darken(primaryColor.value, 20)); // Darken by 2 steps
const primaryLighterColor = computed(() => lighten(primaryColor.value, 40)); // Lighten by 4 steps

const play = ref(props.animate);
if (props.animate) {
  watch(primaryColor, () => {
    play.value = false;

    setTimeout(() => {
      play.value = true;
    }, 10);
  });
}
</script>

<style scoped>
.animate {
  animation: spin 3s ease-in-out;
}

@keyframes spin {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
</style>
