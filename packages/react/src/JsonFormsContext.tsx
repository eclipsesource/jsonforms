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
  i18nReducer
} from '@jsonforms/core';
import React, { ComponentType, Dispatch, ReducerAction, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

const initialCoreState: JsonFormsCore = {
  data: {},
  schema: {},
  uischema: undefined,
  errors: [],
  validator: undefined,
  ajv: undefined,
};

export interface JsonFormsStateContext extends JsonFormsSubStates {
  dispatch?: Dispatch<ReducerAction<typeof coreReducer>>;
}

export const JsonFormsContext = React.createContext<JsonFormsStateContext>({
  core: initialCoreState,
  renderers: []
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

export const JsonFormsStateProvider = ({ children, initState, onChange }: any) => {
  const { data, schema, uischema, ajv, validationMode } = initState.core;
  // Initialize core immediately
  const [core, coreDispatch] = useReducer(
    coreReducer,
    undefined,
    () => coreReducer(
      initState.core,
      Actions.init(data, schema, uischema, { ajv, validationMode })
    )
  );
  useEffect(() => {
    coreDispatch(
      Actions.updateCore(data, schema, uischema, { ajv, validationMode })
    );
  }, [data, schema, uischema, ajv, validationMode]);

  const [config, configDispatch] = useReducer(
    configReducer,
    undefined,
    () => configReducer(undefined, Actions.setConfig(initState.config))
  );
  useEffectAfterFirstRender(() => {
    configDispatch(Actions.setConfig(initState.config));
  }, [initState.config]);

  const [i18n, i18nDispatch] = useReducer(
    i18nReducer,
    undefined,
    () => i18nReducer(
      initState.i18n,
      Actions.updateI18n(initState.i18n?.locale, initState.i18n?.translate, initState.i18n?.translateError)
    )
  );
  useEffect(() => {
    i18nDispatch(
      Actions.updateI18n(initState.i18n?.locale, initState.i18n?.translate, initState.i18n?.translateError)
    );
  }, [initState.i18n?.locale, initState.i18n?.translate, initState.i18n?.translateError]);

  const contextValue = useMemo(() => ({
    core,
    renderers: initState.renderers,
    cells: initState.cells,
    config: config,
    uischemas: initState.uischemas,
    readonly: initState.readonly,
    i18n: i18n,
    // only core dispatch available
    dispatch: coreDispatch,
  }), [core, initState.renderers, initState.cells, config, initState.readonly, i18n]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ data: core.data, errors: core.errors });
  }, [core.data, core.errors]);

  return (
    <JsonFormsContext.Provider
      value={contextValue}
    >
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

export const ctxToArrayLayoutProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToArrayLayoutProps({ jsonforms: { ...ctx } }, props);

export const ctxToArrayControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToArrayControlProps({ jsonforms: { ...ctx } }, props);

export const ctxToLayoutProps = (ctx: JsonFormsStateContext, props: OwnPropsOfLayout): LayoutProps =>
  mapStateToLayoutProps({ jsonforms: { ...ctx } }, props);

export const ctxToControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToControlProps({ jsonforms: { ...ctx } }, props);

export const ctxToEnumControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfEnum) => {
  const enumProps = mapStateToEnumControlProps({ jsonforms: { ...ctx } }, props);
  /**
   * Make sure, that options are memoized as otherwise the component will rerender for every change, 
   * as the options array is recreated every time.
   */
  const options = useMemo(() => enumProps.options, [props.options, enumProps.schema]);
  return {...enumProps, options}
}

export const ctxToOneOfEnumControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl & OwnPropsOfEnum) => {
  const enumProps = mapStateToOneOfEnumControlProps({ jsonforms: { ...ctx } }, props);
  /**
   * Make sure, that options are memoized as otherwise the component will rerender for every change, 
   * as the options array is recreated every time.
   */
  const options = useMemo(() => enumProps.options, [props.options, enumProps.schema]);
  return {...enumProps, options}
  
}

export const ctxToMultiEnumControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToMultiEnumControlProps({ jsonforms: { ...ctx } }, props);

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
    ...props
  };
};

export const ctxDispatchToControlProps = (dispatch: Dispatch<ReducerAction<any>>): DispatchPropsOfControl =>
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
    ...dispatchProps
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
    ...dispatchProps
  };
};

export const ctxToJsonFormsDispatchProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfJsonFormsRenderer
) => mapStateToJsonFormsRendererProps({ jsonforms: { ...ctx } }, ownProps);

