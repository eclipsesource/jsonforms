import {
  ControlElement,
  Dispatch,
  Layout,
  mapDispatchToControlProps,
  mapStateToControlProps,
  mapStateToLayoutProps,
  JsonFormsSubStates,
  JsonSchema,
  UISchemaElement,
  CoreActions,
  mapStateToEnumControlProps,
  JsonFormsState,
  mapStateToOneOfEnumControlProps,
  OwnPropsOfMasterListItem,
  mapStateToMasterListItemProps,
  mapStateToControlWithDetailProps,
  mapStateToArrayControlProps,
  mapDispatchToArrayControlProps,
  mapStateToAllOfProps,
  mapStateToAnyOfProps,
  mapStateToOneOfProps,
  mapStateToJsonFormsRendererProps,
  mapStateToArrayLayoutProps,
  mapStateToCellProps,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  defaultMapStateToEnumCellProps,
  mapStateToDispatchCellProps,
  mapStateToOneOfEnumCellProps,
  StatePropsOfJsonFormsRenderer,
  createId,
  removeId,
  mapStateToMultiEnumControlProps,
  mapDispatchToMultiEnumProps,
  mapStateToLabelProps,
  LabelElement,
} from '@jsonforms/core';
import {
  PropType,
  computed,
  ComputedRef,
  inject,
  onBeforeMount,
  onUnmounted,
  ref,
} from 'vue';

/**
 * Constructs a props declaration for Vue components which can be used
 * for registered renderers and cells. These are typically used in combination
 * with one of the provided bindings, e.g. 'useJsonFormsControl'.
 *
 * Use the generic type parameter when using a specialized binding, e.g.
 * `rendererProps<Layout>()` in combination with `useJsonFormsLayout` or
 * `rendererProps<ControlElement>()` in combination with `useJsonFormsControl`.
 */
export const rendererProps = <U = UISchemaElement>() => ({
  schema: {
    required: true as const,
    type: [Object, Boolean] as PropType<JsonSchema>,
  },
  uischema: {
    required: true as const,
    type: Object as PropType<U>,
  },
  path: {
    required: true as const,
    type: String,
  },
  enabled: {
    required: false as const,
    type: Boolean,
    default: undefined,
  },
  renderers: {
    required: false,
    type: Array as PropType<JsonFormsRendererRegistryEntry[]>,
    default: undefined,
  },
  cells: {
    required: false,
    type: Array as PropType<JsonFormsCellRendererRegistryEntry[]>,
    default: undefined,
  },
  config: {
    required: false,
    type: Object,
    default: undefined,
  },
});

/**
 * Constructs a props declaration for Vue components which shall be used as
 * master list items.
 */
export const masterListItemProps = () => ({
  index: {
    required: true as const,
    type: Number,
  },
  selected: {
    required: true as const,
    type: Boolean,
  },
  path: {
    required: true as const,
    type: String,
  },
  schema: {
    required: true as const,
    type: [Object, Boolean] as PropType<JsonSchema>,
  },
  handleSelect: {
    required: false as const,
    type: Function as PropType<(index: number) => void>,
    default: undefined,
  },
  removeItem: {
    required: false as const,
    type: Function as PropType<(path: string, value: number) => void>,
    default: undefined,
  },
});

export interface RendererProps<U = UISchemaElement> {
  schema: JsonSchema;
  uischema: U;
  path: string;
  enabled?: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  config?: any;
}

export interface ControlProps extends RendererProps {
  uischema: ControlElement;
}

export type Required<T> = T extends object
  ? { [P in keyof T]-?: NonNullable<T[P]> }
  : T;

// TODO fix @typescript-eslint/ban-types
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
export function useControl<R, D, P extends {}>(
  props: P,
  stateMap: (state: JsonFormsState, props: P) => R
): { control: ComputedRef<Required<R>> };
// TODO fix @typescript-eslint/ban-types
// eslint-disable-next-line @typescript-eslint/ban-types
export function useControl<R, D, P extends {}>(
  props: P,
  stateMap: (state: JsonFormsState, props: P) => R,
  dispatchMap: (dispatch: Dispatch<CoreActions>) => D
): { control: ComputedRef<Required<R>> } & D;
// TODO fix @typescript-eslint/ban-types
// eslint-disable-next-line @typescript-eslint/ban-types
export function useControl<R, D, P extends {}>(
  props: P,
  stateMap: (state: JsonFormsState, props: P) => R,
  dispatchMap?: (dispatch: Dispatch<CoreActions>) => D
) {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms');
  const dispatch = inject<Dispatch<CoreActions>>('dispatch');

  if (!jsonforms || !dispatch) {
    throw "'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?";
  }

  const id = ref<string | undefined>(undefined);
  const control = computed(() => ({
    ...props,
    ...stateMap({ jsonforms }, props),
    id: id.value,
  }));

  const dispatchMethods = dispatchMap?.(dispatch);

  onBeforeMount(() => {
    if ((control.value as any).uischema.scope) {
      id.value = createId((control.value as any).uischema.scope);
    }
  });

  onUnmounted(() => {
    if (id.value) {
      removeId(id.value);
      id.value = undefined;
    }
  });

  return {
    control: control as unknown as ComputedRef<R>,
    ...dispatchMethods,
  };
}

