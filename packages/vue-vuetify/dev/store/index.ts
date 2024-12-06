import type { ValidationMode } from '@jsonforms/core';
import { reactive, ref, watch, type Ref, type UnwrapRef } from 'vue';

export const appstoreLayouts = ['', 'demo-and-data'] as const;
export type AppstoreLayouts = (typeof appstoreLayouts)[number];

const appstore = reactive({
  exampleName: useHistoryHash(''),
  rtl: false,
  layout: useLocalStorage('vuetify-example-layout', ''),
  formOnly: useHistoryHashQuery('form-only', false as boolean),
  activeTab: useHistoryHashQuery('active-tab', 0 as number),
  dark: useLocalStorage('vuetify-example-dark', false),
  theme: useLocalStorage('vuetify-example-theme', 'light'),
  drawer: useHistoryHashQuery('drawer', true as boolean),
  settings: false,
  variant: useLocalStorage('vuetify-example-variant', ''),
  iconset: useLocalStorage('vuetify-example-iconset', 'mdi'),
  blueprint: useLocalStorage('vuetify-example-blueprint', 'md1'),
  jsonforms: {
    readonly: useHistoryHashQuery('read-only', false as boolean),
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
    },
    locale: useLocalStorage('vuetify-example-locale', 'en'),
  },
});

export const useAppStore = () => {
  return appstore;
};

function useHistoryHash(initialValue: string) {
  const data = ref(initialValue);

  // Function to update data based on URL hash
  const updateDataFromHash = () => {
    const hashAndQuery = window.location.hash.slice(1); // Remove the leading '#'
    const [hash, _] = hashAndQuery.split('?'); // Split hash and query string
    if (hash) {
      try {
        data.value = decodeURIComponent(hash);
      } catch (error) {
        console.error('Error parsing hash:', error);
      }
    }
  };

  // Initial update from URL hash
  updateDataFromHash();

  watch(data, (newValue) => {
    const encodedData = encodeURIComponent(newValue);

    const currentHash = window.location.hash.slice(1);
    const [, currentQueryString] = currentHash.split('?'); // Extract the query part after ?

    window.history.replaceState(
      null,
      '',
      `#${encodedData}${currentQueryString ? '?' + currentQueryString : ''}`, // Keep the query parameters intact
    );
  });

  return data;
}

function useHistoryHashQuery<T extends string | boolean | number>(
  queryParam: string,
  initialValue: T,
) {
  const data: Ref<UnwrapRef<T>> = ref<T>(initialValue);

  // Function to update data based on URL hash
  const updateDataFromHash = () => {
    const hashAndQuery = window.location.hash.slice(1); // Remove the leading '#'
    const [_, query] = hashAndQuery.split('?'); // Split hash and query string

    const searchParams = new URLSearchParams(query);
    if (searchParams) {
      try {
        const value = searchParams.has(queryParam)
          ? searchParams.get(queryParam)
          : `${initialValue}`;

        // Convert the value based on the type of initialValue
        if (typeof initialValue === 'boolean') {
          // Handle boolean conversion
          data.value = (value === 'true') as UnwrapRef<T>;
        } else if (typeof initialValue === 'number') {
          data.value = (value ? parseFloat(value) : 0) as UnwrapRef<T>;
        } else if (typeof initialValue === 'string') {
          // Handle string conversion
          data.value = value as UnwrapRef<T>;
        }
      } catch (error) {
        console.error('Error parsing hash:', error);
      }
    }
  };

  // Initial update from URL hash
  updateDataFromHash();

  watch(data, (newValue) => {
    const encodedData = encodeURIComponent(newValue);

    const hashAndQuery = window.location.hash.slice(1); // Remove the leading '#'
    const [hash, query] = hashAndQuery.split('?'); // Split hash and query string

    const searchParams = new URLSearchParams(query);

    if (newValue === initialValue) {
      // it is the default value so no need to preserve the query paramter
      searchParams.delete(queryParam);
    } else {
      searchParams.set(queryParam, encodedData);
    }

    window.history.replaceState(
      null,
      '',
      `#${hash}${searchParams.size > 0 ? '?' + searchParams : ''}`, // Keep the query parameters intact
    );
  });

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
