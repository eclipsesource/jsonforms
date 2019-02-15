import { registerExamples } from './register';

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

const uischema2 = {
  type: 'Control',
  label: 'Value',
  scope: '#/properties/oneOrMoreThings'
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
    name: 'issue-1253-field',
    label: 'issue 1253 (oneOf) - missing field',
    data,
    schema: schema2,
    uischema: uischema2
  }
]);
