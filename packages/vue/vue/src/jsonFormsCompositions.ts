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
  StatePropsOfJsonFormsRenderer,
  createId,
  removeId
} from '@jsonforms/core';
import {
  CompType,
  computed,
  inject,
  onBeforeMount,
  onUnmounted,
  ref
} from '../config';

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
    required: true as true,
    type: [Object, Boolean] as CompType<
      JsonSchema,
      [ObjectConstructor, BooleanConstructor]
    >
  },
  uischema: {
    required: true as true,
    type: Object as CompType<U, ObjectConstructor>
  },
  path: {
    required: true as true,
    type: String
  },
  enabled: {
    required: false as false,
    type: Boolean,
    default: undefined
  },
  renderers: {
    required: false,
    type: Array as CompType<JsonFormsRendererRegistryEntry[], ArrayConstructor>,
    default: undefined
  },
  cells: {
    required: false,
    type: Array as CompType<
      JsonFormsCellRendererRegistryEntry[],
      ArrayConstructor
    >,
    default: undefined
  }
});

/**
 * Constructs a props declaration for Vue components which shall be used as
 * master list items.
 */
export const masterListItemProps = () => ({
  index: {
    required: true as true,
    type: Number
  },
  selected: {
    required: true as true,
    type: Boolean
  },
  path: {
    required: true as true,
    type: String
  },
  schema: {
    required: true as true,
    type: [Object, Boolean] as CompType<
      JsonSchema,
      [ObjectConstructor, BooleanConstructor]
    >
  },
  handleSelect: {
    required: false as false,
    type: Function as CompType<(index: number) => void, FunctionConstructor>,
    default: undefined
  },
  removeItem: {
    required: false as false,
    type: Function as CompType<
      (path: string, value: number) => void,
      FunctionConstructor
    >,
    default: undefined
  }
});

export interface RendererProps<U = UISchemaElement> {
  schema: JsonSchema;
  uischema: U;
  path: string;
  enabled?: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
}

export interface ControlProps extends RendererProps {
  uischema: ControlElement;
}

export type Required<T> = T extends object
  ? { [P in keyof T]-?: NonNullable<T[P]> }
  : T;

export function useControl<R, D, P extends {}>(
  props: P,
  stateMap: (state: JsonFormsState, props: P) => R
): { control: Required<R> };
export function useControl<R, D, P extends {}>(
  props: P,
  stateMap: (state: JsonFormsState, props: P) => R,
  dispatchMap: (dispatch: Dispatch<CoreActions>) => D
): { control: Required<R> } & D;
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
    ...stateMap({ jsonforms }, props),
    id: id.value
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
    control: (control as unknown) as R,
    ...dispatchMethods
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
 * Offers a 'refResolver' method to trigger json-schema-ref-resolver.
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

  const refResolver = computed(() => rawProps.value.refResolver);
  const rootSchema = computed(() => rawProps.value.rootSchema);
  const renderer = computed(() => {
    const { refResolver, rootSchema, ...rest} = rawProps.value;
    return rest;
  });

  return {
    renderer,
    refResolver,
    rootSchema
  };
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