export const ctxDispatchToArrayControlProps = (dispatch: Dispatch<ReducerAction<any>>) => ({
    ...ctxDispatchToControlProps(dispatch),
    ...useMemo(() => mapDispatchToArrayControlProps(dispatch as any), [dispatch])
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
  const cellProps =  defaultMapStateToEnumCellProps({ jsonforms: { ...ctx } }, ownProps);
  /**
   * Make sure, that options are memoized as otherwise the cell will rerender for every change, 
   * as the options array is recreated every time.
   */
  const options = useMemo(() => cellProps.options, [ownProps.options, cellProps.schema]);
  return {...cellProps, options}
};

export const ctxToOneOfEnumCellProps = (
  ctx: JsonFormsStateContext,
  props: OwnPropsOfEnumCell
) => {
  const enumCellProps = mapStateToOneOfEnumCellProps({jsonforms: {...ctx}}, props);
  /**
   * Make sure, that options are memoized as otherwise the cell will rerender for every change, 
   * as the options array is recreated every time.
   */
  const options = useMemo(() => enumCellProps.options, [props.options, enumCellProps.schema])
  return {...enumCellProps, options};
};

export const ctxToDispatchCellProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfCell
) => {
  return mapStateToDispatchCellProps({ jsonforms: { ...ctx } }, ownProps);
};

export const ctxDispatchToMultiEnumProps = (dispatch: Dispatch<ReducerAction<any>>) => ({
    ...ctxDispatchToControlProps(dispatch),
    ...useMemo(() => mapDispatchToMultiEnumProps(dispatch as any), [dispatch])
});

// --

// HOCs utils

interface WithContext {
  ctx: JsonFormsStateContext;
}

export const withJsonFormsContext =
  (Component: ComponentType<WithContext & any>): ComponentType<any> => (props: any) => {
    const ctx = useJsonForms();
    return <Component ctx={ctx} props={props} />;
  };

const withContextToControlProps =
  (Component: ComponentType<ControlProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & ControlProps) => {
      const controlProps = ctxToControlProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...controlProps} {...dispatchProps} />);
    };

const withContextToLayoutProps =
  (Component: ComponentType<LayoutProps>): ComponentType<OwnPropsOfJsonFormsRenderer> =>
    ({ ctx, props }: JsonFormsStateContext & LayoutProps) => {
      const layoutProps = ctxToLayoutProps(ctx, props);
      return (<Component {...props} {...layoutProps} />);
    };

const withContextToOneOfProps =
  (Component: ComponentType<CombinatorRendererProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & CombinatorRendererProps) => {
      const oneOfProps = ctxToOneOfProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...oneOfProps} {...dispatchProps} />);
    };

const withContextToAnyOfProps =
  (Component: ComponentType<CombinatorRendererProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & CombinatorRendererProps) => {
      const oneOfProps = ctxToAnyOfProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...oneOfProps} {...dispatchProps} />);
    };

const withContextToAllOfProps =
  (Component: ComponentType<CombinatorRendererProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & CombinatorRendererProps) => {
      const allOfProps = ctxToAllOfProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...allOfProps} {...dispatchProps} />);
    };

const withContextToDetailProps =
  (Component: ComponentType<StatePropsOfControlWithDetail>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & StatePropsOfControlWithDetail) => {
      const detailProps = ctxToControlWithDetailProps(ctx, props);
      return (<Component {...detailProps} />);
    };

const withContextToArrayLayoutProps =
  (Component: ComponentType<ArrayLayoutProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & ArrayLayoutProps) => {
      const arrayLayoutProps = ctxToArrayLayoutProps(ctx, props);
      const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);
      return (<Component {...arrayLayoutProps} {...dispatchProps} />);
    };

const withContextToArrayControlProps =
  (Component: ComponentType<ArrayControlProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & ArrayControlProps) => {
      const stateProps = ctxToArrayControlProps(ctx, props);
      const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);

      return (<Component {...props} {...stateProps} {...dispatchProps} />);
    };

const withContextToMasterListItemProps =
  (Component: ComponentType<StatePropsOfMasterItem>): ComponentType<OwnPropsOfMasterListItem> =>
    ({ ctx, props }: JsonFormsStateContext & StatePropsOfMasterItem) => {
      const stateProps = ctxToMasterListItemProps(ctx, props);
      return (<Component {...stateProps} />);
    };

const withContextToCellProps =
  (Component: ComponentType<CellProps>): ComponentType<OwnPropsOfCell> =>
    ({ ctx, props }: JsonFormsStateContext & CellProps) => {
      const cellProps = ctxToCellProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);

      return (<Component {...props} {...dispatchProps} {...cellProps} />);
    };

