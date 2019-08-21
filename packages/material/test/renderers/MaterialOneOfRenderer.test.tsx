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
import './MatchMediaMock';
import React from 'react';
import { Provider } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  Actions,
  ControlElement,
  getData,
  jsonformsReducer,
  JsonFormsState
} from '@jsonforms/core';
import {
  materialCells,
  MaterialOneOfRenderer,
  materialRenderers
} from '../../src';
import { combineReducers, createStore, Store } from 'redux';
import { JsonFormsDispatch, JsonFormsReduxContext } from '@jsonforms/react';
import { Tab } from '@material-ui/core';

Enzyme.configure({ adapter: new Adapter() });

const waitForAsync = () => new Promise(resolve => setImmediate(resolve));

const initStore = () => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers,
      cells: materialCells
    }
  };

  const reducer = combineReducers({ jsonforms: jsonformsReducer() });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  return store;
};

const clickAddButton = (wrapper: ReactWrapper, times: number) => {
  // click add button
  const buttons = wrapper.find('button');
  const addButton = buttons.at(2);
  for (let i = 0; i < times; i++) {
    addButton.simulate('click');
  }
  wrapper.update();
};

const selectOneOfTab = (
  wrapper: ReactWrapper,
  at: number,
  expectConfim: boolean
) => {
  // select oneOf
  const buttons = wrapper.find('button');
  buttons.at(at).simulate('click');
  wrapper.update();

  if (expectConfim) {
    // confirm dialog
    const confirmButton = wrapper
      .find(Dialog)
      .last()
      .find('button')
      .at(1);
    confirmButton.simulate('click');
    wrapper.update();
  } else {
    expect(
      wrapper
        .find(Dialog)
        .last()
        .find('button')
        .at(1)
        .exists()
    ).toBe(false);
  }
};

