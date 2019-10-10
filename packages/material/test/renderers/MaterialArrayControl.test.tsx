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
import {
  Actions,
  ControlElement,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema
} from '@jsonforms/core';
import * as React from 'react';

import { ConnectedMaterialArrayControlRenderer } from '../../src/complex/MaterialArrayControlRenderer';
import { AnyAction, combineReducers, createStore, Reducer, Store } from 'redux';
import { materialCells, materialRenderers } from '../../src';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  JsonFormsContext,
  JsonFormsStateContext,
  JsonFormsStateProvider,
  RefResolver
} from '@jsonforms/react';
import { waitForResolveRef } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const fixture: {
  data: any;
  schema: JsonSchema;
  uischema: ControlElement;
} = {
  data: [
    {
      message: 'El Barto was here',
      done: true
    },
    {
      message: 'Yolo'
    }
  ],
  schema: {
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
  },
  uischema: {
    type: 'Control',
    scope: '#'
  }
};

const fixture2: {
  data: any;
  schema: JsonSchema;
  uischema: ControlElement;
} = {
  data: { test: ['foo', 'baz', 'bar'] },
  schema: {
    type: 'object',
    properties: {
      test: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/test',
    options: {
      showSortButtons: true
    }
  }
};

export const initJsonFormsStore = (customData?: any): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {}
  };
  const reducer: Reducer<JsonFormsState, AnyAction> = combineReducers({
    jsonforms: jsonformsReducer()
  });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  const { data, schema, uischema } = fixture;
  store.dispatch(
    Actions.init(customData ? customData : data, schema, uischema)
  );

  return store;
};

