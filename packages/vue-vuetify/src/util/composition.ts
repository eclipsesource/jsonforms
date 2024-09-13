import { aliases as faIcons } from '@/icons/fa';
import type { IconAliases } from '@/icons/icons';
import { aliases as mdiIcons } from '@/icons/mdi';
import {
  Resolve,
  arrayDefaultTranslations,
  combinatorDefaultTranslations,
  composePaths,
  computeLabel,
  defaultJsonFormsI18nState,
  getArrayTranslations,
  getCombinatorTranslations,
  getFirstPrimitiveProp,
  isDescriptionHidden,
  type ControlElement,
  type DispatchPropsOfControl,
  type JsonFormsSubStates,
  type JsonSchema,
  type UISchemaElement,
} from '@jsonforms/core';
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';
import {
  computed,
  inject,
  provide,
  ref,
  type ComputedRef,
  type InjectionKey,
} from 'vue';
import type { IconOptions } from 'vuetify';
import { useStyles } from '../styles';

export const IconSymbol: InjectionKey<Required<IconOptions>> =
  Symbol.for('vuetify:icons');

export const useControlAppliedOptions = <
  T extends { config: any; uischema: UISchemaElement },
  I extends {
    control: ComputedRef<T>;
  },
>(
  input: I,
) => {
  return computed(() =>
    merge(
      {},
      cloneDeep(input.control.value.config),
      cloneDeep(input.control.value.uischema.options),
    ),
  );
};

export const useLayoutAppliedOptions = <
  T extends { config: any; uischema: UISchemaElement },
  I extends {
    layout: ComputedRef<T>;
  },
>(
  input: I,
) => {
  return computed(() =>
    merge(
      {},
      cloneDeep(input.layout.value.config),
      cloneDeep(input.layout.value.uischema.options),
    ),
  );
};

export const useComputedLabel = <
  T extends { label: string; required: boolean },
  I extends { control: ComputedRef<T> },
>(
  input: I,
  appliedOptions: ReturnType<typeof useControlAppliedOptions>,
) => {
  return computed((): string => {
    return computeLabel(
      input.control.value.label,
      input.control.value.required,
      !!appliedOptions.value?.hideRequiredAsterisk,
    );
  });
};

/**
 * Adds styles, appliedOptions and vuetifyProps
 */
export const useVuetifyLabel = <
  T extends {
    uischema: UISchemaElement;
    config: any;
  },
  I extends {
    label: ComputedRef<T>;
  },
>(
  input: I,
) => {
  const styles = useStyles(input.label.value.uischema);
  const appliedOptions = computed(() =>
    merge(
      {},
      cloneDeep(input.label.value.config),
      cloneDeep(input.label.value.uischema.options),
    ),
  );
  const vuetifyProps = (path: string) => {
    const props = get(appliedOptions.value?.vuetify, path);

    return props && isPlainObject(props) ? props : {};
  };
  return {
    ...input,
    appliedOptions,
    vuetifyProps,
    styles,
  };
};

/**
 * Adds styles, isFocused, appliedOptions and onChange
 */
export const useVuetifyControl = <
  T extends {
    uischema: ControlElement;
    path: string;
    config: any;
    label: string;
    description: string;
    required: boolean;
    errors: string;
    id: string;
    visible: boolean;
  },
  I extends {
    control: ComputedRef<T>;
  } & DispatchPropsOfControl,
>(
  input: I,
  adaptValue: (target: any) => any = (v) => v,
  debounceWait?: number,
) => {
  const touched = ref(false);

  const changeEmitter =
    typeof debounceWait === 'number'
      ? debounce(input.handleChange, debounceWait)
      : input.handleChange;

  const onChange = (value: any) => {
    changeEmitter(input.control.value.path, adaptValue(value));
  };

  const appliedOptions = useControlAppliedOptions(input);
  const isFocused = ref(false);

  const handleFocus = () => {
    isFocused.value = true;
  };

  const handleBlur = () => {
    touched.value = true;
    isFocused.value = false;
  };

  const filteredErrors = computed(() => {
    return touched.value || !appliedOptions.value.enableFilterErrorsBeforeTouch
      ? input.control.value.errors
      : '';
  });

  const persistentHint = (): boolean => {
    return !isDescriptionHidden(
      input.control.value.visible,
      input.control.value.description,
      isFocused.value,
      !!appliedOptions.value?.showUnfocusedDescription,
    );
  };

  const computedLabel = useComputedLabel(input, appliedOptions);

  const controlWrapper = computed(() => {
    const { id, description, errors, label, visible, required } =
      input.control.value;
    return { id, description, errors, label, visible, required };
  });

  const styles = useStyles(input.control.value.uischema);

  const vuetifyProps = (path: string) => {
    const props = get(appliedOptions.value?.vuetify, path);

    return props && isPlainObject(props) ? props : {};
  };

  const overwrittenControl = computed(() => {
    return {
      ...input.control.value,
      errors: filteredErrors.value,
    };
  });

  const rawErrors = computed(() => input.control.value.errors);

  return {
    ...input,
    control: overwrittenControl,
    styles,
    isFocused,
    appliedOptions,
    controlWrapper,
    onChange,
    vuetifyProps,
    persistentHint,
    computedLabel,
    touched,
    handleBlur,
    handleFocus,
    rawErrors,
  };
};

export const useCombinatorTranslations = <
  T extends {
    i18nKeyPrefix: string;
    label: string;
  },
  I extends {
    control: ComputedRef<T>;
  },
