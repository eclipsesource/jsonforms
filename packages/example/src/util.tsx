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
  nestedArray as NestedArrayExample
} from '@jsonforms/examples';
import ConnectedRatingControl, { ratingControlTester } from './RatingControl';
import {
  Actions,
  JsonSchema,
  setLocale,
  setSchema,
  setUISchema,
  UISchemaElement
} from '@jsonforms/core';
import { AnyAction, Dispatch } from 'redux';

export interface ReactExampleDescription extends ExampleDescription {
  customReactExtension?(dispatch: Dispatch<AnyAction>): React.Component;
}
const registerRatingControl = (dispatch: Dispatch<AnyAction>) => {
  dispatch(Actions.registerField(ratingControlTester, ConnectedRatingControl));
};
const unregisterRatingControl = (dispatch: Dispatch<AnyAction>) => {
  dispatch(
    Actions.unregisterField(ratingControlTester, ConnectedRatingControl)
  );
};

export interface I18nExampleProps {
  schema: JsonSchema;
  uischema: UISchemaElement;
  dispatch: Dispatch<AnyAction>;
}

class I18nExample extends React.Component<
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

    this.state = {
      localizedSchemas,
      localizedUISchemas
    };
  }

  changeLocale = (locale: string) => {
    const { dispatch } = this.props;
    const { localizedSchemas, localizedUISchemas } = this.state;
    dispatch(setLocale(locale));
    dispatch(setSchema(localizedSchemas.get(locale)));
    dispatch(setUISchema(localizedUISchemas.get(locale)));
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
                Register Custom Field
              </button>
              <button onClick={() => unregisterRatingControl(dispatch)}>
                Unregister Custom Field
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
      case 'i18n':
        return Object.assign({}, e, {
          customReactExtension: (dispatch: Dispatch<AnyAction>) => (
            <I18nExample
              schema={e.schema}
              uischema={e.uischema}
              dispatch={dispatch}
            />
          )
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
      default:
        return e;
    }
  });
