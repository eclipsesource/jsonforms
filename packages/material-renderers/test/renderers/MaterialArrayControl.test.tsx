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
  ArrayTranslationEnum,
  ControlElement,
  DispatchCellProps,
  JsonSchema,
} from '@jsonforms/core';
import * as React from 'react';

import MaterialArrayControlRenderer from '../../src/complex/MaterialArrayControlRenderer';
import { materialCells, materialRenderers } from '../../src';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonFormsStateProvider, StatelessRenderer } from '@jsonforms/react';
import { initCore, TestEmitter } from './util';
import { checkTooltip, checkTooltipTranslation } from './tooltipChecker';

Enzyme.configure({ adapter: new Adapter() });

const fixture: {
  data: any;
  schema: JsonSchema;
  uischema: ControlElement;
} = {
  data: [
    {
      message: 'El Barto was here',
      done: true,
    },
    {
      message: 'Yolo',
    },
  ],
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          maxLength: 3,
        },
        done: {
          type: 'boolean',
        },
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#',
  },
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
        items: { type: 'string' },
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/test',
    options: {
      showSortButtons: true,
    },
  },
};

describe('Material array control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
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
    const core = initCore(fixture.schema, fixture.uischema);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
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

  it('should render even without properties', () => {
    // re-init
    const data: any = { test: [] };
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test',
    };
    const core = initCore(schema, uischema, data);

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const rows = wrapper.find('tr');
    // two header rows + no data row
    expect(rows.length).toBe(3);
    const headerColumns = rows.at(1).children();
    // 2 columns: content + buttons
    expect(headerColumns).toHaveLength(2);
  });

  it('should use title as a header if it exists', () => {
    // re-init
    const data: any = { test: [] };
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              test1: {
                type: 'string',
                title: 'first test',
              },
              test_2: {
                type: 'string',
              },
            },
          },
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test',
    };
    const core = initCore(schema, uischema, data);

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    // column headings are in the second row of the table, wrapped in <th>
    const headers = wrapper.find('tr').at(1).find('th');

    // the first property has a title, so we expect it to be rendered as the first column heading
    expect(headers.at(0).text()).toEqual('first test');

    // the second property has no title, so we expect to see the property name in start case
    expect(headers.at(1).text()).toEqual('Test 2');
  });

  it('should render empty primitives', () => {
    // re-init
    const data: any = { test: [] };
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test',
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const rows = wrapper.find('tr');
    // header + no data row
    expect(rows).toHaveLength(2);
    const emptyDataCol = rows.at(1).find('td');
    expect(emptyDataCol).toHaveLength(1);
    // selection column + 1 data column
    expect(emptyDataCol.first().props().colSpan).toBe(2);
  });

  it('should render primitives', () => {
    // re-init
    const data = { test: ['foo', 'bar'] };
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test',
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const rows = wrapper.find('tr');
    // header + 2 data entries
    expect(rows).toHaveLength(3);
  });

  it('should render description', () => {
    const descriptionSchema = {
      ...fixture.schema,
      description: 'This is an array description',
    };

    const core = initCore(descriptionSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
          schema={descriptionSchema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );
    expect(
      wrapper.text().includes('This is an array description')
    ).toBeTruthy();
    expect(wrapper.find('thead .MuiFormHelperText-root').exists()).toBeTruthy();
  });

  it('should not render description container if there is none', () => {
    const descriptionSchema = {
      ...fixture.schema,
    };
    // make sure there is no description
    delete descriptionSchema.description;

    const core = initCore(descriptionSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
          schema={descriptionSchema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );
    expect(wrapper.find('thead .MuiFormHelperText-root').exists()).toBeFalsy();
  });

  it('should delete an item', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, cells: materialCells, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <MaterialArrayControlRenderer
          schema={fixture.schema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    const buttons = wrapper.find('button');
    // 7 buttons
    // add row
    // clear string
    // delete row
    // clear string
    // delete row
    // two dialog buttons (no + yes)
    const nrOfRowsBeforeDelete = wrapper.find('tr').length;

    const deleteButton = buttons.at(2);
    deleteButton.simulate('click');

    const confirmButton = buttons.at(6);
    confirmButton.simulate('click');

    const nrOfRowsAfterDelete = wrapper.find('tr').length;

    expect(nrOfRowsBeforeDelete).toBe(4);
    expect(nrOfRowsAfterDelete).toBe(3);
    expect(onChangeData.data.length).toBe(1);
  });

  const CellRenderer1: StatelessRenderer<DispatchCellProps> = () => (
    <div className='cell test 1' />
  );
  const CellRenderer2: StatelessRenderer<DispatchCellProps> = () => (
    <div className='cell test 2' />
  );

  it('should use cells from store', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const cells = [
      {
        tester: () => 50,
        cell: CellRenderer1,
      },
      {
        tester: () => 51,
        cell: CellRenderer2,
      },
    ];

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture.schema}
          uischema={fixture.uischema}
          cells={cells}
        />
      </JsonFormsStateProvider>
    );

    const rows = wrapper.find({ className: 'cell test 2' });
    // 2 header rows + 2 data entries
    expect(rows.length).toBe(4);
  });

  it('should use cells from own props', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const cell = {
      tester: () => 50,
      cell: CellRenderer1,
    };

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture.schema}
          uischema={fixture.uischema}
          cells={[cell, { tester: () => 60, cell: CellRenderer2 }]}
        />
      </JsonFormsStateProvider>
    );

    const rows = wrapper.find({ className: 'cell test 2' });
    // 2 header rows + 2 data entries
    expect(rows.length).toBe(4);
  });

  it('should support adding rows that contain enums', () => {
    const schema = {
      type: 'object',
      properties: {
        things: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              somethingElse: {
                type: 'string',
              },
              thing: {
                type: 'string',
                enum: ['thing'],
              },
            },
          },
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/things',
    };
    const core = initCore(schema, uischema, {});
    const onChangeData: any = {
      data: undefined,
    };

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <MaterialArrayControlRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

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
    expect(onChangeData.data).toEqual({ things: [{}, {}] });
  });

  it('should be hideable', () => {
    const schema = {
      type: 'object',
      properties: {
        things: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              somethingElse: {
                type: 'string',
              },
              thing: {
                type: 'string',
                enum: ['thing'],
              },
            },
          },
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/things',
    };
    const core = initCore(schema, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    const nrOfButtons = wrapper.find('button').length;
    expect(nrOfButtons).toBe(0);

    const nrOfRows = wrapper.find('tr').length;
    expect(nrOfRows).toBe(0);
  });
  it('should render sort buttons if showSortButtons is true', () => {
    const data = { test: ['foo'] };
    const core = initCore(fixture2.schema, fixture2.uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
        />
      </JsonFormsStateProvider>
    );
    // up button
    expect(
      wrapper.find('button').find({ 'aria-label': 'Move item up' }).length
    ).toBe(1);
    // down button
    expect(
      wrapper.find('button').find({ 'aria-label': 'Move item down' }).length
    ).toBe(1);
  });
  it('should be able to move item down if down button is clicked', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
        />
      </JsonFormsStateProvider>
    );
    // first row is header in table
    const downButton = wrapper
      .find('tr')
      .at(1)
      .find('button')
      .find({ 'aria-label': 'Move item down' });
    downButton.simulate('click');
    expect(onChangeData.data).toEqual({
      test: ['baz', 'foo', 'bar'],
    });
  });
  it('should be able to move item up if up button is clicked', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
        />
      </JsonFormsStateProvider>
    );
    // first row is header in table
    const upButton = wrapper
      .find('tr')
      .at(3)
      .find('button')
      .find({ 'aria-label': 'Move item up' });
    upButton.simulate('click');
    expect(onChangeData.data).toEqual({
      test: ['foo', 'bar', 'baz'],
    });
  });
  it('should have up button disabled for first element', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
        />
      </JsonFormsStateProvider>
    );
    // first row is header in table
    const upButton = wrapper
      .find('tr')
      .at(1)
      .find('button')
      .find({ 'aria-label': 'Move item up' });
    expect(upButton.is('[disabled]')).toBe(true);
  });

  it('should have fields enabled', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, cells: materialCells, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
          enabled={true}
        />
      </JsonFormsStateProvider>
    );
    // first row is header in table
    const input = wrapper.find('tr').at(1).find('input').first();
    expect(input.props().disabled).toBe(false);
  });

  it('should have fields disabled', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, cells: materialCells, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
          enabled={false}
        />
      </JsonFormsStateProvider>
    );
    // first row is header in table
    const input = wrapper.find('tr').at(1).find('input').first();
    expect(input.props().disabled).toBe(true);
  });

  it('add and delete buttons should exist if enabled', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, cells: materialCells, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
          enabled={true}
        />
      </JsonFormsStateProvider>
    );

    const deleteButton = wrapper.find({ 'aria-label': 'Delete button' });
    expect(deleteButton.exists()).toBeTruthy();
    const addButton = wrapper.find({ 'aria-label': 'Add to Test button' });
    expect(addButton.exists()).toBeTruthy();
  });

  it('add and delete buttons should be removed if disabled', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, cells: materialCells, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
          enabled={false}
        />
      </JsonFormsStateProvider>
    );

    const deleteButton = wrapper.find({ 'aria-label': 'Delete button' });
    expect(deleteButton.exists()).toBeFalsy();
    const addButton = wrapper.find({ 'aria-label': 'Add to Test button' });
    expect(addButton.exists()).toBeFalsy();
  });

  it('add button should be removed if indicated via ui schema', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    const uischema = { ...fixture2.uischema };
    uischema.options = { ...uischema.options, disableAdd: true };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, cells: materialCells, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    const button = wrapper.find({ 'aria-label': 'Add to Test button' });
    expect(button.exists()).toBeFalsy();
  });

  it('delete button should be removed if indicated via ui schema', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    const uischema = { ...fixture2.uischema };
    uischema.options = { ...uischema.options, disableRemove: true };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, cells: materialCells, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    const button = wrapper.find({ 'aria-label': 'Delete button' });
    expect(button.exists()).toBeFalsy();
  });

  it('add and delete buttons should be removed if indicated via config', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          renderers: materialRenderers,
          cells: materialCells,
          core,
          config: { disableAdd: true, disableRemove: true },
        }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
        />
      </JsonFormsStateProvider>
    );

    const deleteButton = wrapper.find({ 'aria-label': 'Delete button' });
    expect(deleteButton.exists()).toBeFalsy();
    const addButton = wrapper.find({ 'aria-label': 'Add to Test button' });
    expect(addButton.exists()).toBeFalsy();
  });

  it('should have down button disabled for last element', () => {
    const core = initCore(fixture2.schema, fixture2.uischema, fixture2.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayControlRenderer
          schema={fixture2.schema}
          uischema={fixture2.uischema}
        />
      </JsonFormsStateProvider>
    );
    // first row is header in table
    // first buttton is up arrow, second button is down arrow
    const downButton = wrapper
      .find('tr')
      .at(3)
      .find('button')
      .find({ 'aria-label': 'Move item down' });
    expect(downButton.is('[disabled]')).toBe(true);
  });

  it('should have a tooltip for add button', () => {
    wrapper = checkTooltip(
      fixture.schema,
      fixture.uischema,
      wrapper,
      (wrapper) => wrapper.find('tr').at(0),
      ArrayTranslationEnum.addTooltip,
      {
        id: 'tooltip-add',
      },
      fixture.data
    );
  });
  it('should have a translatable tooltip for add button', () => {
    wrapper = checkTooltipTranslation(
      fixture.schema,
      fixture.uischema,
      wrapper,
      (wrapper) => wrapper.find('tr').at(0),
      {
        id: 'tooltip-add',
      },
      fixture.data
    );
  });

  it('should have a tooltip for delete button', () => {
    wrapper = checkTooltip(
      fixture2.schema,
      fixture2.uischema,
      wrapper,
      (wrapper) => wrapper.find('tr').at(1),
      ArrayTranslationEnum.removeTooltip,
      {
        id: 'tooltip-remove',
      },
      fixture2.data
    );
  });
  it('should have a translatable tooltip for delete button', () => {
    wrapper = checkTooltipTranslation(
      fixture2.schema,
      fixture2.uischema,
      wrapper,
      (wrapper) => wrapper.find('tr').at(1),
      {
        id: 'tooltip-remove',
      },
      fixture2.data
    );
  });

  it('should have a tooltip for up button', () => {
    wrapper = checkTooltip(
      fixture2.schema,
      fixture2.uischema,
      wrapper,
      (wrapper) => wrapper.find('tr').at(1),
      ArrayTranslationEnum.up,
      {
        id: 'tooltip-up',
      },
      fixture2.data
    );
  });
  it('should have a translatable tooltip for up button', () => {
    wrapper = checkTooltipTranslation(
      fixture2.schema,
      fixture2.uischema,
      wrapper,
      (wrapper) => wrapper.find('tr').at(1),
      {
        id: 'tooltip-up',
      },
      fixture2.data
    );
  });

  it('should have a tooltip for down button', () => {
    wrapper = checkTooltip(
      fixture2.schema,
      fixture2.uischema,
      wrapper,
      (wrapper) => wrapper.find('tr').at(1),
      ArrayTranslationEnum.down,
      {
        id: 'tooltip-down',
      },
      fixture2.data
    );
  });
  it('should have a translatable tooltip for down button', () => {
    wrapper = checkTooltipTranslation(
      fixture2.schema,
      fixture2.uischema,
      wrapper,
      (wrapper) => wrapper.find('tr').at(1),
      {
        id: 'tooltip-down',
      },
      fixture2.data
    );
  });
});
