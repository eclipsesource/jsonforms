<!-- Password strength indicator in prepend slot -->
<template>
  <password-control-renderer v-bind="$props">
    <!-- PREPEND: Password Strength Indicator -->
    <template #prepend>
      <v-tooltip :text="strengthTooltip" location="bottom">
        <template #activator="{ props: tooltipProps }">
          <v-icon
            v-bind="tooltipProps"
            :color="strengthColor"
            size="small"
            class="mr-1"
            aria-hidden="true"
            tabindex="-1"
          >
            {{ strengthIcon }}
          </v-icon>
        </template>
      </v-tooltip>
    </template>
    <!-- Note: append slot used by PasswordControlRenderer for show/hide toggle -->
  </password-control-renderer>
</template>

<script setup lang="ts">
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import type { ControlElement } from '@jsonforms/core';
import PasswordControlRenderer from '../../src/controls/PasswordControlRenderer.vue';
import { VIcon, VTooltip } from 'vuetify/components';
import { computed } from 'vue';

const props = defineProps(rendererProps<ControlElement>());

// Use JSONForms composable to access control state
const { control } = useJsonFormsControl(props);

// PREPEND: Calculate "strength" based on input complexity
// (In real app: password strength, username uniqueness check, etc.)
const strength = computed(() => {
  const value = control.value.data || '';
  const length = value.length;

  if (length === 0) return 0;
  if (length < 5) return 1;
  if (length < 10) return 2;

  // Bonus for complexity
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  const complexity = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (complexity >= 2) return 4;
  if (complexity >= 1) return 3;
  return 2;
});

const strengthColor = computed(() => {
  const colors = ['grey-lighten-1', 'error', 'warning', 'info', 'success'];
  return colors[strength.value];
});

const strengthIcon = computed(() => {
  const icons = [
    'mdi-shield-outline', // Empty - grey outline
    'mdi-shield-alert', // Weak - red shield with alert
    'mdi-shield-half-full', // Fair - orange half shield
    'mdi-shield-check', // Good - blue shield with check
    'mdi-shield-star', // Strong - green shield with star
  ];
  return icons[strength.value];
});

const strengthTooltip = computed(() => {
  const labels = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'];
  const tips = [
    'Start typing to see complexity indicator',
    'Weak: Too short (< 5 chars)',
    'Fair: Medium length (5-10 chars)',
    'Good: Good length with some complexity',
    'Strong: Long with uppercase, numbers, or special chars',
  ];
  return `${labels[strength.value]}: ${tips[strength.value]}`;
});

</script>
