import React from 'react';
import { Provider } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Actions, ControlElement, getData, jsonformsReducer, JsonFormsState } from '@jsonforms/core';
import { materialFields, MaterialOneOfRenderer, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';
import { JsonForms } from '@jsonforms/react';

Enzyme.configure({ adapter: new Adapter() });

const waitForAsync = () => new Promise(resolve => setImmediate(resolve));

const initStore = () => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers,
      fields: materialFields
    }
  };

  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    s
  );

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

const selectOneOfTab = (wrapper: ReactWrapper, at: number) => {
  // select oneOf
  const buttons = wrapper.find('button');
  buttons.at(at).simulate('click');
  wrapper.update();

  // confirm dialog
  const confirmButton = wrapper.find(Dialog).last().find('button').at(1);
  confirmButton.simulate('click');
  wrapper.update();
};

describe('Material oneOf renderer', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

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
    store.dispatch(Actions.init({data: undefined}, schema, uischema));
    wrapper = mount(
      <Provider store={store}>
        <MaterialOneOfRenderer schema={schema} uischema={uischema} />
      </Provider>
    );
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'test' }});
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
        <JsonForms schema={schema} uischema={uischema} />
      </Provider>
    );

    await waitForAsync();

    wrapper.update();

    selectOneOfTab(wrapper, 1);
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
        <JsonForms schema={schema} uischema={uischema} />
      </Provider>
    );

    await waitForAsync();

    // expect(wrapper.state())
    wrapper.update();

    selectOneOfTab(wrapper, 1);
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
        <JsonForms schema={schema} uischema={uischema} />
      </Provider>
    );

    await waitForAsync();

    wrapper.update();

    selectOneOfTab(wrapper, 1);
    clickAddButton(wrapper, 2);
    selectOneOfTab(wrapper, 0);

    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'test' }});
    wrapper.update();
    expect(getData(store.getState())).toEqual({ thingOrThings: { thing: 'test' }});
  });
});
