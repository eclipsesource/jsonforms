import type { ValidationMode } from '@jsonforms/core';
import { reactive, ref, watch } from 'vue';

const appstore = reactive({
  exampleName: useHistoryHash(''),
  rtl: false,
  formOnly: false,
  dark: useLocalStorage('vuetify-example-dark', false),
  theme: useLocalStorage('vuetify-example-theme', 'light'),
  drawer: true,
  settings: false,
  variant: useLocalStorage('vuetify-example-variant', ''),
  iconset: useLocalStorage('vuetify-example-iconset', 'mdi'),
  blueprint: useLocalStorage('vuetify-example-blueprint', 'md1'),
  jsonforms: {
    readonly: false,
    validationMode: 'ValidateAndShow' as ValidationMode,
    config: {
      restrict: true,
      trim: false,
      showUnfocusedDescription: false,
      hideRequiredAsterisk: true,
      collapseNewItems: false,
      breakHorizontal: false,
      initCollapsed: false,
      hideAvatar: false,
      hideArraySummaryValidation: false,
      enableFilterErrorsBeforeTouch: false,
      vuetify: {},
    },
    locale: useLocalStorage('vuetify-example-locale', 'en'),
  },
});

export const useAppStore = () => {
  return appstore;
};

export function useHistoryHash(initialValue: string) {
  const data = ref(initialValue);

  // Function to update data based on URL hash
  const updateDataFromHash = () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        data.value = decodeURIComponent(hash);
      } catch (error) {
        console.error('Error parsing hash:', error);
      }
    }
  };

  // Update data from URL hash on component mount
  updateDataFromHash();

  watch(
    data,
    (newValue) => {
      const encodedData = encodeURIComponent(newValue);
      window.history.replaceState(null, '', `#${encodedData}`);
    },
    { deep: true },
  );

  return data;
}

export function useLocalStorage(
  key: string,
  initialValue: string | boolean | number | Record<string, any>,
) {
  // Read from localStorage
  const storedValueAsString = localStorage.getItem(key);

  let storedValue;
  if (storedValueAsString) {
    if (typeof initialValue === 'string') {
      storedValue = storedValueAsString;
    } else if (typeof initialValue === 'number') {
      storedValue = parseFloat(storedValueAsString);
    } else if (typeof initialValue === 'boolean') {
      storedValue = storedValueAsString === 'true';
    } else {
      storedValue = JSON.parse(storedValueAsString);
    }
  }

  const data = ref(storedValue ?? initialValue);

  // Watch for changes to data and update localStorage
  watch(
    data,
    (newValue) => {
      if (newValue === undefined || newValue === null) {
        localStorage.removeItem(key);
      } else if (
        typeof newValue === 'string' ||
        typeof newValue === 'boolean' ||
        typeof newValue === 'number'
      ) {
        localStorage.setItem(key, newValue + '');
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    { deep: true },
  );

  return data;
}