describe('Material array control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render', () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: {
            uischema: fixture.uischema,
            schema: fixture.schema,
            data: fixture.data
          },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <ConnectedMaterialArrayControlRenderer
          schema={fixture.schema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    const rows = wrapper.find('tr');
    // 2 header rows + 2 data entries
    expect(rows.length).toBe(4);
  });

  it('should render empty', () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { uischema: fixture.uischema, schema: fixture.schema },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <ConnectedMaterialArrayControlRenderer
          schema={fixture.schema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    const rows = wrapper.find('tr');
    // two header rows + no data row
    expect(rows.length).toBe(3);
    const headerColumns = rows.at(1).children();
    // 3 columns: message & done properties + column for delete button
    expect(headerColumns).toHaveLength(3);
  });

  it('should render empty primitives', async () => {
    // re-init
    const data: any = { test: [] };
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test'
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { uischema, schema, data },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <RefResolver schema={schema} pointer={uischema.scope}>
          {(resolvedSchema: JsonSchema) => {
            return (
              <ConnectedMaterialArrayControlRenderer
                schema={resolvedSchema}
                uischema={uischema}
              />
            );
          }}
        </RefResolver>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const rows = wrapper.find('tr');
    // header + no data row
    expect(rows).toHaveLength(2);
    const emptyDataCol = rows.at(1).find('td');
    expect(emptyDataCol).toHaveLength(1);
    // selection column + 1 data column
    expect(emptyDataCol.first().props().colSpan).toBe(2);
  });

  it('should render primitives', async () => {
    // re-init
    const data = { test: ['foo', 'bar'] };
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test'
    };

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { uischema, schema, data },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <RefResolver schema={schema} pointer={uischema.scope}>
          {(resolvedSchema: JsonSchema) => {
            return (
              <ConnectedMaterialArrayControlRenderer
                schema={resolvedSchema}
                uischema={uischema}
              />
            );
          }}
        </RefResolver>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const rows = wrapper.find('tr');
    // header + 2 data entries
    expect(rows).toHaveLength(3);
  });

  it('should delete an item', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: {
            uischema: fixture.uischema,
            schema: fixture.schema,
            data: fixture.data
          },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (
              <RefResolver schema={fixture.schema} pointer={fixture.uischema.scope}>
                {(resolvedSchema: JsonSchema) => {
                  return (
                    <ConnectedMaterialArrayControlRenderer
                      schema={resolvedSchema}
                      uischema={fixture.uischema}
                    />
                  );
                }}
              </RefResolver>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const buttons = wrapper.find('button');
    // 5 buttons
    // add row
    // delete row
    // delete row
    // two dialog buttons (no + yes)
    const nrOfRowsBeforeDelete = wrapper.find('tr').length;

    const deleteButton = buttons.at(1);
    deleteButton.simulate('click');

    const confirmButton = buttons.at(4);
    confirmButton.simulate('click');

    const nrOfRowsAfterDelete = wrapper.find('tr').length;

    expect(nrOfRowsBeforeDelete).toBe(4);
    expect(nrOfRowsAfterDelete).toBe(3);
    expect(ctx.core.data).toHaveLength(1);
  });

  it('should support adding rows that contain enums', async () => {
    let ctx: JsonFormsStateContext;
    const schema = {
      type: 'object',
      properties: {
        things: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              somethingElse: {
                type: 'string'
              },
              thing: {
                type: 'string',
                enum: ['thing']
              }
            }
          }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/things'
    };

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { uischema, schema, data: {} },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (
              <RefResolver schema={schema} pointer={uischema.scope}>
                {(resolvedSchema: JsonSchema) => {
                  return (
                    <ConnectedMaterialArrayControlRenderer
                      schema={resolvedSchema}
                      uischema={uischema}
                    />
                  );
                }}
              </RefResolver>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const buttons = wrapper.find('button');
    // 3 buttons
    // add row
    // two dialog buttons (no + yes)
    const nrOfRowsBeforeAdd = wrapper.find('tr').length;

    const addButton = buttons.at(0);
    addButton.simulate('click');
    addButton.simulate('click');
    wrapper.update();
    const nrOfRowsAfterAdd = wrapper.find('tr').length;
    // 2 header rows + 'no data' row
    expect(nrOfRowsBeforeAdd).toBe(3);
    expect(nrOfRowsAfterAdd).toBe(4);
    expect(ctx.core.data).toEqual({ things: [{}, {}] });
  });

  it('should be hideable', async () => {
    const schema = {
      type: 'object',
      properties: {
        things: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              somethingElse: {
                type: 'string'
              },
              thing: {
                type: 'string',
                enum: ['thing']
              }
            }
          }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/things'
    };

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { uischema, schema, data: {} },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <RefResolver schema={schema} pointer={uischema.scope}>
          {(resolvedSchema: JsonSchema) => {
            return (
              <ConnectedMaterialArrayControlRenderer
                schema={resolvedSchema}
                uischema={uischema}
                visible={false}
              />
            );
          }}
        </RefResolver>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const nrOfButtons = wrapper.find('button').length;
    expect(nrOfButtons).toBe(0);

    const nrOfRows = wrapper.find('tr').length;
    expect(nrOfRows).toBe(0);
  });

  it('should render sort buttons if showSortButtons is true', async () => {
    const data = { test: ['foo'] };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: {
            uischema: fixture2.uischema,
            schema: fixture2.schema,
            data
          },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <RefResolver schema={fixture2.schema} pointer={fixture2.uischema.scope}>
          {(resolvedSchema: JsonSchema) => {
            return (
              <ConnectedMaterialArrayControlRenderer
                schema={resolvedSchema}
                uischema={fixture2.uischema}
              />
            );
          }}
        </RefResolver>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    // up button
    expect(
      wrapper.find('button').find({ 'aria-label': 'Move up' }).length
    ).toBe(1);
    // down button
    expect(
      wrapper.find('button').find({ 'aria-label': 'Move down' }).length
    ).toBe(1);
  });

  it('should be able to move item down if down button is clicked', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: {
            uischema: fixture2.uischema,
            schema: fixture2.schema,
            data: fixture2.data
          },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (
              <RefResolver schema={fixture2.schema} pointer={fixture2.uischema.scope}>
                {(resolvedSchema: JsonSchema) => {
                  return (
                    <ConnectedMaterialArrayControlRenderer
                      schema={resolvedSchema}
                      uischema={fixture2.uischema}
                    />
                  );
                }}
              </RefResolver>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    // first row is header in table
    const downButton = wrapper
      .find('tr')
      .at(1)
      .find('button')
      .find({ 'aria-label': 'Move down' });
    downButton.simulate('click');
    expect(ctx.core.data).toEqual({ test: ['baz', 'foo', 'bar'] });
  });

  it('should be able to move item up if up button is clicked', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: {
            uischema: fixture2.uischema,
            schema: fixture2.schema,
            data: fixture2.data
          },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (
              <RefResolver schema={fixture2.schema} pointer={fixture2.uischema.scope}>
                {(resolvedSchema: JsonSchema) => {
                  return (
                    <ConnectedMaterialArrayControlRenderer
                      schema={resolvedSchema}
                      uischema={fixture2.uischema}
                    />
                  );
                }}
              </RefResolver>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    // first row is header in table
    const upButton = wrapper
      .find('tr')
      .at(3)
      .find('button')
      .find({ 'aria-label': 'Move up' });
    upButton.simulate('click');
    expect(ctx.core.data).toEqual({ test: ['foo', 'bar', 'baz'] });
  });

  it('should have up button disabled for first element', async () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: {
            uischema: fixture2.uischema,
            schema: fixture2.schema,
            data: fixture2.data
          },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <RefResolver schema={fixture2.schema} pointer={fixture2.uischema.scope}>
          {(resolvedSchema: JsonSchema) => {
            return (
              <ConnectedMaterialArrayControlRenderer
                schema={resolvedSchema}
                uischema={fixture2.uischema}
              />
            );
          }}
        </RefResolver>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    // first row is header in table
    const upButton = wrapper
      .find('tr')
      .at(1)
      .find('button')
      .find({ 'aria-label': 'Move up' });
    expect(upButton.is('[disabled]')).toBe(true);
  });

  it('should have down button disabled for last element', async () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: {
            uischema: fixture2.uischema,
            schema: fixture2.schema,
            data: fixture2.data
          },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <RefResolver schema={fixture2.schema} pointer={fixture2.uischema.scope}>
          {(resolvedSchema: JsonSchema) => {
            return (
              <ConnectedMaterialArrayControlRenderer
                schema={resolvedSchema}
                uischema={fixture2.uischema}
              />
            );
          }}
        </RefResolver>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    // first row is header in table
    // first buttton is up arrow, second button is down arrow
    const downButton = wrapper
      .find('tr')
      .at(3)
      .find('button')
      .find({ 'aria-label': 'Move down' });
    expect(downButton.is('[disabled]')).toBe(true);
  });
});
