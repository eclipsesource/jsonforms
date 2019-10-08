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
  JsonFormsState
} from '@jsonforms/core';
import * as React from 'react';

import { combineReducers, createStore, Store } from 'redux';
import { materialCells, materialRenderers } from '../../src';
import {
  MaterialArrayLayout,
  materialArrayLayoutTester
} from '../../src/layouts';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsStateProvider, JsonFormsContext, JsonFormsStateContext } from '@jsonforms/react';
import { resolveRef, waitForResolveRef } from '../util';

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
            scope: '#/items/properties/message'
          }
        ]
      }
    }
  }
};

describe('Material array layout tester', () => {
  it('should only be applicable for intermediate array or when containing proper options', async () => {
    expect(await materialArrayLayoutTester(uischema, schema, resolveRef(schema))).toBe(-1);
    expect(await materialArrayLayoutTester(uischema, nestedSchema, resolveRef(nestedSchema))).toBe(4);
    expect(await materialArrayLayoutTester(uischema, nestedSchema2, resolveRef(nestedSchema2))).toBe(4);

    expect(await materialArrayLayoutTester(uischemaOptions.default, schema, resolveRef(schema))).toBe(-1);
    expect(await materialArrayLayoutTester(uischemaOptions.generate, schema, resolveRef(schema))).toBe(4);
    expect(await materialArrayLayoutTester(uischemaOptions.inline, schema, resolveRef(schema))).toBe(4);
  });
});

describe('Material array layout', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render two by two children', async () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data },
          renderers: materialRenderers
        }}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const controls = wrapper.find('input');
    // 2 data entries with each having 2 controls
    expect(controls).toHaveLength(4);
  });

  it('should generate uischema when options.detail=GENERATE', async () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaOptions.generate}
        />
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const controls = wrapper.find('input');
    // 2 data entries with each having 2 controls
    expect(controls).toHaveLength(4);
  });

  it('should use inline options.detail uischema', async () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data },
          renderers: materialRenderers,
          cells: materialCells
        }}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaOptions.inline}
        />
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);

    const controls = wrapper.find('input');
    // 2 data entries with each having 1 control
    expect(controls).toHaveLength(2);
  });

  it('should be hideable', () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data },
          renderers: materialRenderers,
          cells: materialCells
        }}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('input');
    // no controls should be rendered
    expect(controls).toHaveLength(0);
  });

  it('should have renderers prop via ownProps', () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data },
          renderers: materialRenderers,
          cells: materialCells
        }}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischema}
          renderers={[]}
        />
      </JsonFormsStateProvider>
    );

    const materialArrayLayout = wrapper.find(MaterialArrayLayout);
    expect(materialArrayLayout.props().renderers).toHaveLength(0);
  });

  it('ui schema label for array', () => {
    const uischemaWithLabel = {
      ...uischema,
      label: 'My awesome label'
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data },
          renderers: materialRenderers,
          cells: materialCells
        }}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithLabel}
        />
      </JsonFormsStateProvider>
    );

    const listLabel = wrapper.find('h6').at(0);
    expect(listLabel.text()).toBe('My awesome label');
  });

  it('schema title for array', () => {
    const titleSchema = {
      ...schema,
      title: 'My awesome title'
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data },
          renderers: materialRenderers,
          cells: materialCells
        }}>
        <MaterialArrayLayout schema={titleSchema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const listTitle = wrapper.find('h6').at(0);
    expect(listTitle.text()).toBe('My awesome title');
  });

  it('should render sort buttons if showSortButtons is true', () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema: uischemaWithSortOption, data },
          renderers: materialRenderers,
          cells: materialCells
        }}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithSortOption}
        />
      </JsonFormsStateProvider>
    );

    // up button
    expect(
      wrapper
        .find('ExpandPanelRenderer')
        .at(0)
        .find('button')
        .find({ 'aria-label': 'Move up' }).length
    ).toBe(1);
    // down button
    expect(
      wrapper
        .find('ExpandPanelRenderer')
        .at(0)
        .find('button')
        .find({ 'aria-label': 'Move down' }).length
    ).toBe(1);
  });
  it('should move item up if up button is presses', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema: uischemaWithSortOption, data },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (
              <MaterialArrayLayout
                schema={schema}
                uischema={uischemaWithSortOption}
              />
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('ExpandPanelRenderer')
      .at(1)
      .find('button')
      .find({ 'aria-label': 'Move up' });
    upButton.simulate('click');
    expect(ctx.core.data).toEqual([
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
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema: uischemaWithSortOption, data },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (
              <MaterialArrayLayout
                schema={schema}
                uischema={uischemaWithSortOption}
              />
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('ExpandPanelRenderer')
      .at(0)
      .find('button')
      .find({ 'aria-label': 'Move down' });
    upButton.simulate('click');

    expect(ctx.core.data).toEqual([
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
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema: uischemaWithSortOption, data },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithSortOption}
        />
      </JsonFormsStateProvider>
    );
    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('ExpandPanelRenderer')
      .at(0)
      .find('button')
      .find({ 'aria-label': 'Move up' });
    expect(upButton.is('[disabled]')).toBe(true);
  });

  it('should have down button disabled for last element', () => {
    const store = initJsonFormsStore();
    store.dispatch(Actions.init(data, schema, uischemaWithSortOption));
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema: uischemaWithSortOption, data },
          renderers: materialRenderers,
          cells: materialCells
        }}
      >
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaWithSortOption}
        />
      </JsonFormsStateProvider>
    );
    // getting up button of second item in expension panel;
    const downButton = wrapper
      .find('ExpandPanelRenderer')
      .at(1)
      .find('button')
      .find({ 'aria-label': 'Move down' });
    expect(downButton.is('[disabled]')).toBe(true);
  });
});
