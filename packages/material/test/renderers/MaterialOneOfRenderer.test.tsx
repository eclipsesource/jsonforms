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
import Dialog from '@mui/material/Dialog';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {
  ControlElement
} from '@jsonforms/core';
import {
  MaterialOneOfRenderer,
  materialRenderers
} from '../../src';
import { JsonForms, JsonFormsDispatch, JsonFormsStateProvider } from '@jsonforms/react';
import { Tab } from '@mui/material';
import { initCore, TestEmitter } from './util';

Enzyme.configure({ adapter: new Adapter() });

const waitForAsync = () => new Promise(resolve => setImmediate(resolve));

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
    const core = initCore(schema, uischema, { data: undefined });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialOneOfRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const firstTab = wrapper.find(Tab).first();
    expect(firstTab.html()).toContain('Mui-selected');
  });

  it('should render and select second tab due to datatype', () => {
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
    const data = {
      value: 5
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(MaterialOneOfRenderer).length).toBeTruthy();

    const secondTab = wrapper.find(Tab).at(1);
    expect(secondTab.html()).toContain('Mui-selected');
  });

  it('should render and select second tab due to schema with additionalProperties', () => {
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
    const data = {
      value: { bar: 'bar' }
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(MaterialOneOfRenderer).length).toBeTruthy();

    const secondTab = wrapper.find(Tab).at(1);
    expect(secondTab.html()).toContain('Mui-selected');
  });

  it('should render and select second tab due to schema with required', () => {
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
    const data = {
      value: { bar: 'bar' }
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(MaterialOneOfRenderer).length).toBeTruthy();

    const secondTab = wrapper.find(Tab).at(1);
    expect(secondTab.html()).toContain('Mui-selected');
  });

  it('should add an item at correct path', (done) => {
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
    const onChangeData: any = {
      data: undefined
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
    expect(wrapper.find(MaterialOneOfRenderer).length).toBeTruthy();

    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'test' } });
    wrapper.update();
    setTimeout(() => {
      expect(onChangeData.data).toEqual({
        value: 'test'
      });
      done();
    }, 1000);
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

    const core = initCore(schema, uischema, { data: {} });

    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <JsonFormsDispatch schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
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

    const core = initCore(schema, uischema, {});
    const onChangeData: any = {
      data: undefined
    };

    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <JsonFormsDispatch schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
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
    expect(onChangeData.data).toEqual({
      thingOrThings: ['', '']
    });
  });

  it('should switch to array based oneOf subschema, then switch back, then edit', async (done) => {
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

    const core = initCore(schema, uischema, {});
    const onChangeData: any = {
      data: undefined
    };

    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <TestEmitter
            onChange={({ data }) => {
              onChangeData.data = data;
            }}
        />
        <JsonFormsDispatch
          schema={schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    await waitForAsync();

    wrapper.update();

    selectOneOfTab(wrapper, 1, false);
    clickAddButton(wrapper, 2);
    selectOneOfTab(wrapper, 0, true);

    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'test' } });
    wrapper.update();

    setTimeout(() => {
      expect(onChangeData.data).toEqual({
        thingOrThings: { thing: 'test' }
      });
      done();
    }, 1000);

    
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

    const data = {
      value: 'Foo Bar'
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(MaterialOneOfRenderer).length).toBeTruthy();

    await waitForAsync();
    wrapper.update();
    selectOneOfTab(wrapper, 1, true);
  });

  it('should be hideable', () => {
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
    const core = initCore(schema, uischema, { data: undefined });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialOneOfRenderer
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