>(
  input: I,
) => {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms');
  const translations = getCombinatorTranslations(
    jsonforms?.i18n?.translate ?? defaultJsonFormsI18nState.translate,
    combinatorDefaultTranslations,
    input.control.value.i18nKeyPrefix,
    input.control.value.label,
  );

  const overwrittenControl = computed(() => {
    return {
      ...input.control.value,
      translations,
    };
  });

  return {
    ...input,
    control: overwrittenControl,
  };
};

export const useJsonForms = () => {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms');

  if (!jsonforms) {
    throw new Error(
      "'jsonforms couldn't be injected. Are you within JSON Forms?",
    );
  }

  return jsonforms;
};

export const useTranslator = () => {
  const jsonforms = useJsonForms();

  if (!jsonforms.i18n || !jsonforms.i18n.translate) {
    throw new Error(
      "'jsonforms i18n couldn't be injected. Are you within JSON Forms?",
    );
  }

  const translate = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return jsonforms.i18n!.translate!;
  });

  return translate;
};

/**
 * Adds styles and appliedOptions
 */
export const useVuetifyLayout = <
  T extends { config: any; uischema: UISchemaElement },
  I extends { layout: ComputedRef<T> },
>(
  input: I,
) => {
  const appliedOptions = useLayoutAppliedOptions(input);

  const vuetifyProps = (path: string) => {
    const props = get(appliedOptions.value?.vuetify, path);

    return props && isPlainObject(props) ? props : {};
  };

  return {
    ...input,
    styles: useStyles(input.layout.value.uischema),
    appliedOptions,
    vuetifyProps,
  };
};

/**
 * Adds styles, appliedOptions and childUiSchema
 */
export const useVuetifyArrayControl = <
  T extends {
    label: string;
    required: boolean;
    config: any;
    uischema: UISchemaElement;
    schema: JsonSchema;
    data: any;
    childErrors: ErrorObject[];
    i18nKeyPrefix: string;
  },
  I extends {
    control: ComputedRef<T>;
  },
>(
  input: I,
) => {
  const appliedOptions = useControlAppliedOptions(input);

  const computedLabel = useComputedLabel(input, appliedOptions);

  const vuetifyProps = (path: string) => {
    const props = get(appliedOptions.value?.vuetify, path);

    return props && isPlainObject(props) ? props : {};
  };

  const childLabelForIndex = (index: number | null) => {
    if (index === null) {
      return '';
    }
    const childLabelProp =
      input.control.value.uischema.options?.childLabelProp ??
      getFirstPrimitiveProp(input.control.value.schema);
    if (!childLabelProp) {
      return `${index}`;
    }
    const labelValue = Resolve.data(
      input.control.value.data,
      composePaths(`${index}`, childLabelProp),
    );
    if (
      labelValue === undefined ||
      labelValue === null ||
      Number.isNaN(labelValue)
    ) {
      return '';
    }
    return `${labelValue}`;
  };
  const filteredChildErrors = computed(() => {
    // supress childErrors unless touch filtering is disabled
    // otherwise all child errors will show, irrespective of their control touch state
    const filtered: ErrorObject[] = appliedOptions.value
      ?.enableFilterErrorsBeforeTouch
      ? []
      : input.control.value.childErrors;
    return filtered;
  });

  const jsonforms = inject<JsonFormsSubStates>('jsonforms');
  const translations = getArrayTranslations(
    jsonforms?.i18n?.translate ?? defaultJsonFormsI18nState.translate,
    arrayDefaultTranslations,
    input.control.value.i18nKeyPrefix,
    input.control.value.label,
  );

  const overwrittenControl = computed(() => {
    return {
      ...input.control.value,
      childErrors: filteredChildErrors.value,
      translations,
    };
  });

  return {
    ...input,
    control: overwrittenControl,
    styles: useStyles(input.control.value.uischema),
    appliedOptions,
    childLabelForIndex,
    computedLabel,
    vuetifyProps,
    rawChildErrors: input.control.value.childErrors,
  };
};

/**
 * Adds styles and appliedOptions
 */
export const useVuetifyBasicControl = <
  T extends { config: any; uischema: UISchemaElement },
  I extends {
    control: ComputedRef<T>;
  },
>(
  input: I,
) => {
  const appliedOptions = useControlAppliedOptions(input);

  const vuetifyProps = (path: string) => {
    const props = get(appliedOptions.value?.vuetify, path);

    return props && isPlainObject(props) ? props : {};
  };

  return {
    ...input,
    styles: useStyles(input.control.value.uischema),
    appliedOptions,
    vuetifyProps,
  };
};

/**
 * Extracts Ajv from JSON Forms
 */
export const useAjv = () => {
  const jsonforms = useJsonForms();

  // should always exist
  return jsonforms.core?.ajv as Ajv;
};

export interface NestedInfo {
  level: number;
  parentElement?: 'array' | 'object';
}

export const useNested = (element: false | 'array' | 'object'): NestedInfo => {
  const nestedInfo = inject<NestedInfo>('jsonforms.nestedInfo', { level: 0 });
  if (element) {
    provide('jsonforms.nestedInfo', {
      level: nestedInfo.level + 1,
      parentElement: element,
    });
  }
  return nestedInfo;
};

export const useIcons = () => {
  const iconSet = computed<IconAliases>(() => {
    const icons = inject(IconSymbol);
    if (!icons) throw new Error('Missing Vuetify Icons provide!');

    let result = mdiIcons; // default
    const overrides = icons.aliases;

    if (icons.defaultSet === 'fa') {
      result = faIcons;
    }

    return overrides ? { ...result, ...overrides } : result;
  });

  return {
    current: iconSet,
  };
};
