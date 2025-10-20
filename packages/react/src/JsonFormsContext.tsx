/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import {
  Actions,
  ArrayControlProps,
  ArrayLayoutProps,
  CellProps,
  CombinatorRendererProps,
  ControlProps,
  defaultMapStateToEnumCellProps,
  DispatchCellProps,
  DispatchPropsOfControl,
  EnumCellProps,
  JsonFormsCore,
  JsonFormsProps,
  JsonFormsSubStates,
  LayoutProps,
  OwnPropsOfCell,
  OwnPropsOfControl,
  OwnPropsOfEnum,
  OwnPropsOfEnumCell,
  OwnPropsOfJsonFormsRenderer,
  OwnPropsOfLayout,
  OwnPropsOfMasterListItem,
  StatePropsOfControlWithDetail,
  StatePropsOfMasterItem,
  configReducer,
  coreReducer,
  mapStateToAllOfProps,
  mapStateToAnyOfProps,
  mapStateToArrayControlProps,
  mapStateToArrayLayoutProps,
  mapStateToCellProps,
  mapStateToControlProps,
  mapStateToControlWithDetailProps,
  mapStateToDispatchCellProps,
  mapStateToEnumControlProps,
  mapStateToJsonFormsRendererProps,
  mapStateToLayoutProps,
  mapStateToMasterListItemProps,
  mapStateToOneOfProps,
  mapStateToOneOfEnumControlProps,
  mapStateToOneOfEnumCellProps,
  mapDispatchToMultiEnumProps,
  mapStateToMultiEnumControlProps,
  DispatchPropsOfMultiEnumControl,
  mapDispatchToControlProps,
  mapDispatchToArrayControlProps,
  i18nReducer,
  Translator,
  defaultJsonFormsI18nState,
  OwnPropsOfLabel,
  LabelProps,
  mapStateToLabelProps,
  CoreActions,
  Middleware,
  defaultMiddleware,
  arrayDefaultTranslations,
  getArrayTranslations,
  ArrayTranslations,
} from '@jsonforms/core';
import debounce from 'lodash/debounce';
import React, {
  ComponentType,
  Dispatch,
  ReducerAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

const initialCoreState: JsonFormsCore = {
  data: {},
  schema: {},
  uischema: undefined,
  errors: [],
  additionalErrors: [],
  validator: undefined,
  ajv: undefined,
};

export interface JsonFormsStateContext extends JsonFormsSubStates {
  dispatch?: Dispatch<ReducerAction<typeof coreReducer>>;
}

export const JsonFormsContext = React.createContext<JsonFormsStateContext>({
  core: initialCoreState,
  renderers: [],
});

/**
 * Hook similar to `useEffect` with the difference that the effect
 * is only executed from the second call onwards.
 */
const useEffectAfterFirstRender = (
  effect: () => void,
  dependencies: Array<any>
) => {
  const firstExecution = useRef(true);
  useEffect(() => {
    if (firstExecution.current) {
      firstExecution.current = false;
      return;
    }
    effect();
  }, dependencies);
};

export const JsonFormsStateProvider = ({
  children,
  initState,
  onChange,
  middleware,
}: any) => {
  const { data, schema, uischema, ajv, validationMode, additionalErrors } =
    initState.core;

  const middlewareRef = useRef<Middleware>(middleware ?? defaultMiddleware);
  middlewareRef.current = middleware ?? defaultMiddleware;

  const [core, setCore] = useState<JsonFormsCore>(() =>
    middlewareRef.current(
      initState.core,
      Actions.init(data, schema, uischema, {
        ajv,
        validationMode,
        additionalErrors,
      }),
      coreReducer
    )
  );

  useEffect(
    () =>
      setCore((currentCore) =>
        middlewareRef.current(
          currentCore,
          Actions.updateCore(data, schema, uischema, {
            ajv,
            validationMode,
            additionalErrors,
          }),
          coreReducer
        )
      ),
    [data, schema, uischema, ajv, validationMode, additionalErrors]
  );

  const [config, configDispatch] = useReducer(configReducer, undefined, () =>
    configReducer(undefined, Actions.setConfig(initState.config))
  );
  useEffectAfterFirstRender(() => {
    configDispatch(Actions.setConfig(initState.config));
  }, [initState.config]);

  const [i18n, i18nDispatch] = useReducer(i18nReducer, undefined, () =>
    i18nReducer(
      initState.i18n,
      Actions.updateI18n(
        initState.i18n?.locale,
        initState.i18n?.translate,
        initState.i18n?.translateError
      )
    )
  );
  useEffect(() => {
    i18nDispatch(
      Actions.updateI18n(
        initState.i18n?.locale,
        initState.i18n?.translate,
        initState.i18n?.translateError
      )
    );
  }, [
    initState.i18n?.locale,
    initState.i18n?.translate,
    initState.i18n?.translateError,
  ]);

  const dispatch = useCallback((action: CoreActions) => {
    setCore((currentCore) =>
      middlewareRef.current(currentCore, action, coreReducer)
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      core,
      renderers: initState.renderers,
      cells: initState.cells,
      config: config,
      uischemas: initState.uischemas,
      readonly: initState.readonly,
      i18n: i18n,
      dispatch: dispatch,
    }),
    [
      core,
      initState.renderers,
      initState.cells,
      config,
      initState.uischemas,
      initState.readonly,
      i18n,
    ]
  );

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  /**
   * A common pattern for users of JSON Forms is to feed back the data which is emitted by
   * JSON Forms to JSON Forms ('controlled style').
   *
   * Every time this happens, we dispatch the 'updateCore' action which will be a no-op when
   * the data handed over is the one which was just recently emitted. This allows us to skip
   * rerendering for all normal cases of use.
   *
   * However there can be extreme use cases, for example when using Chrome Auto-fill for forms,
   * which can cause JSON Forms to emit multiple change events before the parent component is
   * rerendered. Therefore not the very recent data, but the previous data is fed back to
   * JSON Forms first. JSON Forms recognizes that this is not the very recent data and will
   * validate, rerender and emit a change event again. This can then lead to data loss or even
   * an endless rerender loop, depending on the emitted events chain.
   *
   * To handle these edge cases in which many change events are sent in an extremely short amount
   * of time we debounce them over a short amount of time. 10ms was chosen as this worked well
   * even on low-end mobile device settings in the Chrome simulator.
   */
  const debouncedEmit = useCallback(
    debounce((...args: any[]) => onChangeRef.current?.(...args), 10),
    []
  );
  useEffect(() => {
    debouncedEmit({ data: core.data, errors: core.errors });
  }, [core.data, core.errors]);

  return (
    <JsonFormsContext.Provider value={contextValue}>
      {children}
    </JsonFormsContext.Provider>
  );
};

export const useJsonForms = (): JsonFormsStateContext =>
  useContext(JsonFormsContext);

export interface JsonFormsReduxContextProps extends JsonFormsSubStates {
  children: any;
  dispatch: Dispatch<ReducerAction<any>>;
}

export const ctxToArrayLayoutProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfControl
) => mapStateToArrayLayoutProps({ jsonforms: { ...ctx } }, props);

