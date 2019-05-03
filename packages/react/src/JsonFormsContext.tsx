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

import React, { ComponentType, Dispatch, ReducerAction, useContext, useEffect, useReducer } from 'react';
import {
  Actions,
  ArrayLayoutProps,
  CellProps,
  ControlProps,
  coreReducer,
  DispatchPropsOfControl,
  EnumCellProps,
  JsonFormsCore,
  JsonFormsState,
  JsonFormsSubStates,
  LayoutProps,
  mapDispatchToArrayControlProps,
  mapStateToAllOfProps,
  mapStateToAnyOfProps,
  mapStateToArrayControlProps,
  mapStateToArrayLayoutProps,
  mapStateToCellProps,
  mapStateToControlProps,
  mapStateToControlWithDetailProps,
  mapStateToJsonFormsRendererProps,
  mapStateToLayoutProps,
  mapStateToMasterListItemProps,
  mapStateToOneOfProps,
  OwnPropsOfCell,
  OwnPropsOfControl,
  OwnPropsOfEnum,
  OwnPropsOfEnumCell,
  OwnPropsOfJsonFormsRenderer,
  OwnPropsOfMasterListItem,
  rendererReducer,
  StatePropsOfCombinator,
  StatePropsOfControlWithDetail,
  StatePropsOfMasterItem,
  update
} from '@jsonforms/core';
import { connect } from 'react-redux';

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

export const JsonFormsStateProvider = ({ children, initState }: any) => {
  const [core, dispatch] = useReducer(coreReducer, initState.core);
  const [renderers] = useReducer(rendererReducer, initState.renderers);
  const { data, schema, uischema } = initState.core;
  useEffect(() => {
    dispatch(Actions.init(data, schema, uischema));
  }, []);
  return (
    <JsonFormsContext.Provider
      value={{
        core,
        renderers,
        // only core dispatch available
        dispatch
      }}
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

const JsonFormsReduxProvider = ({ children, dispatch, ...other }: JsonFormsReduxContextProps) => {
  return (
    <JsonFormsContext.Provider
      value={{
        dispatch,
        ...other
      }}
    >
      {children}
    </JsonFormsContext.Provider>
  );
};

export const JsonFormsReduxContext = connect(
  (state: JsonFormsState) => ({
    ...state.jsonforms
  })
)(JsonFormsReduxProvider);

export const ctxToArrayLayoutProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToArrayLayoutProps({ jsonforms: { ...ctx } }, props);

export const ctxToArrayControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToArrayControlProps({ jsonforms: { ...ctx } }, props);

export const ctxToLayoutProps = (ctx: JsonFormsStateContext, props: OwnPropsOfJsonFormsRenderer): LayoutProps =>
  mapStateToLayoutProps({ jsonforms: { ...ctx } }, props);

export const ctxToControlProps = (ctx: JsonFormsStateContext, props: OwnPropsOfControl) =>
  mapStateToControlProps({ jsonforms: { ...ctx } }, props);

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
  handleChange(path, value) {
    dispatch(update(path, () => value));
  }
});

export const ctxToAnyOfProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfControl
) => {
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
): StatePropsOfCombinator & DispatchPropsOfControl => {
  const props = mapStateToOneOfProps({ jsonforms: { ...ctx } }, ownProps);
  const { handleChange } = ctxDispatchToControlProps(ctx.dispatch)
  return {
    ...props,
    handleChange
  };
}

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
}

export const withJsonFormsLayoutProps = (Component: ComponentType<LayoutProps>): ComponentType<OwnPropsOfJsonFormsRenderer> => (props: LayoutProps) => {
  const ctx = useJsonForms();
  const layoutProps = ctxToLayoutProps(ctx, props);
  return (
    <Component {...props} {...layoutProps} renderers={ctx.renderers} />
  );
};

export const withJsonFormsControlProps =
  (Component: ComponentType<ControlProps>): ComponentType<OwnPropsOfControl> => (props: ControlProps) => {
    const ctx = useJsonForms();
    const controlProps = ctxToControlProps(ctx, props);
    const { handleChange } = ctxDispatchToControlProps(ctx.dispatch);
    return (<Component {...props} {...controlProps} handleChange={handleChange} />);
  };

