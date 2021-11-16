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

export const schema = {
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

export const uischema = {
  type: 'Control',
  label: 'Value',
  scope: '#/properties/value'
};

const data = {};

const schema2 = {
  type: 'object',
  properties: {
    oneOrMoreThings: {
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

const schema3 = {
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

const uischema2 = {
  type: 'Control',
  label: 'Value',
  scope: '#/properties/oneOrMoreThings'
};

const uischema3 = {
  type: 'Control',
  label: 'Value',
  scope: '#/properties/thingOrThings'
};

const schema4 = {
  definitions: {
    color: {
      type: 'string',
      enum: ['red', 'green', 'blue']
    }
  },
  type: 'object',
  properties: {
    things: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          somethingElse: {
            type: 'string'
          },
          thing: {
            type: 'string',
            enum: ['thing']
          },
          anotherThing: {
            $ref: '#/definitions/color'
          }
        }
      }
    }
  }
};

const uischema4 = {
  type: 'Control',
  scope: '#/properties/things'
};

registerExamples([
  {
    name: 'issue-1253',
    label: 'issue 1253 (oneOf)',
    data,
    schema,
    uischema
  }
]);

registerExamples([
  {
    name: 'issue-1253-wrong-path-binding',
    label: 'issue 1253 (oneOf) - wrong path binding',
    data,
    schema: schema,
    uischema: uischema
  }
]);

registerExamples([
  {
    name: 'issue-1253-cell-missing-cell',
    label: 'issue 1253 (oneOf) - missing cell renderer',
    data,
    schema: schema2,
    uischema: uischema2
  }
]);

registerExamples([
  {
    name: 'issue-1253-add-button-empty-row',
    label: 'issue 1253 (oneOf) - add button does nothing',
    data,
    schema: schema3,
    uischema: uischema3
  }
]);

registerExamples([
  {
    name: 'issue-1253-enum-error',
    label: 'issue 1253 (enum)',
    data,
    schema: schema4,
    uischema: uischema4
  }
]);
