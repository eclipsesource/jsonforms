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
import * as React from 'react';
import { ControlElement, JsonSchema, NOT_APPLICABLE } from '@jsonforms/core';
import TextCell, {
  materialTextCellTester,
} from '../../src/cells/MaterialTextCell';
import { materialRenderers } from '../../src';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { initCore, TestEmitter } from './util';

Enzyme.configure({ adapter: new Adapter() });

const DEFAULT_MAX_LENGTH = 524288;
const DEFAULT_SIZE = 20;

const data = { name: 'Foo' };
const minLengthSchema = {
  type: 'string',
  minLength: 3,
};
const maxLengthSchema = {
  type: 'string',
  maxLength: 5,
};
const schema = { type: 'string' };

const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/name',
};

describe('Material text cell tester', () => {
  it('should fail', () => {
    expect(materialTextCellTester(undefined, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialTextCellTester(null, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialTextCellTester({ type: 'Foo' }, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(
      materialTextCellTester({ type: 'Control' }, undefined, undefined)
    ).toBe(NOT_APPLICABLE);
  });
  it('should fail with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      materialTextCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
            },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      materialTextCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
            },
            bar: {
              type: 'string',
            },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed with matching prop type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      materialTextCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
            },
          },
        },
        undefined
      )
    ).toBe(1);
  });
});

describe('Material text cell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: true },
    };
    const core = initCore(minLengthSchema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeTruthy();
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: false },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={control} path={'name'} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const core = initCore(minLengthSchema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(document.activeElement).not.toBe(input);
  });

  it('should render', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    };
    const core = initCore(minLengthSchema, uischema, { name: 'Foo' });
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={jsonSchema} uischema={uischema} path={'name'} />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('should update via input event', (done) => {
    const core = initCore(minLengthSchema, uischema, data);
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
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'Bar' } });
    setTimeout(() => {
      expect(onChangeData.data.name).toBe('Bar');
      done();
    }, 1000);
  });

  it('should update via action', (done) => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, name: 'Bar' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input').first();
      expect(input.props().value).toBe('Bar');
      done();
    }, 1000);
  });

  it('should update with undefined value', (done) => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, name: undefined };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input').first();
      expect(input.props().value).toBe('');
      done();
    }, 1000);
  });

  it('should update with null value', (done) => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, name: null };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input').first();
      expect(input.props().value).toBe('');
      done();
    }, 1000);
  });

  it('should not update if wrong ref', (done) => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, firstname: 'Bar' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input').first();
      expect(input.props().value).toBe('Foo');
      done();
    }, 1000);
  });

  it('should not update if null ref', (done) => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: 'Bar' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input').first();
      expect(input.props().value).toBe('Foo');
      done();
    }, 1000);
  });

  it('should not update if undefined ref', (done) => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: 'Bar' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input').first();
      expect(input.props().value).toBe('Foo');
      done();
    }, 1000);
  });

  it('can be disabled', () => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell
          schema={minLengthSchema}
          uischema={uischema}
          path='name'
          enabled={false}
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('should use maxLength for size and maxlength attributes', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true,
      },
    };
    const core = initCore(maxLengthSchema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={maxLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().maxLength).toBe(5);
    expect(input.parent().props().width).not.toBe('100%');
    expect(input.props().size).toBe(5);
  });

  it('should use maxLength for size attribute', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { trim: true },
    };
    const core = initCore(maxLengthSchema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={maxLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).not.toBe('100%');
    expect(input.size).toBe(5);
  });

  it('should use maxLength for maxlength attribute', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true },
    };
    const core = initCore(maxLengthSchema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={maxLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should not use maxLength by default', () => {
    const core = initCore(maxLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for trim and restrict', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true,
      },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={schema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);

    expect(input.parentElement.classList.contains('MuiInputBase-fullWidth'))
      .toBeTruthy;
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have a default value for trim', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { trim: true },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={schema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(input.parentElement.classList.contains('MuiInputBase-fullWidth'))
      .toBeTruthy;
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for restrict', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={schema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(input.parentElement.classList.contains('MuiInputBase-fullWidth'))
      .toBeTruthy;
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for attributes', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(input.parentElement.classList.contains('MuiInputBase-fullWidth'))
      .toBeTruthy;
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should be disabled', () => {
    const core = initCore(minLengthSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TextCell
          schema={schema}
          uischema={uischema}
          path={'name'}
          enabled={false}
        />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBe(true);
  });
});