export const ctxToArrayControlProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfControl
) => mapStateToArrayControlProps({ jsonforms: { ...ctx } }, props);

export const ctxToLayoutProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfLayout
): LayoutProps => mapStateToLayoutProps({ jsonforms: { ...ctx } }, props);

export const ctxToControlProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfControl
) => mapStateToControlProps({ jsonforms: { ...ctx } }, props);

export const ctxToEnumControlProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfEnum
) => {
  const enumProps = mapStateToEnumControlProps(
    { jsonforms: { ...ctx } },
    props
  );
  /**
   * Make sure, that options are memoized as otherwise the component will rerender for every change,
   * as the options array is recreated every time.
   */
  const options = useMemo(
    () => enumProps.options,
    [props.options, enumProps.schema, ctx.i18n?.translate]
  );
  return { ...enumProps, options };
};

export const ctxToOneOfEnumControlProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfControl & OwnPropsOfEnum
) => {
  const enumProps = mapStateToOneOfEnumControlProps(
    { jsonforms: { ...ctx } },
    props
  );
  /**
   * Make sure, that options are memoized as otherwise the component will rerender for every change,
   * as the options array is recreated every time.
   */
  const options = useMemo(
    () => enumProps.options,
    [props.options, enumProps.schema, ctx.i18n?.translate]
  );
  return { ...enumProps, options };
};

export const ctxToMultiEnumControlProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfControl
) => {
  const enumProps = mapStateToMultiEnumControlProps(
    { jsonforms: { ...ctx } },
    props
  );
  /**
   * Make sure, that options are memoized as otherwise the component will rerender for every change,
   * as the options array is recreated every time.
   */
  const options = useMemo(
    () => enumProps.options,
    [enumProps.schema, ctx.i18n?.translate]
  );
  return { ...enumProps, options };
};

export const ctxToControlWithDetailProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfControl
): StatePropsOfControlWithDetail =>
  mapStateToControlWithDetailProps({ jsonforms: { ...ctx } }, props);

export const ctxToAllOfProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfControl
) => {
  const props = mapStateToAllOfProps({ jsonforms: { ...ctx } }, ownProps);
  return {
    ...props,
  };
};

export const ctxDispatchToControlProps = (
  dispatch: Dispatch<ReducerAction<any>>
): DispatchPropsOfControl =>
  useMemo(() => mapDispatchToControlProps(dispatch as any), [dispatch]);

// context mappers

export const ctxToAnyOfProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfControl
): CombinatorRendererProps => {
  const props = mapStateToAnyOfProps({ jsonforms: { ...ctx } }, ownProps);
  const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
  return {
    ...props,
    ...dispatchProps,
  };
};

export const ctxToOneOfProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfControl
): CombinatorRendererProps => {
  const props = mapStateToOneOfProps({ jsonforms: { ...ctx } }, ownProps);
  const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
  return {
    ...props,
    ...dispatchProps,
  };
};

export const ctxToJsonFormsRendererProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfJsonFormsRenderer
) => mapStateToJsonFormsRendererProps({ jsonforms: { ...ctx } }, ownProps);

export const ctxDispatchToArrayControlProps = (
  dispatch: Dispatch<ReducerAction<any>>
) => ({
  ...ctxDispatchToControlProps(dispatch),
  ...useMemo(() => mapDispatchToArrayControlProps(dispatch as any), [dispatch]),
});

export const ctxToMasterListItemProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfMasterListItem
) => mapStateToMasterListItemProps({ jsonforms: { ...ctx } }, ownProps);

export const ctxToCellProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfCell
) => {
  return mapStateToCellProps({ jsonforms: { ...ctx } }, ownProps);
};

export const ctxToEnumCellProps = (
  ctx: JsonFormsStateContext,
  ownProps: EnumCellProps
) => {
  const cellProps = defaultMapStateToEnumCellProps(
    { jsonforms: { ...ctx } },
    ownProps
  );
  /**
   * Make sure, that options are memoized as otherwise the cell will rerender for every change,
   * as the options array is recreated every time.
   */
  const options = useMemo(
    () => cellProps.options,
    [ownProps.options, cellProps.schema, ctx.i18n?.translate]
  );
  return { ...cellProps, options };
};

export const ctxToOneOfEnumCellProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfEnumCell
) => {
  const enumCellProps = mapStateToOneOfEnumCellProps(
    { jsonforms: { ...ctx } },
    props
  );
  /**
   * Make sure, that options are memoized as otherwise the cell will rerender for every change,
   * as the options array is recreated every time.
   */
  const options = useMemo(
    () => enumCellProps.options,
    [props.options, enumCellProps.schema, ctx.i18n?.translate]
  );
  return { ...enumCellProps, options };
};

export const ctxToDispatchCellProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfCell
) => {
  return mapStateToDispatchCellProps({ jsonforms: { ...ctx } }, ownProps);
};

export const ctxDispatchToMultiEnumProps = (
  dispatch: Dispatch<ReducerAction<any>>
) => ({
  ...ctxDispatchToControlProps(dispatch),
  ...useMemo(() => mapDispatchToMultiEnumProps(dispatch as any), [dispatch]),
});

export const ctxToLabelProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfLabel
) => {
  return mapStateToLabelProps({ jsonforms: { ...ctx } }, ownProps);
};

// --

// HOCs utils

interface WithContext {
  ctx: JsonFormsStateContext;
}

