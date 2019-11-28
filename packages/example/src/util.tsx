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
import * as React from 'react';
import * as _ from 'lodash';
import {
  ExampleDescription,
  issue_1220 as Issue1220Example,
  nestedArray as NestedArrayExample,
  onChange as OnChangeExample,
  i18n
} from '@jsonforms/examples';
import ConnectedRatingControl, { ratingControlTester } from './RatingControl';
import {
  Actions,
  JsonSchema,
  setLocale,
  setSchema,
  setUISchema,
  UISchemaElement,
  JsonFormsCore
} from '@jsonforms/core';
import { AnyAction, Dispatch } from 'redux';
import { updateExampleExtensionState } from './reduxUtil';
import { withJsonFormsContext, JsonFormsStateContext } from '@jsonforms/react';
import { ErrorObject } from 'ajv';

export interface ReactExampleDescription extends ExampleDescription {
  customReactExtension?(dispatch: Dispatch<AnyAction>): React.Component;
  onChange?: (
    dispatch: Dispatch<AnyAction>
  ) => (
    extensionState: any
  ) => (state: Pick<JsonFormsCore, 'data' | 'errors'>) => AnyAction;
}
const registerRatingControl = (dispatch: Dispatch<AnyAction>) => {
  dispatch(Actions.registerCell(ratingControlTester, ConnectedRatingControl));
};
const unregisterRatingControl = (dispatch: Dispatch<AnyAction>) => {
  dispatch(Actions.unregisterCell(ratingControlTester, ConnectedRatingControl));
};

export interface I18nExampleProps extends OwnPropsOfI18nExample {
  data: any;
  errors: ErrorObject[];
}

export interface OwnPropsOfI18nExample {
  schema: JsonSchema;
  uischema: UISchemaElement;
  dispatch: Dispatch<AnyAction>;
  onChange: (
    dispatch: Dispatch<AnyAction>
  ) => (
    extensionState: any
  ) => (state: Pick<JsonFormsCore, 'data' | 'errors'>) => void;
}

class I18nExampleRenderer extends React.Component<
  I18nExampleProps,
  {
    localizedSchemas: Map<string, JsonSchema>;
    localizedUISchemas: Map<string, UISchemaElement>;
  }
> {
  constructor(props: I18nExampleProps) {
    super(props);
    const { schema, uischema } = props;
    const localizedSchemas = new Map<string, JsonSchema>();
    const deSchema = _.cloneDeep(schema);
    _.set(deSchema, 'properties.name.description', 'Name der Person');
    _.set(deSchema, 'properties.name.birthDate', 'Geburtstag der Person');
    localizedSchemas.set('de-DE', deSchema);
    localizedSchemas.set('en-US', schema);

    const localizedUISchemas = new Map<string, UISchemaElement>();
    const deUISchema = _.cloneDeep(uischema);
    _.set(deUISchema, 'elements.0.elements.1.label', 'Geburtstag');
    _.set(deUISchema, 'elements.2.elements.0.label', 'Nationalität');
    _.set(deUISchema, 'elements.2.elements.1.label', 'Vegetarier');
    localizedUISchemas.set('de-DE', deUISchema);
    localizedUISchemas.set('en-US', uischema);

    props.dispatch(updateExampleExtensionState({ locale: 'en-US' }));

    this.state = {
      localizedSchemas,
      localizedUISchemas
    };
  }

  changeLocale = (locale: string) => {
    const { dispatch, onChange, data, errors } = this.props;
    const { localizedSchemas, localizedUISchemas } = this.state;
    dispatch(setLocale(locale));
    dispatch(setSchema(localizedSchemas.get(locale)));
    dispatch(setUISchema(localizedUISchemas.get(locale)));
    dispatch(updateExampleExtensionState({ locale }));
    onChange(dispatch)({ locale })({ data, errors });
  };

  render() {
    return (
      <div>
        <button onClick={() => this.changeLocale('en-US')}>en-US</button>
        <button onClick={() => this.changeLocale('de-DE')}>de-DE</button>
      </div>
    );
  }
}

