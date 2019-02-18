/*
  The MIT License

  Copyright (c) 2018-2019 EclipseSource Munich
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

import React from 'react';
import { Provider } from 'react-redux';
import { Actions, Categorization, ControlElement, jsonformsReducer, JsonFormsState, Layout } from '@jsonforms/core';
import Enzyme, { mount } from 'enzyme';

import { combineReducers, createStore, Store } from 'redux';
import MaterialCategorizationStepperLayoutRenderer, {
  MaterialCategorizationStepperLayoutRenderer as CategorizationStepperRenderer,
  materialCategorizationStepperTester
} from '../../src/layouts/MaterialCategorizationStepperLayout';
import { materialFields, materialRenderers } from '../../src';
import { Step, StepButton, Stepper } from '@material-ui/core';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

export const initJsonFormsStore = (initState: any): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers,
      fields: materialFields,
    }
  };
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    s
  );

  const { data, schema, uischema } = initState;
  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};

const fixture = {
  data: {},
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  },
  uischema: {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'B'
      },
    ]
  }
};

describe('Material categorization stepper layout tester', () => {
  it('should not fail when given undefined data', () => {
    expect(materialCategorizationStepperTester(undefined, undefined)).toBe(-1);
    expect(materialCategorizationStepperTester(null, undefined)).toBe(-1);
    expect(materialCategorizationStepperTester({type: 'Foo'}, undefined)).toBe(-1);
    expect(materialCategorizationStepperTester({type: 'Categorization'}, undefined)).toBe(-1);
  });

  it('should not fail with null elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: null
    };
    expect(materialCategorizationStepperTester(uischema, undefined)).toBe(-1);
  });

  it('should not fail with empty elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: []
    };
    expect(materialCategorizationStepperTester(uischema, undefined)).toBe(-1);
  });

  it('should not fail tester with single unknown element and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Foo'
        },
      ]
    };
    expect(materialCategorizationStepperTester(uischema, undefined)).toBe(-1);
  });

  it('should not apply to a single category and no schema', () => {
    const categorization =  {
      type: 'Categorization',
      elements: [
        {
          type: 'Category'
        }
      ]
    };
    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(-1);
  });

  it('should not apply to a nested categorization with single category and no schema', () => {
    const nestedCategorization: Layout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category'
        }
      ]
    };
    const categorization: Layout = {
      type: 'Categorization',
      elements: [nestedCategorization]
    };
    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(-1);
  });

  it('should not apply to nested categorizations without categories and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization'
        }
      ]
    };
    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(-1);
  });

  it('should not apply to a nested categorization with null elements and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
          label: 'Test',
          elements: null
        }
      ]
    };

    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(-1);
  });

  it('should not apply to a nested categorizations with empty elements and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
          elements: []
        }
      ]
    };
    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(-1);
  });
});

describe('Material categorization stepper layout', () => {

  it('should render', () => {
    const nameControl = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Root',
      elements: [
        {
          type: 'Categorization',
          label: 'Bar',
          elements: [
            {
              type: 'Category',
              label: 'A',
              elements: [nameControl]
            }
          ]
        },
        {
          type: 'Category',
          label: 'B',
          elements: [nameControl]
        }
      ]
    };

    const store = initJsonFormsStore(fixture);
    const wrapper = mount(
      <Provider store={store}>
        <MaterialCategorizationStepperLayoutRenderer
          schema={fixture.schema}
          uischema={uischema}
        />
      </Provider>
    );
    const steps = wrapper.find(Step);
    expect(steps.length).toBe(2);
    wrapper.unmount();
  });

  it('should render on click', () => {
    const data = {'name': 'Foo'};
    const nameControl: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const innerCategorization: Categorization = {
      type: 'Categorization',
      label: 'Bar',
      elements: [
        {
          type: 'Category',
          label: 'A',
          elements: [nameControl]
        },
      ]
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Root',
      elements: [
        innerCategorization,
        {
          type: 'Category',
          label: 'B',
          elements: [nameControl, nameControl]
        },
        {
          type: 'Category',
          label: 'C',
          elements: undefined
        },
        {
          type: 'Category',
          label: 'D',
          elements: null
        },
      ]
    };
    const store = initJsonFormsStore({
      ...fixture,
      data
    });

    const wrapper = mount(
      <Provider store={store}>
        <MaterialCategorizationStepperLayoutRenderer
          schema={fixture.schema}
          uischema={uischema}
        />
      </Provider>
    );
    const beforeClick = wrapper.find(CategorizationStepperRenderer).state().activeCategory;
    wrapper.find(StepButton).at(1).simulate('click');
    const afterClick = wrapper.find(CategorizationStepperRenderer).state().activeCategory;

    expect(beforeClick).toBe(0);
    expect(afterClick).toBe(1);
    wrapper.unmount();
  });

  it('can be hidden', () => {
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'B',
          elements: []
        }
      ]
    };
    const store = initJsonFormsStore(fixture);

    const wrapper = mount(
      <Provider store={store}>
        <MaterialCategorizationStepperLayoutRenderer
          schema={fixture.schema}
          uischema={uischema}
          visible={false}
        />
      </Provider>
    );

    expect(wrapper.find(Stepper).exists()).toBeFalsy();
    wrapper.unmount();
  });

  it('is shown by default', () => {
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'B',
          elements: []
        }
      ]
    };
    const store = initJsonFormsStore(fixture);
    const wrapper = mount(
      <Provider store={store}>
        <MaterialCategorizationStepperLayoutRenderer
          schema={fixture.schema}
          uischema={uischema}
        />
      </Provider>
    );

    expect(wrapper.find(Stepper).exists()).toBeTruthy();
    wrapper.unmount();
  });
});