export const withJsonFormsContext = (
  Component: ComponentType<WithContext & any>
): ComponentType<any> =>
  function WithJsonFormsContext(props: any) {
    const ctx = useJsonForms();
    return <Component ctx={ctx} props={props} />;
  };

export const withContextToJsonFormsRendererProps = (
  Component: ComponentType<JsonFormsProps>
): ComponentType<OwnPropsOfJsonFormsRenderer> =>
  function WithContextToJsonFormsRendererProps({
    ctx,
    props,
  }: JsonFormsStateContext & JsonFormsProps) {
    const contextProps = ctxToJsonFormsRendererProps(ctx, props);
    return <Component {...props} {...contextProps} />;
  };

const withContextToControlProps = (
  Component: ComponentType<ControlProps>
): ComponentType<OwnPropsOfControl> =>
  function WithContextToControlProps({
    ctx,
    props,
  }: JsonFormsStateContext & ControlProps) {
    const controlProps = ctxToControlProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    return <Component {...props} {...controlProps} {...dispatchProps} />;
  };

const withContextToLayoutProps = (
  Component: ComponentType<LayoutProps>
): ComponentType<OwnPropsOfJsonFormsRenderer> =>
  function WithContextToLayoutProps({
    ctx,
    props,
  }: JsonFormsStateContext & LayoutProps) {
    const layoutProps = ctxToLayoutProps(ctx, props);
    return <Component {...props} {...layoutProps} />;
  };

const withContextToOneOfProps = (
  Component: ComponentType<CombinatorRendererProps>
): ComponentType<OwnPropsOfControl> =>
  function WithContextToOneOfProps({
    ctx,
    props,
  }: JsonFormsStateContext & CombinatorRendererProps) {
    const oneOfProps = ctxToOneOfProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    return <Component {...props} {...oneOfProps} {...dispatchProps} />;
  };

const withContextToAnyOfProps = (
  Component: ComponentType<CombinatorRendererProps>
): ComponentType<OwnPropsOfControl> =>
  function WithContextToAnyOfProps({
    ctx,
    props,
  }: JsonFormsStateContext & CombinatorRendererProps) {
    const oneOfProps = ctxToAnyOfProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    return <Component {...props} {...oneOfProps} {...dispatchProps} />;
  };

const withContextToAllOfProps = (
  Component: ComponentType<CombinatorRendererProps>
): ComponentType<OwnPropsOfControl> =>
  function WithContextToAllOfProps({
    ctx,
    props,
  }: JsonFormsStateContext & CombinatorRendererProps) {
    const allOfProps = ctxToAllOfProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    return <Component {...props} {...allOfProps} {...dispatchProps} />;
  };

const withContextToDetailProps = (
  Component: ComponentType<StatePropsOfControlWithDetail>
): ComponentType<OwnPropsOfControl> =>
  function WithContextToDetailProps({
    ctx,
    props,
  }: JsonFormsStateContext & StatePropsOfControlWithDetail) {
    const detailProps = ctxToControlWithDetailProps(ctx, props);
    return <Component {...props} {...detailProps} />;
  };

const withContextToArrayLayoutProps = (
  Component: ComponentType<ArrayLayoutProps>
): ComponentType<OwnPropsOfControl> =>
  function WithContextToArrayLayoutProps({
    ctx,
    props,
  }: JsonFormsStateContext & ArrayLayoutProps) {
    const arrayLayoutProps = ctxToArrayLayoutProps(ctx, props);
    const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);
    return <Component {...props} {...arrayLayoutProps} {...dispatchProps} />;
  };

const withContextToArrayControlProps = (
  Component: ComponentType<ArrayControlProps>
): ComponentType<OwnPropsOfControl> =>
  function WithContextToArrayControlProps({
    ctx,
    props,
  }: JsonFormsStateContext & ArrayControlProps) {
    const stateProps = ctxToArrayControlProps(ctx, props);
    const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);

    return <Component {...props} {...stateProps} {...dispatchProps} />;
  };

const withContextToMasterListItemProps = (
  Component: ComponentType<StatePropsOfMasterItem>
): ComponentType<OwnPropsOfMasterListItem> =>
  function WithContextToMasterListItemProps({
    ctx,
    props,
  }: JsonFormsStateContext & StatePropsOfMasterItem) {
    const stateProps = ctxToMasterListItemProps(ctx, props);
    return <Component {...props} {...stateProps} />;
  };

