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
import { ControlElement } from '@jsonforms/core';
import * as React from 'react';

import { materialRenderers } from '../../src';
import MaterialListWithDetailRenderer, {
  materialListWithDetailTester,
} from '../../src/additional/MaterialListWithDetailRenderer';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { ListItem } from '@mui/material';
import { initCore } from './util';

Enzyme.configure({ adapter: new Adapter() });

const data = [
  {
    message: 'El Barto was here',
    done: true,
  },
  {
    message: 'Yolo',
  },
];
const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        maxLength: 3,
        title: 'Schema Title',
      },
      done: {
        type: 'boolean',
      },
    },
  },
};

const uischema: ControlElement = {
  type: 'Control',
  scope: '#',
};

const nestedSchema = {
  type: 'array',
  items: {
    ...schema,
  },
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
              type: 'string',
            },
          },
        },
      },
    },
  },
};

describe('Material list with detail tester', () => {
  it('should only be applicable for intermediate array or when containing proper options', () => {
    const correctUISchema = {
      type: 'ListWithDetail',
      scope: '#',
    };
    const wrongSchema = {
      type: 'array',
      items: {
        type: 'string',
      },
    };
    expect(materialListWithDetailTester(uischema, schema, undefined)).toBe(-1);
    expect(
      materialListWithDetailTester(correctUISchema, wrongSchema, undefined)
    ).toBe(-1);
    expect(
      materialListWithDetailTester(correctUISchema, schema, undefined)
    ).toBe(4);
    expect(
      materialListWithDetailTester(correctUISchema, nestedSchema, undefined)
    ).toBe(-1);
    expect(
      materialListWithDetailTester(correctUISchema, nestedSchema2, undefined)
    ).toBe(4);
  });
});
describe('Material list with detail renderer', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render two list entries', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const lis = wrapper.find('li');
    expect(lis).toHaveLength(2);
  });
  it('should render empty entries', () => {
    const core = initCore(schema, uischema, []);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const lis = wrapper.find('li');
    expect(lis).toHaveLength(0);

    const emptyWrapper = wrapper.find('ul').find('p');
    expect(emptyWrapper.text()).toBe('No data');
  });

  it('should be hideable', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('ul');
    expect(controls).toHaveLength(0);
  });

  it('select renders corresponding data in detail', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const liSecond = wrapper.find('div[role="button"]').at(1);
    liSecond.simulate('click');

    const controls = wrapper.find('input');
    expect(controls).toHaveLength(2);

    const controlFirst = wrapper.find('input').at(0);
    expect(controlFirst.props().value).toBe('Yolo');
  });

  it('ui schema label for list', () => {
    const uischemaWithLabel = {
      ...uischema,
      label: 'My awesome label',
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer
          schema={schema}
          uischema={uischemaWithLabel}
        />
      </JsonFormsStateProvider>
    );

    const listLabel = wrapper.find('h6').at(0);
    expect(listLabel.text()).toBe('My awesome label');
  });

  it('schema title for list', () => {
    const titleSchema = {
      ...schema,
      title: 'My awesome title',
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer
          schema={titleSchema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    const listTitle = wrapper.find('h6').at(0);
    expect(listTitle.text()).toBe('My awesome title');
  });

  it('choose appropriate labels in nested schema', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const liSecond = wrapper.find('div[role="button"]').at(1);
    liSecond.simulate('click');

    const labels = wrapper.find('label');
    expect(labels).toHaveLength(2);

    const label = labels.at(0);
    expect(label.text()).toBe('Schema Title');
  });

  it('add data to the array', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const addButton = wrapper.find('button').at(0);
    addButton.simulate('click');

    wrapper.update();

    const lis = wrapper.find('li');
    expect(lis).toHaveLength(3);
  });

  it('remove data from the array', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialListWithDetailRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find(ListItem)).toHaveLength(2);

    const removeButton = wrapper.find('button').at(1);
    removeButton.simulate('click');
    wrapper.update();

    const lis = wrapper.find(ListItem);
    expect(lis).toHaveLength(1);
  });
});