const withContextToDispatchCellProps = (
  Component: ComponentType<DispatchCellProps>
): ComponentType<OwnPropsOfCell> => ({
  ctx,
  props
}: JsonFormsStateContext & CellProps) => {
    const cellProps = ctxToDispatchCellProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);

    return <Component {...props} {...dispatchProps} {...cellProps} />;
  };

const withContextToEnumCellProps =
  (Component: ComponentType<EnumCellProps>): ComponentType<OwnPropsOfEnumCell> =>
    ({ ctx, props }: JsonFormsStateContext & EnumCellProps) => {
      const cellProps = ctxToEnumCellProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...dispatchProps} {...cellProps}/>);
    };

const withContextToEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
    ({ ctx, props }: JsonFormsStateContext & ControlProps & OwnPropsOfEnum) => {
      const stateProps = ctxToEnumControlProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      
      return (<Component {...props} {...dispatchProps} {...stateProps} />);
    };

const withContextToOneOfEnumCellProps =
  (Component: ComponentType<EnumCellProps>): ComponentType<OwnPropsOfEnumCell> =>
    ({ ctx, props }: JsonFormsStateContext & EnumCellProps) => {
      const cellProps = ctxToOneOfEnumCellProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...dispatchProps} {...cellProps} />);
    };

const withContextToOneOfEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
    ({ ctx, props }: JsonFormsStateContext & ControlProps & OwnPropsOfEnum) => {
      const stateProps = ctxToOneOfEnumControlProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...dispatchProps} {...stateProps} />);
    };

const withContextToMultiEnumProps =
(Component: ComponentType<ControlProps & OwnPropsOfEnum>): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
  ({ ctx, props }: JsonFormsStateContext & ControlProps & OwnPropsOfEnum) => {
    const stateProps = ctxToMultiEnumControlProps(ctx, props);
    const dispatchProps = ctxDispatchToMultiEnumProps(ctx.dispatch);
    return (<Component {...props} {...dispatchProps} {...stateProps} />);
  };


// --

// top level HOCs --

export const withJsonFormsControlProps =
  (Component: ComponentType<ControlProps>, memoize = true): ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(withContextToControlProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsLayoutProps =
  (Component: ComponentType<LayoutProps>, memoize = true): ComponentType<OwnPropsOfLayout> =>
    withJsonFormsContext(withContextToLayoutProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsOneOfProps =
  (Component: ComponentType<CombinatorRendererProps>, memoize = true): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToOneOfProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsAnyOfProps =
  (Component: ComponentType<CombinatorRendererProps>, memoize = true): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToAnyOfProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsAllOfProps =
  (Component: ComponentType<CombinatorRendererProps>, memoize = true): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToAllOfProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsDetailProps =
  (Component: ComponentType<StatePropsOfControlWithDetail>, memoize = true): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToDetailProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsArrayLayoutProps =
  (Component: ComponentType<ArrayLayoutProps>, memoize = true): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToArrayLayoutProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsArrayControlProps =
  (Component: ComponentType<ArrayControlProps>, memoize = true): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToArrayControlProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsMasterListItemProps =
  (Component: ComponentType<StatePropsOfMasterItem>, memoize = true): ComponentType<OwnPropsOfMasterListItem> =>
    withJsonFormsContext(withContextToMasterListItemProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsCellProps =
  (Component: ComponentType<CellProps>, memoize = true): ComponentType<OwnPropsOfCell> =>
    withJsonFormsContext(withContextToCellProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsDispatchCellProps = (
  Component: ComponentType<DispatchCellProps>, memoize = true
): ComponentType<OwnPropsOfCell> =>
  withJsonFormsContext(withContextToDispatchCellProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsEnumCellProps =
  (Component: ComponentType<EnumCellProps>, memoize = true): ComponentType<OwnPropsOfEnumCell> =>
    withJsonFormsContext(withContextToEnumCellProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>, memoize = true): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
    withJsonFormsContext(withContextToEnumProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsOneOfEnumCellProps =
  (Component: ComponentType<EnumCellProps>, memoize = true): ComponentType<OwnPropsOfEnumCell> =>
    withJsonFormsContext(withContextToOneOfEnumCellProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsOneOfEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>, memoize = true): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
    withJsonFormsContext(withContextToOneOfEnumProps(memoize ? React.memo(Component) : Component));

export const withJsonFormsMultiEnumProps = (
  Component: ComponentType<ControlProps & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl>, memoize = true
): ComponentType<OwnPropsOfControl & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl> =>
  withJsonFormsContext(withContextToMultiEnumProps(memoize ? React.memo(Component) : Component));

// --