const withContextToCellProps = (
  Component: ComponentType<CellProps>
): ComponentType<OwnPropsOfCell> =>
  function WithContextToCellProps({
    ctx,
    props,
  }: JsonFormsStateContext & CellProps) {
    const cellProps = ctxToCellProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);

    return <Component {...props} {...dispatchProps} {...cellProps} />;
  };

const withContextToDispatchCellProps = (
  Component: ComponentType<DispatchCellProps>
): ComponentType<OwnPropsOfCell> =>
  function WithContextToDispatchCellProps({
    ctx,
    props,
  }: JsonFormsStateContext & CellProps) {
    const cellProps = ctxToDispatchCellProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);

    return <Component {...props} {...dispatchProps} {...cellProps} />;
  };

const withContextToEnumCellProps = (
  Component: ComponentType<EnumCellProps>
): ComponentType<OwnPropsOfEnumCell> =>
  function WithContextToEnumCellProps({
    ctx,
    props,
  }: JsonFormsStateContext & EnumCellProps) {
    const cellProps = ctxToEnumCellProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    return <Component {...props} {...dispatchProps} {...cellProps} />;
  };

const withContextToEnumProps = (
  Component: ComponentType<ControlProps & OwnPropsOfEnum>
): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
  function WithContextToEnumProps({
    ctx,
    props,
  }: JsonFormsStateContext & ControlProps & OwnPropsOfEnum) {
    const stateProps = ctxToEnumControlProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);

    return <Component {...props} {...dispatchProps} {...stateProps} />;
  };

const withContextToOneOfEnumCellProps = (
  Component: ComponentType<EnumCellProps>
): ComponentType<OwnPropsOfEnumCell> =>
  function WithContextToOneOfEnumCellProps({
    ctx,
    props,
  }: JsonFormsStateContext & EnumCellProps) {
    const cellProps = ctxToOneOfEnumCellProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    return <Component {...props} {...dispatchProps} {...cellProps} />;
  };

const withContextToOneOfEnumProps = (
  Component: ComponentType<ControlProps & OwnPropsOfEnum>
): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
  function WithContextToOneOfEnumProps({
    ctx,
    props,
  }: JsonFormsStateContext & ControlProps & OwnPropsOfEnum) {
    const stateProps = ctxToOneOfEnumControlProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    return <Component {...props} {...dispatchProps} {...stateProps} />;
  };

const withContextToMultiEnumProps = (
  Component: ComponentType<ControlProps & OwnPropsOfEnum>
): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
  function WithContextToMultiEnumProps({
    ctx,
    props,
  }: JsonFormsStateContext & ControlProps & OwnPropsOfEnum) {
    const stateProps = ctxToMultiEnumControlProps(ctx, props);
    const dispatchProps = ctxDispatchToMultiEnumProps(ctx.dispatch);
    return <Component {...props} {...dispatchProps} {...stateProps} />;
  };

const withContextToLabelProps = (
  Component: ComponentType<LabelProps>
): ComponentType<OwnPropsOfLabel> =>
  function WithContextToLabelProps({
    ctx,
    props,
  }: JsonFormsStateContext & LabelProps & OwnPropsOfLabel) {
    const stateProps = ctxToLabelProps(ctx, props);
    return <Component {...props} {...stateProps} />;
  };

// --

// top level HOCs --

export const withJsonFormsRendererProps = (
  Component: ComponentType<JsonFormsProps>,
  memoize = true
): ComponentType<OwnPropsOfJsonFormsRenderer> =>
  withJsonFormsContext(
    withContextToJsonFormsRendererProps(
      memoize ? React.memo(Component) : Component
    )
  );

