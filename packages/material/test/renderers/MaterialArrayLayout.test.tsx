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
import { materialCells, materialRenderers } from '../../src';
import {
  MaterialArrayLayout,
  materialArrayLayoutTester
} from '../../src/layouts';
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

const nestedSchema = {
  type: 'array',
  items: {
    ...schema
  }
};

const uischema: ControlElement = {
  type: 'Control',
  scope: '#'
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

const uischemaWithSortOption: ControlElement = {
  type: 'Control',
  scope: '#',
  options: {
    showSortButtons: true
  }
};

export const initJsonFormsStore = (): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers,
      cells: materialCells
    }
  };
  const reducer = combineReducers({ jsonforms: jsonformsReducer() });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};

const uischemaOptions: {
  generate: ControlElement;
  default: ControlElement;
  inline: ControlElement;
} = {
  default: {
    type: 'Control',
    scope: '#',
    options: {
      detail: 'DEFAULT'
    }
  },
  generate: {
    type: 'Control',
    scope: '#',
    options: {
      detail: 'GENERATE'
    }
  },
  inline: {
    type: 'Control',
    scope: '#',
    options: {
      detail: {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/message'
          }
        ]
      }
    }
  }
};

describe('Material array layout tester', () => {
  it('should only be applicable for intermediate array or when containing proper options', () => {
    expect(materialArrayLayoutTester(uischema, schema)).toBe(-1);
    expect(materialArrayLayoutTester(uischema, nestedSchema)).toBe(4);
    expect(materialArrayLayoutTester(uischema, nestedSchema2)).toBe(4);

    expect(materialArrayLayoutTester(uischemaOptions.default, schema)).toBe(-1);
    expect(materialArrayLayoutTester(uischemaOptions.generate, schema)).toBe(4);
    expect(materialArrayLayoutTester(uischemaOptions.inline, schema)).toBe(4);
  });
});

describe('Material array layout', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render two by two children', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout schema={schema} uischema={uischema} />
      </Provider>
    );

    const controls = wrapper.find('input');
    // 2 data entries with each having 2 controls
    expect(controls).toHaveLength(4);
  });

  it('should generate uischema when options.detail=GENERATE', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaOptions.generate}
        />
      </Provider>
    );

    const controls = wrapper.find('input');
    // 2 data entries with each having 2 controls
    expect(controls).toHaveLength(4);
  });

  it('should use inline options.detail uischema', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaOptions.inline}
        />
      </Provider>
    );

    const controls = wrapper.find('input');
    // 2 data entries with each having 1 control
    expect(controls).toHaveLength(2);
  });

  it('should be hideable', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </Provider>
    );

    const controls = wrapper.find('input');
    // no controls should be rendered
    expect(controls).toHaveLength(0);
  });

  it('should have renderers prop via ownProps', () => {
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischema}
          renderers={[]}
        />
      </Provider>
    );

    const materialArrayLayout = wrapper.find(MaterialArrayLayout);
    expect(materialArrayLayout.props().renderers).toHaveLength(0);
  });

  it('ui schema label for array', () => {
    const uischemaWithLabel = {
      ...uischema,
      label: 'My awesome label'
    };
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout schema={schema} uischema={uischemaWithLabel} />
      </Provider>
    );

    const listLabel = wrapper.find('h6').at(0);
    expect(listLabel.text()).toBe('My awesome label');
  });

  it('schema title for array', () => {
    const titleSchema = {
      ...schema,
      title: 'My awesome title'
    };
    const store = initJsonFormsStore();
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout schema={titleSchema} uischema={uischema} />
      </Provider>
    );

    const listTitle = wrapper.find('h6').at(0);
    expect(listTitle.text()).toBe('My awesome title');
  });

  it('should render sort buttons if showSortButtons is true', () => {
    const store = initJsonFormsStore();
    store.dispatch(Actions.init(data, schema, uischemaWithSortOption));
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithSortOption}
        />
      </Provider>
    );
    const btnCount = wrapper
      .find('ExpansionPanelSummary')
      .at(0)
      .find('button').length;
    //up button + down Button + delete button
    expect(btnCount).toBe(3);
  });
  it('should move item up if up button is presses', () => {
    const store = initJsonFormsStore();
    store.dispatch(Actions.init(data, schema, uischemaWithSortOption));
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithSortOption}
        />
      </Provider>
    );
    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('ExpansionPanelSummary')
      .at(1)
      .find('button')
      .at(0);
    upButton.simulate('click');
    expect(store.getState().jsonforms.core.data).toEqual([
      {
        message: 'Yolo'
      },
      {
        message: 'El Barto was here',
        done: true
      }
    ]);
  });
  it('shoud move item down if down button is pressed', () => {
    const store = initJsonFormsStore();
    store.dispatch(Actions.init(data, schema, uischemaWithSortOption));
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithSortOption}
        />
      </Provider>
    );
    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('ExpansionPanelSummary')
      .at(0)
      .find('button')
      .at(1);
    upButton.simulate('click');
    expect(store.getState().jsonforms.core.data).toEqual([
      {
        message: 'Yolo'
      },
      {
        message: 'El Barto was here',
        done: true
      }
    ]);
  });
  it('should have up button disabled for first element', () => {
    const store = initJsonFormsStore();
    store.dispatch(Actions.init(data, schema, uischemaWithSortOption));
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithSortOption}
        />
      </Provider>
    );
    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('ExpansionPanelSummary')
      .at(0)
      .find('button')
      .at(0);
    expect(upButton.is('[disabled]')).toBe(true);
  });
  it('should have down button disabled for last element', () => {
    const store = initJsonFormsStore();
    store.dispatch(Actions.init(data, schema, uischemaWithSortOption));
    wrapper = mount(
      <Provider store={store}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithSortOption}
        />
      </Provider>
    );
    // getting up button of second item in expension panel;
    const downButton = wrapper
      .find('ExpansionPanelSummary')
      .at(1)
      .find('button')
      .at(1);
    expect(downButton.is('[disabled]')).toBe(true);
  });
});
