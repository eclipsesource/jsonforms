import { createVuetify, type Blueprint, type ThemeDefinition } from 'vuetify';
import { md1, md2, md3 } from 'vuetify/blueprints';

import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css';

import { bg, de, en } from 'vuetify/locale';
import 'vuetify/styles';
// just make sure that the locales are loaded

import dayjs from 'dayjs';
import { watch } from 'vue';
import { fa, aliases as faAliases } from 'vuetify/iconsets/fa';
import { mdi, aliases as mdiAliases } from 'vuetify/iconsets/mdi';
import { mdiIconAliases, faIconAliases } from '../../src/icons';
import { aliases as appFaAliases } from '../icons/fa';
import { aliases as appMdiAliases } from '../icons/mdi';
import { useAppStore } from '../store';

export function getCustomThemes(blueprint: string) {
  const getThemeColors = (blueprint: string) => {
    switch (blueprint) {
      case 'md1':
        return (md1.theme as any).themes.light.colors;
      case 'md2':
        return (md2.theme as any).themes.light.colors;
      default:
        return (md3.theme as any).themes.light.colors;
    }
  };

  const customThemes: (ThemeDefinition & { name: string })[] = [
    {
      name: 'light',
      dark: false,
      colors: getThemeColors(blueprint),
    },
    {
      name: 'dark',
      dark: true,
      colors: {
        primary: '#2196F3',
        secondary: '#54B6B2',
        error: '#CF6679',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
      },
    },
    {
      name: 'Basil',
      dark: false,
      colors: {
        primary: '#356859',
        secondary: '#FD5523',
        accent: '#37966F',
        info: '#356859',
      },
    },
    {
      name: 'Crane',
      dark: false,
      colors: {
        primary: '#5D1049',
        secondary: '#E30425',
        accent: '#4E0D3A',
        info: '#5D1049',
      },
    },
    {
      name: 'Fortnightly',
      dark: false,
      colors: {
        primary: '#6B38FB',
        secondary: '#6B38FB',
        info: '#6B38FB',
      },
    },
    {
      name: 'Owl',
      dark: false,
      colors: {
        primary: '#FFDE03',
        secondary: '#0336FF',
        accent: '#FF0266',
        info: '#FFDE03',
      },
    },
    {
      name: 'Shrine',
      dark: false,
      colors: {
        primary: '#FEDBD0',
        secondary: '#FEEAE6',
        accent: '#442C2E',
        info: '#FEDBD0',
      },
    },
  ];

  return customThemes;
}

function toIconSetAliases(iconset: string) {
  // we can add vue-vuetify icons setoverrides here if needed or use the default provided base on the iconset

  if (iconset === 'fa') {
    // override vuetify calendar to use fa-regular calendar instead of fa-solid
    return {
      ...{ ...faAliases, ...{ calendar: 'far fa-calendar' } },
      ...faIconAliases,
      ...appFaAliases,
    };
  }

  // default
  return { ...mdiAliases, ...mdiIconAliases, ...appMdiAliases };
}

function toBlueprint(value: string): Blueprint {
  if (value === 'md1') {
    return md1;
  }
  if (value === 'md2') {
    return md2;
  }
  if (value === 'md3') {
    return md3;
  }
  // default
  return md1;
}

function createVuetifyInstance(
  dark: boolean,
  blueprint: string,
  variant: string,
  iconset: string,
  locale: string,
) {
  const defaults = variant
    ? {
        VField: {
          variant: variant,
        },
        VTextField: {
          variant: variant,
        },
        VCombobox: {
          variant: variant,
        },
        VSelect: {
          variant: variant,
        },
        VAutocomplete: {
          variant: variant,
        },
        VTextarea: {
          variant: variant,
        },
        VNumberInput: {
          variant: variant,
        },
        VDateInput: {
          variant: variant,
        },
        VCheckbox: { color: 'primary' },
      }
    : {
        VCheckbox: { color: 'primary' },
      };

  dayjs.locale(locale);

  return createVuetify({
    blueprint: toBlueprint(blueprint),
    locale: {
      locale: locale,
      fallback: 'en',
      messages: { en, bg, de },
    },
    icons: {
      defaultSet: iconset, // Set the default icon set
      sets: {
        mdi,
        fa,
      },
      aliases: toIconSetAliases(iconset),
    },
    theme: {
      defaultTheme: dark ? 'dark' : 'light',
      themes: getCustomThemes(blueprint).reduce(
        (acc: Record<string, ThemeDefinition>, current) => {
          acc[current.name] = current;
          return acc;
        },
        {},
      ),
    },
    defaults: defaults,
  });
}

export function buildVuetify() {
  const appStore = useAppStore();
  const vuetify = createVuetifyInstance(
    appStore.dark,
    appStore.blueprint,
    appStore.variant,
    appStore.iconset,
    appStore.jsonforms.locale,
  );

  watch(
    () => appStore.jsonforms.locale,
    (locale: string) => {
      vuetify.locale.current.value = locale;
      dayjs.locale(locale);
    },
  );

  // Watch for changes in the variant and update Vuetify
  watch(
    () => appStore.variant,
    (variant: string) => {
      if (variant) {
        vuetify.defaults.value = {
          ...vuetify.defaults.value,
          VField: {
            ...vuetify.defaults.value?.VField,
            variant: variant,
          },
          VTextField: {
            ...vuetify.defaults.value?.VTextField,
            variant: variant,
          },
          VCombobox: {
            ...vuetify.defaults.value?.VCombobox,
            variant: variant,
          },
          VSelect: {
            ...vuetify.defaults.value?.VSelect,
            variant: variant,
          },
          VAutocomplete: {
            ...vuetify.defaults.value?.VAutocomplete,
            variant: variant,
          },
          VTextarea: {
            ...vuetify.defaults.value?.VTextarea,
            variant: variant,
          },
          VNumberInput: {
            ...vuetify.defaults.value?.VNumberInput,
            variant: variant,
          },
          VDateInput: {
            ...vuetify.defaults.value?.VDateInput,
            variant: variant,
          },
        };
      } else {
        delete vuetify.defaults.value?.VField?.variant;
        delete vuetify.defaults.value?.VTextField?.variant;
        delete vuetify.defaults.value?.VCombobox?.variant;
        delete vuetify.defaults.value?.VSelect?.variant;
        delete vuetify.defaults.value?.VAutocomplete?.variant;
        delete vuetify.defaults.value?.VTextarea?.variant;
        delete vuetify.defaults.value?.VNumberInput?.variant;
        delete vuetify.defaults.value?.VDateInput?.variant;
      }
    },
  );

  return vuetify;
}

export default buildVuetify;