/**
 * Provides generic bindings for 'Control' elements.
 * Should be used when no specialized bindings are appropriate.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsControl = (props: ControlProps) => {
  return useControl(props, mapStateToControlProps, mapDispatchToControlProps);
};

/**
 * Provides bindings for 'Control' elements which can provide a 'detail',
 * for example array and object renderers.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsControlWithDetail = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToControlWithDetailProps,
    mapDispatchToControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to 'enum' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsEnumControl = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToEnumControlProps,
    mapDispatchToControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to manually constructed
 * 'oneOf' enums. These are used to enhance enums with label support.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsOneOfEnumControl = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToOneOfEnumControlProps,
    mapDispatchToControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to 'array' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsArrayControl = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToArrayControlProps,
    mapDispatchToArrayControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to 'allOf' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsAllOfControl = (props: ControlProps) => {
  return useControl(props, mapStateToAllOfProps, mapDispatchToControlProps);
};

/**
 * Provides bindings for 'Control' elements which resolve to 'anyOf' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsAnyOfControl = (props: ControlProps) => {
  return useControl(props, mapStateToAnyOfProps, mapDispatchToControlProps);
};

/**
 * Provides bindings for 'Control' elements which resolve to 'oneOf' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsOneOfControl = (props: ControlProps) => {
  return useControl(props, mapStateToOneOfProps, mapDispatchToControlProps);
};

/**
 * Provides bindings for 'Control' elements which resolve to multiple choice enums.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsMultiEnumControl = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToMultiEnumControlProps,
    mapDispatchToMultiEnumProps
  );
};

export interface LayoutProps extends RendererProps {
  uischema: Layout;
}

/**
 * Provides bindings for 'Layout' elements, e.g. VerticalLayout, HorizontalLayout, Group.
 *
 * Access bindings via the provided reactive 'layout' object.
 */
export const useJsonFormsLayout = (props: LayoutProps) => {
  const { control, ...other } = useControl(props, mapStateToLayoutProps);
  return { layout: control, ...other };
};

/**
 * Provides bindings for 'Control' elements which resolve to 'array' elements which
 * shall be rendered as a layout instead of a control.
 *
 * Access bindings via the provided reactive 'layout' object.
 */
export const useJsonFormsArrayLayout = (props: ControlProps) => {
  const { control, ...other } = useControl(props, mapStateToArrayLayoutProps);
  return { layout: control, ...other };
};

/**
 * Provides bindings for list elements of a master-list-detail control setup.
 * The element using this binding is not supposed to be registered as an own renderer
 * but used in a more specialized control.
 *
 * Access bindings via the provided reactive 'item' object.
 */
export const useJsonFormsMasterListItem = (props: OwnPropsOfMasterListItem) => {
  const { control, ...other } = useControl<
    Omit<OwnPropsOfMasterListItem, 'handleSelect' | 'removeItem'>,
    unknown,
    OwnPropsOfMasterListItem
  >(props, mapStateToMasterListItemProps);
  return { item: control, ...other };
};

/**
 * Provides specialized bindings which can be used for any renderer.
 * Useful for meta elements like dispatchers.
 *
 * Access bindings via the provided reactive 'renderer' object.
 */
export const useJsonFormsRenderer = (props: RendererProps) => {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms');
  const dispatch = inject<Dispatch<CoreActions>>('dispatch');

  if (!jsonforms || !dispatch) {
    throw "'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?";
  }

  const rawProps = computed(
    () =>
      mapStateToJsonFormsRendererProps(
        { jsonforms },
        props
      ) as Required<StatePropsOfJsonFormsRenderer>
  );

  const rootSchema = computed(() => rawProps.value.rootSchema);
  const renderer = computed(() => {
    const { rootSchema: _rootSchema, ...rest } = rawProps.value;
    return rest;
  });

  return {
    renderer,
    rootSchema,
  };
};

/**
 * Provides bindings for 'Label' elements.
 *
 * Access bindings via the provided reactive `label` object.
 */
export const useJsonFormsLabel = (props: RendererProps<LabelElement>) => {
  const { control, ...other } = useControl(props, mapStateToLabelProps);
  return { label: control, ...other };
};

/**
 * Provides bindings for cell elements. Cells are meant to show simple inputs,
 * for example without error validation, within a larger structure like tables.
 *
 * Access bindings via the provided reactive 'cell' object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

/**
 * Provides bindings for enum cell elements. Cells are meant to show simple inputs,
 * for example without error validation, within a larger structure like tables.
 *
 * Access bindings via the provided reactive 'cell' object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsEnumCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    defaultMapStateToEnumCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

/**
 * Provides bindings for 'oneOf' enum cell elements. Cells are meant to show simple inputs,
 * for example without error validation, within a larger structure like tables.
 *
 * Access bindings via the provided reactive 'cell' object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsOneOfEnumCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToOneOfEnumCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

/**
 * Provides bindings for a cell dispatcher. Cells are meant to show simple inputs,
 * for example without error validation, within a larger structure like tables.
 *
 * Access bindings via the provided reactive 'cell' object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsDispatchCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToDispatchCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};