const withContextToI18nProps = (
  Component: React.ComponentType<I18nExampleProps>
): React.ComponentType<OwnPropsOfI18nExample> => ({
  ctx,
  props
}: JsonFormsStateContext & I18nExampleProps) => {
  const { data, errors } = ctx.core;
  return <Component {...props} data={data} errors={errors} />;
};

const withI18nProps = (
  Component: React.ComponentType<I18nExampleProps>
): React.ComponentType<OwnPropsOfI18nExample> =>
  withJsonFormsContext(withContextToI18nProps(Component));

const I18nExample = withI18nProps(I18nExampleRenderer);

export const enhanceExample: (
  examples: ExampleDescription[]
) => ReactExampleDescription[] = examples =>
  examples.map(e => {
    switch (e.name) {
      case 'day6':
        const day6 = Object.assign({}, e, {
          customReactExtension: (dispatch: Dispatch<AnyAction>) => (
            <div>
              <button onClick={() => registerRatingControl(dispatch)}>
                Register Custom Cell
              </button>
              <button onClick={() => unregisterRatingControl(dispatch)}>
                Unregister Custom Cell
              </button>
            </div>
          )
        });
        return day6;
      case 'nestedArray':
        const nestedArray = Object.assign({}, e, {
          customReactExtension: (dispatch: Dispatch<AnyAction>) => (
            <div>
              <button
                onClick={() =>
                  NestedArrayExample.registerNestedArrayUISchema(dispatch)
                }
              >
                Register NestedArray UISchema
              </button>
              <button
                onClick={() =>
                  NestedArrayExample.unregisterNestedArrayUISchema(dispatch)
                }
              >
                Unregister NestedArray UISchema
              </button>
            </div>
          )
        });
        return nestedArray;
      case 'dynamic':
        const dynamic = Object.assign({}, e, {
          customReactExtension: (dispatch: Dispatch<AnyAction>) => (
            <div>
              <button
                onClick={() =>
                  dispatch(Actions.init({ id: 'aaa' }, e.schema, e.uischema))
                }
              >
                Change data
              </button>
            </div>
          )
        });
        return dynamic;
      case 'rule-enable':
        return Object.assign({}, e, {
          customReactExtension: (dispatch: Dispatch<AnyAction>) => (
            <div>
              <button
                onClick={() => {
                  dispatch(Actions.update('toggleTopLayout', bool => !bool));
                }}
              >
                Enable/Disable top layout
              </button>
              <button
                onClick={() => {
                  dispatch(Actions.update('toggleBottomLayout', bool => !bool));
                }}
              >
                Show/Hide bottom layout
              </button>
            </div>
          )
        });
      case 'array':
        const array = Object.assign({}, e, {
          customReactExtension: (dispatch: Dispatch<AnyAction>) => (
            <div>
              <button
                onClick={() => {
                  dispatch(Actions.init(e.data, e.schema, e.config.withSort));
                }}
              >
                Reload with sorting
              </button>
              <button
                onClick={() =>
                  dispatch(Actions.init(e.data, e.schema, e.uischema))
                }
              >
                Reload without sorting
              </button>
            </div>
          )
        });
        return array;
      case 'i18n':
        return Object.assign({}, e, {
          customReactExtension: (dispatch: Dispatch<AnyAction>) => (
            <I18nExample
              schema={e.schema}
              uischema={e.uischema}
              dispatch={dispatch}
              onChange={i18n.onChange}
            />
          ),
          onChange: i18n.onChange
        });
      case '1220':
        const issue_1220 = Object.assign({}, e, {
          customReactExtension: (dispatch: Dispatch<AnyAction>) => (
            <div>
              <button
                onClick={() =>
                  Issue1220Example.registerIssue1220UISchema(dispatch)
                }
              >
                Register Issue 1220 UISchema
              </button>
              <button
                onClick={() =>
                  Issue1220Example.unregisterIssue1220UISchema(dispatch)
                }
              >
                Unregister Issue 1220 UISchema
              </button>
            </div>
          )
        });
        return issue_1220;
      case 'onChange':
        return {
          ...e,
          onChange: OnChangeExample.onChange
        };
      default:
        return e;
    }
  });
