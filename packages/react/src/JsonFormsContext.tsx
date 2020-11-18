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
  CombinatorProps,
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
  OwnPropsOfRenderer,
  StatePropsOfCombinator,
  StatePropsOfControlWithDetail,
  StatePropsOfMasterItem,
  configReducer,
  coreReducer,
  mapDispatchToArrayControlProps,
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
  update
} from '@jsonforms/core';
import React, { ComponentType, Dispatch, ReducerAction, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

const initialCoreState: JsonFormsCore = {
  data: {},
  schema: {},
  uischema: undefined,
  errors: [],
  validator: () => true,
  ajv: undefined,
  refParserOptions: undefined
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
  const { data, schema, uischema, ajv, refParserOptions , validationMode} = initState.core;
  // Initialize core immediately
  const [core, coreDispatch] = useReducer(
    coreReducer,
    undefined,
    () => coreReducer(
      initState.core,
      Actions.init(data, schema, uischema, { ajv, refParserOptions, validationMode })
    )
  );
  useEffect(() => {
    coreDispatch(
      Actions.updateCore(data, schema, uischema, { ajv, refParserOptions, validationMode })
    );
  }, [data, schema, uischema, ajv, refParserOptions, validationMode]);

  const [config, configDispatch] = useReducer(
    configReducer,
    undefined,
    () => configReducer(undefined, Actions.setConfig(initState.config))
  );
  useEffectAfterFirstRender(() => {
    configDispatch(Actions.setConfig(initState.config));
  }, [initState.config]);

  const contextValue = useMemo(() => ({
    core,
    renderers: initState.renderers,
    cells: initState.cells,
    config: config,
        uischemas: initState.uischemas,
    readonly: initState.readonly,
    // only core dispatch available
    dispatch: coreDispatch,
  }), [core, initState.renderers, initState.cells, config, initState.readonly]);

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

export const ctxToEnumControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToEnumControlProps({ jsonforms: { ...ctx } }, props);

export const ctxToOneOfEnumControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToOneOfEnumControlProps({ jsonforms: { ...ctx } }, props);

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

export const ctxDispatchToControlProps = (dispatch: Dispatch<ReducerAction<any>>): DispatchPropsOfControl => ({
  handleChange: useCallback((path, value) => {
    dispatch(update(path, () => value));
  }, [dispatch, update])
});

// context mappers

export const ctxToAnyOfProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfControl
): CombinatorProps => {
  const props = mapStateToAnyOfProps({ jsonforms: { ...ctx } }, ownProps);
  const { handleChange } = ctxDispatchToControlProps(ctx.dispatch);
  return {
    ...props,
    handleChange
  };
};

export const ctxToOneOfProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfControl
): CombinatorProps => {
  const props = mapStateToOneOfProps({ jsonforms: { ...ctx } }, ownProps);
  const { handleChange } = ctxDispatchToControlProps(ctx.dispatch);
  return {
    ...props,
    handleChange
  };
};

export const ctxToJsonFormsDispatchProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfJsonFormsRenderer
) => mapStateToJsonFormsRendererProps({ jsonforms: { ...ctx } }, ownProps);

export const ctxDispatchToArrayControlProps = (dispatch: Dispatch<ReducerAction<any>>) =>
  mapDispatchToArrayControlProps(dispatch as any);

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
  ownProps: OwnPropsOfCell
) => {
  return defaultMapStateToEnumCellProps({ jsonforms: { ...ctx } }, ownProps);
};

export const ctxToDispatchCellProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfCell
) => {
  return mapStateToDispatchCellProps({ jsonforms: { ...ctx } }, ownProps);
};
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
      const { handleChange } = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...controlProps} handleChange={handleChange} />);
    };

const withContextToLayoutProps =
  (Component: ComponentType<LayoutProps>): ComponentType<OwnPropsOfJsonFormsRenderer> =>
    ({ ctx, props }: JsonFormsStateContext & LayoutProps) => {
      const layoutProps = ctxToLayoutProps(ctx, props);
      return (<Component {...props} {...layoutProps} />);
    };

const withContextToOneOfProps =
  (Component: ComponentType<CombinatorProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & CombinatorProps) => {
      const oneOfProps = ctxToOneOfProps(ctx, props);
      const { handleChange } = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...oneOfProps} handleChange={handleChange} />);
    };

const withContextToAnyOfProps =
  (Component: ComponentType<CombinatorProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & CombinatorProps) => {
      const oneOfProps = ctxToAnyOfProps(ctx, props);
      const { handleChange } = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...oneOfProps} handleChange={handleChange} />);
    };

const withContextToAllOfProps =
  (Component: ComponentType<CombinatorProps>): ComponentType<OwnPropsOfControl> =>
    ({ ctx, props }: JsonFormsStateContext & CombinatorProps) => {
      const allOfProps = ctxToAllOfProps(ctx, props);
      const { handleChange } = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...allOfProps} handleChange={handleChange} />);
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

      return (<Component {...props} {...dispatchProps} {...cellProps} />);
    };

const withContextToEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
    ({ ctx, props }: JsonFormsStateContext & ControlProps & OwnPropsOfEnum) => {
      const stateProps = ctxToEnumControlProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...dispatchProps} {...stateProps} options={stateProps.options} />);
    };

const withContextToOneOfEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
    ({ ctx, props }: JsonFormsStateContext & ControlProps & OwnPropsOfEnum) => {
      const stateProps = ctxToOneOfEnumControlProps(ctx, props);
      const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
      return (<Component {...props} {...dispatchProps} {...stateProps} options={stateProps.options} />);
    };

// --

type JsonFormsPropTypes = ControlProps | CombinatorProps | LayoutProps | CellProps | ArrayLayoutProps | StatePropsOfControlWithDetail | OwnPropsOfRenderer;

export const areEqual = (prevProps: JsonFormsPropTypes, nextProps: JsonFormsPropTypes) => {
  const prev = omit(prevProps, ['schema', 'uischema', 'handleChange', 'renderers', 'cells', 'uischemas']);
  const next = omit(nextProps, ['schema', 'uischema', 'handleChange', 'renderers', 'cells', 'uischemas']);
  return isEqual(prev, next)
    && get(prevProps, 'renderers') === get(nextProps, 'renderers')
    && get(prevProps, 'cells') === get(nextProps, 'cells')
    && get(prevProps, 'uischemas') === get(nextProps, 'uischemas')
    && get(prevProps, 'schema') === get(nextProps, 'schema')
    && get(prevProps, 'uischema') === get(nextProps, 'uischema');
};

// top level HOCs --

export const withJsonFormsControlProps =
  (Component: ComponentType<ControlProps>): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToControlProps(React.memo(
      Component,
      (prevProps: ControlProps, nextProps: ControlProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsLayoutProps =
  (Component: ComponentType<LayoutProps>): ComponentType<OwnPropsOfLayout> =>
    withJsonFormsContext(withContextToLayoutProps(React.memo(
      Component,
      (prevProps: LayoutProps, nextProps: LayoutProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsOneOfProps =
  (Component: ComponentType<CombinatorProps>): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToOneOfProps(React.memo(
      Component,
      (prevProps: CombinatorProps, nextProps: CombinatorProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsAnyOfProps =
  (Component: ComponentType<CombinatorProps>): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToAnyOfProps(React.memo(
      Component,
      (prevProps: CombinatorProps, nextProps: CombinatorProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsAllOfProps =
  (Component: ComponentType<StatePropsOfCombinator>): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToAllOfProps(React.memo(
      Component,
      (prevProps: CombinatorProps, nextProps: CombinatorProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsDetailProps =
  (Component: ComponentType<StatePropsOfControlWithDetail>): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToDetailProps(React.memo(
      Component,
      (prevProps: StatePropsOfControlWithDetail, nextProps: StatePropsOfControlWithDetail) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsArrayLayoutProps =
  (Component: ComponentType<ArrayLayoutProps>): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToArrayLayoutProps(React.memo(
      Component,
      (prevProps: ArrayLayoutProps, nextProps: ArrayLayoutProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsArrayControlProps =
  (Component: ComponentType<ArrayControlProps>): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(withContextToArrayControlProps(React.memo(
      Component,
      (prevProps: ArrayControlProps, nextProps: ArrayControlProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsMasterListItemProps =
  (Component: ComponentType<StatePropsOfMasterItem>): ComponentType<OwnPropsOfMasterListItem> =>
    withJsonFormsContext(withContextToMasterListItemProps(React.memo(
      Component,
      (prevProps: StatePropsOfMasterItem, nextProps: StatePropsOfMasterItem) =>
        areEqual(omit(prevProps, ['handleSelect', 'removeItem']), omit(nextProps, ['handleSelect', 'removeItem']))
    )));

export const withJsonFormsCellProps =
  (Component: ComponentType<CellProps>): ComponentType<OwnPropsOfCell> =>
    withJsonFormsContext(withContextToCellProps(React.memo(
      Component,
      (prevProps: CellProps, nextProps: CellProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsDispatchCellProps = (
  Component: ComponentType<DispatchCellProps>
): ComponentType<OwnPropsOfCell> =>
  withJsonFormsContext(
    withContextToDispatchCellProps(
      React.memo(Component, (prevProps: DispatchCellProps, nextProps: DispatchCellProps) =>
        areEqual(prevProps, nextProps)
      )
    )
  );

export const withJsonFormsEnumCellProps =
  (Component: ComponentType<EnumCellProps>): ComponentType<OwnPropsOfEnumCell> =>
    withJsonFormsContext(withContextToEnumCellProps(React.memo(
      Component,
      (prevProps: EnumCellProps, nextProps: EnumCellProps) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
    withJsonFormsContext(withContextToEnumProps(React.memo(
      Component,
      (prevProps: ControlProps & OwnPropsOfEnum, nextProps: ControlProps & OwnPropsOfEnum) => areEqual(prevProps, nextProps)
    )));

export const withJsonFormsOneOfEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> =>
    withJsonFormsContext(withContextToOneOfEnumProps(React.memo(
      Component,
      (prevProps: ControlProps & OwnPropsOfEnum, nextProps: ControlProps & OwnPropsOfEnum) => areEqual(prevProps, nextProps)
    )));
// --
