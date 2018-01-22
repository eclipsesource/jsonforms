import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    alive: {
      type: 'boolean'
    },
    kindOfDead: {
      type: 'string',
      enum: ['Zombie', 'Vampire', 'Ghoul']
    }
  }
};

export const uischema = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: {
        $ref: '#/properties/name'
      }
    },
    {
      type: 'Control',
      label: 'Is Alive?',
      scope: {
        $ref: '#/properties/alive'
      }
    },
    {
      type: 'Control',
      label: 'Kind of dead',
      scope: {
        $ref: '#/properties/kindOfDead'
      },
      rule: {
        effect: 'SHOW',
        condition: {
          type: 'LEAF' ,
          scope: {
            $ref: '#/properties/alive'
          },
          expectedValue: false
        }
      }
    }
  ]
};

export const data = {
  name: 'John Doe',
  alive: true,
  kindOfDead: 'Zombie'
};

registerExamples([
  {
    name: 'rule',
    label: 'Rule',
    data,
    schema,
    uiSchema: uischema
  }
]);