describe('Material oneOf renderer', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render and select first tab by default', () => {
    const store = initStore();
    const schema = {
      type: 'object',
      properties: {
        value: {
          oneOf: [
            {
              title: 'String',
              type: 'string'
            },
            {
              title: 'Number',
              type: 'number'
            }
          ]
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };
    store.dispatch(Actions.init({ data: undefined }, schema, uischema));
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialOneOfRenderer schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const firstTab = wrapper.find(Tab).first();
    expect(firstTab.props().selected).toBeTruthy();
  });
  it('should render and select second tab due to datatype', () => {
    const store = initStore();
    const schema = {
      type: 'object',
      properties: {
        value: {
          oneOf: [
            {
              title: 'String',
              type: 'string'
            },
            {
              title: 'Number',
              type: 'number'
            }
          ]
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };
    store.dispatch(Actions.init({ value: 5 }, schema, uischema));
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialOneOfRenderer schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const secondTab = wrapper.find(Tab).at(1);
    expect(secondTab.props().selected).toBeTruthy();
  });
  it('should render and select second tab due to schema with additionalProperties', () => {
    const store = initStore();
    const schema = {
      type: 'object',
      properties: {
        value: {
          oneOf: [
            {
              title: 'String',
              type: 'object',
              properties: {
                foo: { type: 'string' }
              },
              additionalProperties: false
            },
            {
              title: 'Number',
              type: 'object',
              properties: {
                bar: { type: 'string' }
              },
              additionalProperties: false
            }
          ]
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };
    store.dispatch(Actions.init({ value: { bar: 'bar' } }, schema, uischema));
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialOneOfRenderer schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const secondTab = wrapper.find(Tab).at(1);
    expect(secondTab.props().selected).toBeTruthy();
  });
  it('should render and select second tab due to schema with required', () => {
    const store = initStore();
    const schema = {
      type: 'object',
      properties: {
        value: {
          oneOf: [
            {
              title: 'String',
              type: 'object',
              properties: {
                foo: { type: 'string' }
              },
              required: ['foo']
            },
            {
              title: 'Number',
              type: 'object',
              properties: {
                bar: { type: 'string' }
              },
              required: ['bar']
            }
          ]
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };
    store.dispatch(Actions.init({ value: { bar: 'bar' } }, schema, uischema));
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialOneOfRenderer schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const secondTab = wrapper.find(Tab).at(1);
    expect(secondTab.props().selected).toBeTruthy();
  });

  it('should add an item at correct path', () => {
    const store = initStore();
    const schema = {
      type: 'object',
      properties: {
        value: {
          oneOf: [
            {
              title: 'String',
              type: 'string'
            },
            {
              title: 'Number',
              type: 'number'
            }
          ]
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };
    store.dispatch(Actions.init({ data: undefined }, schema, uischema));
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialOneOfRenderer schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'test' } });
    wrapper.update();
    expect(store.getState().jsonforms.core.data).toEqual({
      value: 'test'
    });
  });

  it('should add an item within an array', async () => {
    const schema = {
      type: 'object',
      properties: {
        thingOrThings: {
          oneOf: [
            {
              $ref: '#/definitions/thing'
            },
            {
              $ref: '#/definitions/thingArray'
            }
          ]
        }
      },
      definitions: {
        thing: {
          title: 'Thing',
          type: 'string'
        },
        thingArray: {
          title: 'Things',
          type: 'array',
          items: {
            $ref: '#/definitions/thing'
          }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/thingOrThings'
    };

    const store = initStore();
    store.dispatch(Actions.init({ data: {}, schema, uischema }));

    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <JsonFormsDispatch schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    await waitForAsync();

    wrapper.update();

    selectOneOfTab(wrapper, 1, false);
    const nrOfRowsBeforeAdd = wrapper.find('tr');
    clickAddButton(wrapper, 2);
    const nrOfRowsAfterAdd = wrapper.find('tr');

    // 1 header row + no data row
    expect(nrOfRowsBeforeAdd.length).toBe(2);
    // 1 header row + 2 data rows (one is replacing the 'No data' one)
    expect(nrOfRowsAfterAdd.length).toBe(3);
  });

  it('should add an object within an array', async () => {
    const schema = {
      type: 'object',
      properties: {
        thingOrThings: {
          oneOf: [
            {
              title: 'Thing',
              type: 'object',
              properties: {
                thing: {
                  $ref: '#/definitions/thing'
                }
              }
            },
            {
              $ref: '#/definitions/thingArray'
            }
          ]
        }
      },
      definitions: {
        thing: {
          title: 'Thing',
          type: 'string'
        },
        thingArray: {
          title: 'Things',
          type: 'array',
          items: {
            $ref: '#/definitions/thing'
          }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/thingOrThings'
    };

    const store = initStore();
    store.dispatch(Actions.init({}, schema, uischema));

    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <JsonFormsDispatch schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    await waitForAsync();

    // expect(wrapper.state())
    wrapper.update();

    selectOneOfTab(wrapper, 1, false);
    const nrOfRowsBeforeAdd = wrapper.find('tr');
    clickAddButton(wrapper, 2);
    const nrOfRowsAfterAdd = wrapper.find('tr');

    // 1 header row + no data row
    expect(nrOfRowsBeforeAdd.length).toBe(2);
    // 1 header row + 2 data rows (one is replacing the 'No data' one)
    expect(nrOfRowsAfterAdd.length).toBe(3);
    expect(getData(store.getState())).toEqual({
      thingOrThings: ['', '']
    });
  });

  it('should switch to array based oneOf subschema, then switch back, then edit', async () => {
    const schema = {
      type: 'object',
      properties: {
        thingOrThings: {
          oneOf: [
            {
              title: 'Thing',
              type: 'object',
              properties: {
                thing: {
                  $ref: '#/definitions/thing'
                }
              }
            },
            {
              $ref: '#/definitions/thingArray'
            }
          ]
        }
      },
      definitions: {
        thing: {
          title: 'Thing',
          type: 'string'
        },
        thingArray: {
          title: 'Things',
          type: 'array',
          items: {
            $ref: '#/definitions/thing'
          }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/thingOrThings'
    };

    const store = initStore();
    store.dispatch(Actions.init({}, schema, uischema));

    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <JsonFormsDispatch
            schema={store.getState().jsonforms.core.schema}
            uischema={uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    await waitForAsync();

    wrapper.update();

    selectOneOfTab(wrapper, 1, false);
    clickAddButton(wrapper, 2);
    selectOneOfTab(wrapper, 0, true);

    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'test' } });
    wrapper.update();
    expect(getData(store.getState())).toEqual({
      thingOrThings: { thing: 'test' }
    });
  });

  it('should show confirm dialog when data is not an empty object', async () => {
    const schema = {
      type: 'object',
      properties: {
        value: {
          oneOf: [
            {
              title: 'String',
              type: 'string'
            },
            {
              title: 'Number',
              type: 'number'
            }
          ]
        }
      }
    };

    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };

    const store = initStore();
    store.dispatch(Actions.init({ value: 'Foo Bar' }, schema, uischema));

    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <JsonFormsDispatch schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    await waitForAsync();
    wrapper.update();
    selectOneOfTab(wrapper, 1, true);
  });

  it('should be hideable', () => {
    const store = initStore();
    const schema = {
      type: 'object',
      properties: {
        value: {
          oneOf: [
            {
              title: 'String',
              type: 'string'
            },
            {
              title: 'Number',
              type: 'number'
            }
          ]
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };
    store.dispatch(Actions.init({ data: undefined }, schema, uischema));
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialOneOfRenderer
            schema={schema}
            uischema={uischema}
            visible={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(0);
  });
});
