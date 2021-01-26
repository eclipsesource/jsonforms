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
  StatePropsOfJsonFormsRenderer,
  mapStateToArrayLayoutProps,
  mapStateToCellProps,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  defaultMapStateToEnumCellProps,
  mapStateToDispatchCellProps
} from '@jsonforms/core';
import { CompType, inject, ref, watchEffect } from '../config';

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
    type: [Object, Boolean] as CompType<JsonSchema, [ObjectConstructor, BooleanConstructor]>
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
    type: Array as CompType<JsonFormsCellRendererRegistryEntry[], ArrayConstructor>,
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
    type: [Object, Boolean] as CompType<JsonSchema, [ObjectConstructor, BooleanConstructor]>
  },
  handleSelect: {
    required: false as false,
    type: Function as CompType<(index: number) => void, FunctionConstructor>,
    default: undefined
  },
  removeItem: {
    required: false as false,
    type: Function as CompType<(path: string, value: number) => void, FunctionConstructor>,
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

type Nullable<T> = {
  [P in keyof T]: P | null;
};

const controlInit = () => ({
  data: null,
  description: null,
  errors: null,
  label: null,
  visible: null,
  enabled: null,
  id: null,
  path: null,
  required: null,
  uischema: null,
  schema: null,
  config: null,
  cells: null,
  rootSchema: null
});

const controlWithDetailInit = () => ({
  ...controlInit(),
  uischemas: null
});

const arrayControlInit = () => ({
  ...controlWithDetailInit(),
  childErrors: null,
  renderers: null,
  cells: null
});

const arrayLayoutInit = () => ({
  ...controlWithDetailInit(),
  minItems: null,
  renderers: null,
  cells: null
});

const enumControlInit = () => ({
  ...controlInit(),
  options: null
});

const combinatorControlInit = () => ({
  ...controlWithDetailInit(),
  indexOfFittingSchema: null
});

const layoutInit = () => ({
  renderers: null,
  cells: null,
  visible: null,
  enabled: null,
  path: null,
  data: null,
  uischema: null,
  schema: null,
  direction: null
});

const rendererInit = () => ({
  renderers: null,
  cells: null,
  schema: null,
  rootSchema: null,
  uischema: null,
  path: null
});

const masterListItemInit = () => ({
  index: null,
  selected: null,
  path: null,
  schema: null,
  childLabel: null
});

const cellInit = () => ({
  data: null,
  visible: null,
  enabled: null,
  id: null,
  path: null,
  errors: null,
  isValid: null,
  schema: null,
  uischema: null,
  config: null,
  rootSchema: null,
  renderers: null,
  cells: null
});

const enumCellInit = () => ({
  ...cellInit(),
  options: null
});

type Required<T> = T extends object
  ? { [P in keyof T]-?: NonNullable<T[P]> }
  : T;

function useControl<R, D, P>(
  props: P,
  stateInit: () => Nullable<R>,
  stateMap: (state: JsonFormsState, props: P) => R
): { control: Required<R> };
function useControl<R, D, P>(
  props: P,
  stateInit: () => Nullable<R>,
  stateMap: (state: JsonFormsState, props: P) => R,
  dispatchMap: (dispatch: Dispatch<CoreActions>) => D
): { control: Required<R> } & D;
function useControl<R, D, P>(
  props: P,
  stateInit: () => Nullable<R>,
  stateMap: (state: JsonFormsState, props: P) => R,
  dispatchMap?: (dispatch: Dispatch<CoreActions>) => D
) {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms');
  const dispatch = inject<Dispatch<CoreActions>>('dispatch');

  if (!jsonforms || !dispatch) {
    throw "'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?";
  }

  const control = ref<Nullable<R>>(stateInit());
  watchEffect(() => {
    Object.assign(control.value, stateMap({ jsonforms }, props));
  });

  const dispatchMethods = dispatchMap?.(dispatch);

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
  return useControl(
    props,
    controlInit,
    mapStateToControlProps,
    mapDispatchToControlProps
  );
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
    controlWithDetailInit,
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
    enumControlInit,
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
    enumControlInit,
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
    arrayControlInit,
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
  return useControl(
    props,
    combinatorControlInit,
    mapStateToAllOfProps,
    mapDispatchToControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to 'anyOf' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsAnyOfControl = (props: ControlProps) => {
  return useControl(
    props,
    combinatorControlInit,
    mapStateToAnyOfProps,
    mapDispatchToControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to 'oneOf' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsOneOfControl = (props: ControlProps) => {
  return useControl(
    props,
    combinatorControlInit,
    mapStateToOneOfProps,
    mapDispatchToControlProps
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
  const { control, ...other } = useControl(
    props,
    layoutInit,
    mapStateToLayoutProps
  );
  return { layout: control, ...other };
};

/**
 * Provides bindings for 'Control' elements which resolve to 'array' elements which
 * shall be rendered as a layout instead of a control.
 *
 * Access bindings via the provided reactive 'layout' object.
 */
export const useJsonFormsArrayLayout = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    arrayLayoutInit,
    mapStateToArrayLayoutProps
  );
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
  >(props, masterListItemInit, mapStateToMasterListItemProps);
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

  const renderer = ref<
    Nullable<Omit<StatePropsOfJsonFormsRenderer, 'refResolver'>>
  >(rendererInit());
  const resolver = { refResolver: null };
  
  watchEffect(() => {
    const { refResolver, ...other } = mapStateToJsonFormsRendererProps(
      { jsonforms },
      props
    );
    Object.assign(renderer.value, other);
    resolver.refResolver = refResolver;
  });

  const refResolver = (schema: any) =>
    (resolver as Pick<
      StatePropsOfJsonFormsRenderer,
      'refResolver'
    >).refResolver(schema);

  return {
    renderer: (renderer as unknown) as Required<
      Omit<StatePropsOfJsonFormsRenderer, 'refResolver'>
    >,
    refResolver
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
    cellInit,
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
    enumCellInit,
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
    cellInit,
    mapStateToDispatchCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};
