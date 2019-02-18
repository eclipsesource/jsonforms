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
    name: 'issue-1253-field-missing-field',
    label: 'issue 1253 (oneOf) - missing field renderer',
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
