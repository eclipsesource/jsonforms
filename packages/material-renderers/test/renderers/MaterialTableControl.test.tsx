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
import { JsonSchema7 } from '@jsonforms/core';
import * as React from 'react';

import { materialCells, materialRenderers } from '../../src';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonForms } from '@jsonforms/react';
import { FormHelperText } from '@mui/material';

Enzyme.configure({ adapter: new Adapter() });

const dataWithEmptyMessage = {
  nested: [
    {
      message: '',
    },
  ],
};

const dataWithNullMessage = {
  nested: [
    {
      message: null as string | null,
    },
  ],
};

const dataWithUndefinedMessage = {
  nested: [
    {
      message: undefined as string | undefined,
    },
  ],
};

const schemaWithMinLength: JsonSchema7 = {
  type: 'object',
  properties: {
    nested: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          message: { type: 'string', minLength: 3 },
          done: { type: 'boolean' },
        },
      },
    },
  },
};

const schemaWithRequired: JsonSchema7 = {
  type: 'object',
  properties: {
    nested: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          done: { type: 'boolean' },
        },
        required: ['message'],
      },
    },
  },
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/nested',
    },
  ],
};

describe('Material table control', () => {
  let wrapper: ReactWrapper;

  const validSchemaDataPairs = [
    {
      schema: schemaWithRequired,
      data: dataWithEmptyMessage,
    },
    {
      schema: schemaWithMinLength,
      data: dataWithUndefinedMessage,
    },
  ];

  const invalidSchemaDataPairs = [
    {
      schema: schemaWithRequired,
      data: dataWithNullMessage,
      message: 'must be string',
    },
    {
      schema: schemaWithRequired,
      data: dataWithUndefinedMessage,
      message: "must have required property 'message'",
    },
    {
      schema: schemaWithMinLength,
      data: dataWithEmptyMessage,
      message: 'must NOT have fewer than 3 characters',
    },
  ];

  afterEach(() => wrapper.unmount());

  it.each(invalidSchemaDataPairs)(
    'should show error message for invalid property with validation mode ValidateAndShow',
    ({ schema, data, message }) => {
      wrapper = mount(
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
          cells={materialCells}
          validationMode='ValidateAndShow'
        />
      );
      const messageFormHelperText = wrapper.find(FormHelperText).at(0);
      expect(messageFormHelperText.text()).toBe(message);
      expect(messageFormHelperText.props().error).toBe(true);

      const doneFormHelperText = wrapper.find(FormHelperText).at(1);
      expect(doneFormHelperText.text()).toBe('');
      expect(doneFormHelperText.props().error).toBe(false);
    }
  );

  it.each(invalidSchemaDataPairs)(
    'should not show error message for invalid property with validation mode ValidateAndHide',
    ({ schema, data }) => {
      wrapper = mount(
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
          cells={materialCells}
          validationMode='ValidateAndHide'
        />
      );
      const messageFormHelperText = wrapper.find(FormHelperText).at(0);
      expect(messageFormHelperText.text()).toBe('');
      expect(messageFormHelperText.props().error).toBe(false);

      const doneFormHelperText = wrapper.find(FormHelperText).at(1);
      expect(doneFormHelperText.text()).toBe('');
      expect(doneFormHelperText.props().error).toBe(false);
    }
  );

  it.each(invalidSchemaDataPairs)(
    'should not show error message for invalid property with validation mode NoValidation',
    ({ schema, data }) => {
      wrapper = mount(
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
          cells={materialCells}
          validationMode='NoValidation'
        />
      );
      const messageFormHelperText = wrapper.find(FormHelperText).at(0);
      expect(messageFormHelperText.text()).toBe('');
      expect(messageFormHelperText.props().error).toBe(false);

      const doneFormHelperText = wrapper.find(FormHelperText).at(1);
      expect(doneFormHelperText.text()).toBe('');
      expect(doneFormHelperText.props().error).toBe(false);
    }
  );

  it.each(validSchemaDataPairs)(
    'should not show error message for valid property',
    ({ schema, data }) => {
      wrapper = mount(
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
          cells={materialCells}
          validationMode='ValidateAndShow'
        />
      );
      const messageFormHelperText = wrapper.find(FormHelperText).at(0);
      expect(messageFormHelperText.text()).toBe('');
      expect(messageFormHelperText.props().error).toBe(false);

      const doneFormHelperText = wrapper.find(FormHelperText).at(1);
      expect(doneFormHelperText.text()).toBe('');
      expect(doneFormHelperText.props().error).toBe(false);
    }
  );
});
