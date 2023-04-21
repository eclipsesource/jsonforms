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

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { ControlElement } from '@jsonforms/core';
import {
  MaterialAnyOfRenderer,
  materialCells,
  materialRenderers,
} from '../../src';
import { JsonForms, JsonFormsStateProvider } from '@jsonforms/react';
import { initCore, TestEmitter } from './util';

Enzyme.configure({ adapter: new Adapter() });

const waitForAsync = () => new Promise((resolve) => setImmediate(resolve));

const clickAddButton = (wrapper: ReactWrapper, times: number) => {
  const buttons = wrapper.find('button');
  const addButton = buttons.at(2);
  for (let i = 0; i < times; i++) {
    addButton.simulate('click');
  }
  wrapper.update();
};

const selectanyOfTab = (wrapper: ReactWrapper, at: number) => {
  const buttons = wrapper.find('button');
  buttons.at(at).simulate('click');
  wrapper.update();
};

describe('Material anyOf renderer', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should add an item at correct path', (done) => {
    const schema = {
      type: 'object',
      properties: {
        value: {
          anyOf: [
            {
              title: 'String',
              type: 'string',
            },
            {
              title: 'Number',
              type: 'number',
            },
          ],
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value',
    };
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonForms
        data={undefined}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
        onChange={({ data }) => {
          onChangeData.data = data;
        }}
      />
    );
    expect(wrapper.find(MaterialAnyOfRenderer).length).toBeTruthy();
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'test' } });
    wrapper.update();
    setTimeout(() => {
      expect(onChangeData.data).toEqual({
        value: 'test',
      });
      done();
    }, 1000);
  });

  it('should add a "mything"', async () => {
    const schema = {
      type: 'object',
      properties: {
        myThingsAndOrYourThings: {
          anyOf: [
            {
              $ref: '#/definitions/myThings',
            },
            {
              $ref: '#/definitions/yourThings',
            },
          ],
        },
      },
      definitions: {
        myThings: {
          title: 'MyThing',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
        yourThings: {
          title: 'YourThings',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              age: {
                type: 'number',
              },
            },
          },
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/myThingsAndOrYourThings',
    };
    const core = initCore(schema, uischema);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialAnyOfRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    await waitForAsync();

    wrapper.update();

    selectanyOfTab(wrapper, 1);
    const nrOfRowsBeforeAdd = wrapper.find('tr');
    clickAddButton(wrapper, 2);
    const nrOfRowsAfterAdd = wrapper.find('tr');

    // 2 header row + 1 no data row
    expect(nrOfRowsBeforeAdd.length).toBe(3);
    // 2 header row + 2 data rows (one is replacing the 'No data' one)
    expect(nrOfRowsAfterAdd.length).toBe(4);
  });

  it('should switch to "yourThing" edit, then switch back, then edit', async (done) => {
    const schema = {
      type: 'object',
      properties: {
        myThingsAndOrYourThings: {
          anyOf: [
            {
              $ref: '#/definitions/myThings',
            },
            {
              $ref: '#/definitions/yourThings',
            },
          ],
        },
      },
      definitions: {
        myThings: {
          title: 'MyThing',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
        yourThings: {
          title: 'YourThings',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              age: {
                type: 'number',
              },
            },
          },
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/myThingsAndOrYourThings',
    };
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, cells: materialCells, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <MaterialAnyOfRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    await waitForAsync();

    wrapper.update();

    selectanyOfTab(wrapper, 1);
    clickAddButton(wrapper, 1);
    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 5 } });
    wrapper.update();
    selectanyOfTab(wrapper, 0);

    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'test' } });
    wrapper.update();

    setTimeout(() => {
      expect(onChangeData.data).toEqual({
        myThingsAndOrYourThings: [{ age: 5, name: 'test' }],
      });
      done();
    }, 1000);
  });

  it('should be hideable', () => {
    const schema = {
      type: 'object',
      properties: {
        value: {
          anyOf: [
            {
              title: 'String',
              type: 'string',
            },
            {
              title: 'Number',
              type: 'number',
            },
          ],
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value',
    };
    const core = initCore(schema, uischema);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialAnyOfRenderer
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(0);
  });
});