export const withJsonFormsControlProps = (
  Component: ComponentType<ControlProps>,
  memoize = true
): ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(
    withContextToControlProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsLayoutProps = <T extends LayoutProps>(
  Component: ComponentType<T>,
  memoize = true
): ComponentType<T & OwnPropsOfLayout> =>
  withJsonFormsContext(
    withContextToLayoutProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsOneOfProps = (
  Component: ComponentType<CombinatorRendererProps>,
  memoize = true
): ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(
    withContextToOneOfProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsAnyOfProps = (
  Component: ComponentType<CombinatorRendererProps>,
  memoize = true
): ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(
    withContextToAnyOfProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsAllOfProps = (
  Component: ComponentType<CombinatorRendererProps>,
  memoize = true
): ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(
    withContextToAllOfProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsDetailProps = (
  Component: ComponentType<StatePropsOfControlWithDetail>,
  memoize = true
): ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(
    withContextToDetailProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsArrayLayoutProps = (
  Component: ComponentType<ArrayLayoutProps>,
  memoize = true
): ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(
    withContextToArrayLayoutProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsArrayControlProps = (
  Component: ComponentType<ArrayControlProps>,
  memoize = true
): ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(
    withContextToArrayControlProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsMasterListItemProps = (
  Component: ComponentType<StatePropsOfMasterItem>,
  memoize = true
): ComponentType<OwnPropsOfMasterListItem> =>
  withJsonFormsContext(
    withContextToMasterListItemProps(
      memoize ? React.memo(Component) : Component
    )
  );

export const withJsonFormsCellProps = (
  Component: ComponentType<CellProps>,
  memoize = true
): ComponentType<OwnPropsOfCell> =>
  withJsonFormsContext(
    withContextToCellProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsDispatchCellProps = (
  Component: ComponentType<DispatchCellProps>,
  memoize = true
): ComponentType<OwnPropsOfCell> =>
  withJsonFormsContext(
    withContextToDispatchCellProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsEnumCellProps = (
  Component: ComponentType<EnumCellProps>,
  memoize = true
): ComponentType<OwnPropsOfEnumCell> =>
  withJsonFormsContext(
    withContextToEnumCellProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsEnumProps = (
  Component: ComponentType<ControlProps & OwnPropsOfEnum>,
  memoize = true
): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
  withJsonFormsContext(
    withContextToEnumProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsOneOfEnumCellProps = (
  Component: ComponentType<EnumCellProps>,
  memoize = true
): ComponentType<OwnPropsOfEnumCell> =>
  withJsonFormsContext(
    withContextToOneOfEnumCellProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsOneOfEnumProps = (
  Component: ComponentType<ControlProps & OwnPropsOfEnum>,
  memoize = true
): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
  withJsonFormsContext(
    withContextToOneOfEnumProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsMultiEnumProps = (
  Component: ComponentType<
    ControlProps & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl
  >,
  memoize = true
): ComponentType<
  OwnPropsOfControl & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl
> =>
  withJsonFormsContext(
    withContextToMultiEnumProps(memoize ? React.memo(Component) : Component)
  );

export const withJsonFormsLabelProps = (
  Component: ComponentType<LabelProps & OwnPropsOfEnum>,
  memoize = true
): ComponentType<OwnPropsOfLabel> =>
  withJsonFormsContext(
    withContextToLabelProps(memoize ? React.memo(Component) : Component)
  );

// Util HOCs

export interface TranslateProps {
  t: Translator;
  locale: string;
}

// TODO fix @typescript-eslint/ban-types
// eslint-disable-next-line @typescript-eslint/ban-types
export const withTranslateProps = <P extends {}>(
  Component: ComponentType<TranslateProps & P>
) =>
  function WithTranslateProps(props: P) {
    const ctx = useJsonForms();
    const locale = ctx.i18n?.locale ?? defaultJsonFormsI18nState.locale;
    const t = ctx.i18n?.translate ?? defaultJsonFormsI18nState.translate;

    return <Component {...props} locale={locale} t={t} />;
  };

export const withArrayTranslationProps = <P extends ArrayLayoutProps>(
  Component: ComponentType<P & { translations: ArrayTranslations }>
) =>
  function withArrayTranslatationProps(props: P & TranslateProps) {
    const translations = useMemo(
      () =>
        getArrayTranslations(
          props.t,
          arrayDefaultTranslations,
          props.i18nKeyPrefix,
          props.label
        ),
      [props.t, props.i18nKeyPrefix, props.label]
    );
    return <Component {...props} translations={translations} />;
  };
