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

import type { JsonSchema4 } from '../models';

const ADDITIONAL_PROPERTIES = 'additionalProperties';
const REQUIRED_PROPERTIES = 'required';

type Properties = { [property: string]: JsonSchema4 };

const distinct = (
  properties: any[],
  discriminator: (item: any) => string
): JsonSchema4[] => {
  const known: { [property: string]: boolean } = {};

  return properties.filter((item) => {
    const discriminatorValue = discriminator(item);
    if (Object.prototype.hasOwnProperty.call(known, discriminatorValue)) {
      return false;
    } else {
      known[discriminatorValue] = true;
      return true;
    }
  });
};

class Gen {
  constructor(
    private findOption: (props: Properties) => (optionName: string) => any
  ) {}

  // TODO fix @typescript-eslint/ban-types
  // eslint-disable-next-line @typescript-eslint/ban-types
  schemaObject = (data: Object): JsonSchema4 => {
    const props: Properties = this.properties(data);
    const schema: JsonSchema4 = {
      type: 'object',
      properties: props,
      additionalProperties: this.findOption(props)(ADDITIONAL_PROPERTIES),
    };
    const required = this.findOption(props)(REQUIRED_PROPERTIES);
    if (required.length > 0) {
      schema.required = required;
    }

    return schema;
  };

  properties = (data: any): Properties => {
    const emptyProps: Properties = {};

    return Object.keys(data).reduce((acc: Properties, propName: string) => {
      acc[propName] = this.property(data[propName]);

      return acc;
    }, emptyProps);
  };

  property = (data: any): JsonSchema4 => {
    switch (typeof data) {
      case 'string':
        return { type: 'string' };
      case 'boolean':
        return { type: 'boolean' };
      case 'number':
        if (Number.isInteger(data)) {
          return { type: 'integer' };
        }

        return { type: 'number' };
      case 'object':
        if (data == null) {
          return { type: 'null' };
        }

        return this.schemaObjectOrArray(data);
      default:
        return {};
    }
  };

  schemaObjectOrArray = (data: any): JsonSchema4 => {
    if (data instanceof Array) {
      return this.schemaArray(data as any[]);
    } else {
      return this.schemaObject(data);
    }
  };

  schemaArray = (data: any[]): JsonSchema4 => {
    if (data.length > 0) {
      const allProperties: JsonSchema4[] = data.map(this.property);
      const uniqueProperties = distinct(allProperties, (prop) =>
        JSON.stringify(prop)
      );
      if (uniqueProperties.length === 1) {
        return {
          type: 'array',
          items: uniqueProperties[0],
        };
      } else {
        return {
          type: 'array',
          items: {
            oneOf: uniqueProperties,
          },
        };
      }
    } else {
      return {
        type: 'array',
        items: {},
      };
    }
  };
}

/**
 * Generate a JSON schema based on the given data and any additional options.
 * @param {Object} instance the data to create a JSON schema for
 * @param {any} options any additional options that may alter the generated JSON schema
 * @returns {JsonSchema} the generated schema
 */
export const generateJsonSchema = (
  // TODO fix @typescript-eslint/ban-types
  // eslint-disable-next-line @typescript-eslint/ban-types
  instance: Object,
  options: any = {}
): JsonSchema4 => {
  const findOption =
    (props: Properties) =>
    (optionName: string): boolean | string[] => {
      switch (optionName) {
        case ADDITIONAL_PROPERTIES:
          if (
            Object.prototype.hasOwnProperty.call(options, ADDITIONAL_PROPERTIES)
          ) {
            return options[ADDITIONAL_PROPERTIES];
          }

          return true;
        case REQUIRED_PROPERTIES:
          if (
            Object.prototype.hasOwnProperty.call(options, REQUIRED_PROPERTIES)
          ) {
            return options[REQUIRED_PROPERTIES](props);
          }

          return Object.keys(props);
        default:
          return;
      }
    };

  const gen = new Gen(findOption);

  return gen.schemaObject(instance);
};
