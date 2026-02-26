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
import { registerExamples } from '../register';
import { Translator } from '@jsonforms/core';
import get from 'lodash/get';

export const schema = {
  type: 'object',
  properties: {
    country: {
      type: 'string',
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
    },
    countryNoAutocomplete: {
      type: 'string',
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
    },
    status: {
      type: 'string',
      oneOf: [
        { const: 'pending', title: 'Pending' },
        { const: 'approved', title: 'Approved' },
        { const: 'rejected', title: 'Rejected' },
      ],
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Enum with i18n (Autocomplete)',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/country',
          label: 'Country (with autocomplete)',
        },
      ],
    },
    {
      type: 'Group',
      label: 'Enum with i18n (Dropdown)',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/countryNoAutocomplete',
          label: 'Country (dropdown)',
          options: {
            autocomplete: false,
          },
        },
      ],
    },
    {
      type: 'Group',
      label: 'OneOf Enum with i18n',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/status',
          label: 'Status',
        },
      ],
    },
  ],
};

export const data = {
  country: 'DE',
};

export const translations: Record<string, string> = {
  // Translations for country enum values
  // Key format: <property>.<enumValue>
  'country.DE': 'Germany',
  'country.IT': 'Italy',
  'country.JP': 'Japan',
  'country.US': 'United States',
  'country.RU': 'Russia',
  'country.Other': 'Other Country',
  // Same translations for the non-autocomplete version
  'countryNoAutocomplete.DE': 'Germany',
  'countryNoAutocomplete.IT': 'Italy',
  'countryNoAutocomplete.JP': 'Japan',
  'countryNoAutocomplete.US': 'United States',
  'countryNoAutocomplete.RU': 'Russia',
  'countryNoAutocomplete.Other': 'Other Country',
  // Translations for status oneOf enum
  'status.pending': 'Awaiting Review',
  'status.approved': 'Approved',
  'status.rejected': 'Declined',
};

export const translate: Translator = (
  key: string,
  defaultMessage: string | undefined
) => {
  return get(translations, key) ?? defaultMessage;
};

registerExamples([
  {
    name: 'enum-i18n',
    label: 'Enums (i18n)',
    data,
    schema,
    uischema,
    i18n: {
      translate: translate,
      locale: 'en',
    },
  },
]);
