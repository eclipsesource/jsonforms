/*
  The MIT License

  Copyright (c) 2017-2026 EclipseSource Munich
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
import React from 'react';
import { act } from 'react-dom/test-utils';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { ControlElement, JsonSchema7 } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  materialCells,
  materialRenderers,
  MuiInputNumberFormat,
  useInputAdornments,
} from '../../src';

Enzyme.configure({ adapter: new Adapter() });

const adornments = { startAdornment: '€', endAdornment: 'kg' };

const renderControl = (
  property: JsonSchema7,
  options: Record<string, unknown>,
  data?: unknown,
  enabled = true
) => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/field',
    options,
  };
  return mount(
    <JsonForms
      schema={{ type: 'object', properties: { field: property } }}
      uischema={uischema}
      data={data === undefined ? {} : { field: data }}
      renderers={materialRenderers}
      cells={materialCells}
      readonly={!enabled}
    />
  );
};

const adornmentTexts = (wrapper: ReactWrapper, position: 'Start' | 'End') =>
  wrapper
    .find(`.MuiInputAdornment-position${position}`)
    .hostNodes()
    .map((node) => node.text())
    .filter((text) => text !== '');

const enumSchema: JsonSchema7 = { type: 'string', enum: ['110', '230'] };
const oneOfEnumSchema: JsonSchema7 = {
  oneOf: [
    { const: '110', title: '110' },
    { const: '230', title: '230' },
  ],
};

describe('Material input adornments', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  describe.each<[string, JsonSchema7, Record<string, unknown>]>([
    ['text', { type: 'string' }, {}],
    ['number', { type: 'number' }, {}],
    ['integer', { type: 'integer' }, {}],
    ['enum autocomplete', enumSchema, {}],
    ['enum select', enumSchema, { autocomplete: false }],
    ['oneOf enum autocomplete', oneOfEnumSchema, {}],
    ['oneOf enum select', oneOfEnumSchema, { autocomplete: false }],
    [
      'anyOf string or enum',
      { anyOf: [{ type: 'string' }, { enum: ['foo', 'bar'] }] },
      {},
    ],
  ])('%s control', (_name, property, options) => {
    it('renders the configured start and end adornment', () => {
      wrapper = renderControl(property, { ...options, ...adornments });
      expect(adornmentTexts(wrapper, 'Start')).toEqual(['€']);
      expect(adornmentTexts(wrapper, 'End')).toEqual(['kg']);
    });

    it('renders no adornment text without adornment options', () => {
      wrapper = renderControl(property, options);
      expect(adornmentTexts(wrapper, 'Start')).toEqual([]);
      expect(adornmentTexts(wrapper, 'End')).toEqual([]);
    });
  });

  it('renders adornments in the number format input', () => {
    wrapper = mount(
      <MuiInputNumberFormat
        id='field'
        path='field'
        data={1000}
        enabled
        isValid
        errors=''
        visible
        schema={{ type: 'number' }}
        rootSchema={{ type: 'number' }}
        uischema={{
          type: 'Control',
          scope: '#',
          options: adornments,
        }}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        handleChange={() => {}}
        toFormatted={(value: number) => value.toLocaleString('en-US')}
        fromFormatted={(value: string) => Number(value.replace(/,/g, ''))}
      />
    );
    expect(adornmentTexts(wrapper, 'Start')).toEqual(['€']);
    expect(adornmentTexts(wrapper, 'End')).toEqual(['kg']);
  });

  it('ignores adornment options that are not non-empty strings', () => {
    wrapper = renderControl(
      { type: 'string' },
      { startAdornment: 5, endAdornment: '' }
    );
    expect(adornmentTexts(wrapper, 'Start')).toEqual([]);
    expect(adornmentTexts(wrapper, 'End')).toEqual([]);
  });

  it('applies the given sx to the start and end adornment', () => {
    const AdornedInput = () => {
      const { startAdornment, endAdornment } = useInputAdornments(adornments, {
        startAdornmentSx: { ml: 1 },
        endAdornmentSx: { mr: 2 },
      });
      return (
        <OutlinedInput
          startAdornment={startAdornment}
          endAdornment={endAdornment}
        />
      );
    };
    wrapper = mount(<AdornedInput />);
    const sxByPosition = wrapper
      .find(InputAdornment)
      .map((adornment) => [adornment.props().position, adornment.props().sx]);
    expect(sxByPosition).toEqual([
      ['start', { ml: 1 }],
      ['end', { mr: 2 }],
    ]);
  });

  describe('label', () => {
    it('shrinks an empty field label when a start adornment is set', () => {
      wrapper = renderControl({ type: 'string' }, adornments);
      expect(wrapper.find('label').hasClass('MuiInputLabel-shrink')).toBe(true);
      expect(wrapper.find(OutlinedInput).props().notched).toBe(true);
    });

    it('keeps an empty field label unshrunk without a start adornment', () => {
      wrapper = renderControl({ type: 'string' }, { endAdornment: 'kg' });
      expect(wrapper.find('label').hasClass('MuiInputLabel-shrink')).toBe(
        false
      );
    });
  });

  describe('built-in end adornments', () => {
    it('keeps the autocomplete popup button next to the end adornment', () => {
      wrapper = renderControl(enumSchema, adornments);
      expect(
        wrapper.find('.MuiAutocomplete-popupIndicator').hostNodes()
      ).toHaveLength(1);
    });

    it('keeps the anyOf datalist next to the end adornment', () => {
      wrapper = renderControl(
        { anyOf: [{ type: 'string' }, { enum: ['foo', 'bar'] }] },
        adornments
      );
      expect(wrapper.find('datalist').children()).toHaveLength(2);
    });
  });

  describe('text clear button with an end adornment', () => {
    const clearButtonStyle = () =>
      wrapper
        .find('button[aria-label="Clear input field"]')
        .closest(InputAdornment)
        .props().style;

    const hover = () => {
      // call onPointerEnter prop manually as the tests seem to ignore 'pointerenter' events
      act(() => {
        wrapper.find(OutlinedInput).props().onPointerEnter?.call(this);
      });
      wrapper.update();
    };

    it('reserves space for the hidden clear button instead of overlaying', () => {
      wrapper = renderControl({ type: 'string' }, adornments, 'foo');
      expect(clearButtonStyle()).not.toHaveProperty('position', 'absolute');
      expect(clearButtonStyle()).toHaveProperty('visibility', 'hidden');
    });

    it('shows the clear button on hover', () => {
      wrapper = renderControl({ type: 'string' }, adornments, 'foo');
      hover();
      expect(clearButtonStyle()).toHaveProperty('visibility', 'visible');
    });

    it('reserves no space for the clear button when disabled', () => {
      wrapper = renderControl({ type: 'string' }, adornments, 'foo', false);
      expect(clearButtonStyle()).toHaveProperty('display', 'none');
    });
  });
});
