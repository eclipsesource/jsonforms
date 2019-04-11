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
  ControlElement,
  jsonformsReducer,
  JsonFormsState
} from '@jsonforms/core';
import * as React from 'react';
import { Provider } from 'react-redux';

import { combineReducers, createStore, Store } from 'redux';
import { materialRenderers } from '../../src';
import MaterialListWithDetailRenderer, {
  materialListWithDetailTester
} from '../../src/additional/MaterialListWithDetailRenderer';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const data = [
  {
    message: 'El Barto was here',
    done: true
  },
  {
    message: 'Yolo'
  }
];
const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        maxLength: 3
      },
      done: {
        type: 'boolean'
      }
    }
  }
};

const uischema: ControlElement = {
  type: 'Control',
  scope: '#'
};

export const initJsonFormsStore = (overrideData?: any): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers
    }
  };
  const reducer = combineReducers({ jsonforms: jsonformsReducer() });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(overrideData ? overrideData : data, schema, uischema));

  return store;
};

const nestedSchema = {
  type: 'array',
  items: {
    ...schema
  }
};

const nestedSchema2 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      objectarrayofstrings: {
        type: 'object',
        properties: {
          choices: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  }
};

describe('Material list with detail tester', () => {
  it('should only be applicable for intermediate array or when containing proper options', () => {
    const correctUISchema = {
      type: 'ListWithDetail',
      scope: '#'
    };
    const wrongSchema = {
      type: 'array',
      items: {
        type: 'string'
      }
    };
    expect(materialListWithDetailTester(uischema, schema)).toBe(-1);
    expect(materialListWithDetailTester(correctUISchema, wrongSchema)).toBe(-1);
    expect(materialListWithDetailTester(correctUISchema, schema)).toBe(4);
    expect(materialListWithDetailTester(correctUISchema, nestedSchema)).toBe(-1);
    expect(materialListWithDetailTester(correctUISchema, nestedSchema2)).toBe(
      4
    );
  });
});
describe('Material list with detail renderer', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render two list entries', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </Provider>
    );

    const lis = wrapper.find('li');
    expect(lis).toHaveLength(2);
  });
  it('should render empty entries', () => {
    const store = initJsonFormsStore([]);
    wrapper = mount(
      <Provider store={store}>
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </Provider>
    );

    const lis = wrapper.find('li');
    expect(lis).toHaveLength(0);

    const emptyWrapper = wrapper.find('ul').find('p');
    expect(emptyWrapper.text()).toBe('No data');
  });

  it('should be hideable', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialListWithDetailRenderer
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </Provider>
    );

    const controls = wrapper.find('ul');
    expect(controls).toHaveLength(0);
  });

  it('select renders corresponding data in detail', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </Provider>
    );

    const liSecond = wrapper.find('div[role="button"]').at(1);
    liSecond.simulate('click');

    const controls = wrapper.find('input');
    expect(controls).toHaveLength(2);

    const controlFirst = wrapper.find('input').at(0);
    expect(controlFirst.props().value).toBe('Yolo');
  });

  it('add data to the array', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </Provider>
    );

    const addButton = wrapper.find('button').at(0);
    addButton.simulate('click');

    const lis = wrapper.find('li');
    expect(lis).toHaveLength(3);
  });

  it('remove data from the array', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </Provider>
    );

    const addButton = wrapper.find('button').at(1);
    addButton.simulate('click');

    const lis = wrapper.find('li');
    expect(lis).toHaveLength(1);
  });
});