export const withJsonFormsOneOfProps =
  (Component: ComponentType<StatePropsOfCombinator>): ComponentType<OwnPropsOfControl> => (props: StatePropsOfCombinator) => {
    const ctx = useJsonForms();
    const oneOfProps = ctxToOneOfProps(ctx, props);
    return (<Component {...oneOfProps} />);
  };

export const withJsonFormsAnyOfProps =
  (Component: ComponentType<StatePropsOfCombinator>): ComponentType<OwnPropsOfControl> => (props: StatePropsOfCombinator) => {
    const ctx = useJsonForms();
    const anyOfProps = ctxToAnyOfProps(ctx, props);
    return (<Component {...anyOfProps} />);
  };

export const withJsonFormsAllOfProps =
  (Component: ComponentType<StatePropsOfCombinator>): ComponentType<OwnPropsOfControl> => (props: StatePropsOfCombinator) => {
    const ctx = useJsonForms();
    const allOfProps = ctxToAllOfProps(ctx, props);
    return (<Component {...allOfProps} />);
  };

export const withJsonFormsDetailProps =
  (Component: ComponentType<StatePropsOfControlWithDetail>): ComponentType<OwnPropsOfControl> => (props: StatePropsOfControlWithDetail) => {
    const ctx = useJsonForms();
    const detailProps = ctxToControlWithDetailProps(ctx, props);

    return (<Component {...detailProps} />);
  };

export const withJsonFormsArrayLayoutProps =
  (Component: ComponentType<ArrayLayoutProps>): ComponentType<OwnPropsOfControl> => (props: ArrayLayoutProps) => {
    const ctx = useJsonForms();
    const stateProps = ctxToArrayLayoutProps(ctx, props);
    const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);

    return (<Component {...props} {...stateProps} {...dispatchProps} />);
  };

export const withJsonFormsArrayControlProps =
  (Component: ComponentType<ArrayLayoutProps>): ComponentType<OwnPropsOfControl> => (props: ArrayLayoutProps) => {
    const ctx = useJsonForms();
    const stateProps = ctxToArrayControlProps(ctx, props);
    const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);

    return (<Component {...props} {...stateProps} {...dispatchProps} />);
  };


export const withJsonFormsMasterListItemProps =
  (Component: ComponentType<StatePropsOfMasterItem>): ComponentType<OwnPropsOfMasterListItem> => (props: StatePropsOfMasterItem) => {
    const ctx = useJsonForms();
    const stateProps = ctxToMasterListItemProps(ctx, props);

    return (<Component {...stateProps} />);
  };

export const withJsonFormsCellProps =
  (Component: ComponentType<CellProps>): ComponentType<OwnPropsOfCell> => (props: CellProps) => {
    const ctx = useJsonForms();
    const cellProps = ctxToCellProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch)

    return (<Component {...props} {...dispatchProps} {...cellProps} />);
  };

export const withJsonFormsEnumCellProps =
  (Component: ComponentType<EnumCellProps>): ComponentType<OwnPropsOfEnumCell> => (props: EnumCellProps) => {
    const ctx = useJsonForms();
    const cellProps = ctxToCellProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    const options =
      props.options !== undefined ? props.options : props.schema.enum;

    return (<Component {...props} {...dispatchProps} {...cellProps} options={options} />);
  };

export const withJsonFormsEnumProps =
  (Component: ComponentType<ControlProps & OwnPropsOfEnum>): ComponentType<OwnPropsOfControl & OwnPropsOfEnum> => (props: ControlProps & OwnPropsOfEnum) => {
    const ctx = useJsonForms();
    const stateProps = ctxToControlProps(ctx, props);
    const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
    const options =
      props.options !== undefined ? props.options : stateProps.schema.enum;

    return (<Component {...props} {...dispatchProps} {...stateProps} options={options} />);
  };
