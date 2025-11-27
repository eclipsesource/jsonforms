<!-- Async username availability checker in append slot -->
<template>
  <string-control-renderer v-bind="$props">
    <!-- APPEND: Username Availability Status -->
    <template #append>
      <!-- Loading spinner -->
      <v-progress-circular
        v-if="isChecking"
        indeterminate
        size="24"
        width="2"
        color="primary"
        aria-hidden="true"
      />

      <!-- Available (success) -->
      <v-tooltip
        v-else-if="availability === 'available'"
        text="Username is available!"
        location="top"
      >
        <template #activator="{ props: tooltipProps }">
          <v-icon v-bind="tooltipProps" color="success" aria-hidden="true">
            mdi-check-circle
          </v-icon>
        </template>
      </v-tooltip>

      <!-- Taken (error) -->
      <v-tooltip
        v-else-if="availability === 'taken'"
        text="Username is already taken"
        location="top"
      >
        <template #activator="{ props: tooltipProps }">
          <v-icon v-bind="tooltipProps" color="error" aria-hidden="true">
            mdi-close-circle
          </v-icon>
        </template>
      </v-tooltip>

      <!-- Placeholder to maintain consistent field width when idle/empty -->
      <v-icon v-else style="opacity: 0" aria-hidden="true">
        mdi-check-circle
      </v-icon>
    </template>
  </string-control-renderer>
</template>

<script setup lang="ts">
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import type { ControlElement } from '@jsonforms/core';
import StringControlRenderer from '../../src/controls/StringControlRenderer.vue';
import { VIcon, VTooltip, VProgressCircular } from 'vuetify/components';
import { ref, computed, watch } from 'vue';

const props = defineProps(rendererProps<ControlElement>());

const { control } = useJsonFormsControl(props);

// State
const isChecking = ref(false);
const availability = ref<'idle' | 'available' | 'taken'>('idle');

// Simulated "taken" usernames (only "admin" for deterministic testing)
const takenUsernames = ['admin'];

// Track the current check to avoid race conditions
let currentCheckId = 0;

// Simulate API call to check username availability
const checkAvailability = async (
  username: string,
  checkId: number,
): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Only update state if this is still the current check (not superseded)
  if (checkId === currentCheckId) {
    // Check against "database"
    availability.value = takenUsernames.includes(username.toLowerCase())
      ? 'taken'
      : 'available';
    isChecking.value = false;
  }
};

// Debounced checker
let checkTimeout: number | undefined;

watch(
  () => control.value.data,
  (newValue) => {
    // Clear any pending check
    if (checkTimeout) {
      clearTimeout(checkTimeout);
      checkTimeout = undefined;
    }

    const username = (newValue || '').toString().trim();

    // Reset if empty
    if (username.length === 0) {
      availability.value = 'idle';
      isChecking.value = false;
      currentCheckId++; // Invalidate any in-flight checks
      return;
    }

    // Invalidate any previous checks immediately
    currentCheckId++;

    // Start checking state immediately (before debounce)
    isChecking.value = true;
    // Keep previous availability state visible during check (don't flash to idle)

    // Debounce: wait 500ms after user stops typing
    checkTimeout = window.setTimeout(() => {
      const thisCheckId = currentCheckId;
      checkAvailability(username, thisCheckId).catch((error) => {
        console.error('Failed to check username:', error);
        if (thisCheckId === currentCheckId) {
          availability.value = 'idle';
          isChecking.value = false;
        }
      });
    }, 500);
  },
  { immediate: true },
);
</script>
