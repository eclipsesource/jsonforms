export const labelProvider = {
  '#root': 'label',
  '#elements': '',
  '#horizontallayout': '',
  '#verticallayout': '',
  '#categorization': '',
  '#control': 'label',
  '#category': 'label',
  '#group': 'label',
  '#rule': '',
  '#scope': '',
  '#labelObject': '',
  '#options': '',
};

export const imageProvider = {
  '#root': 'task',
  '#elements': 'task',
  '#categorization': 'task',
  '#control': 'task',
  '#category': 'task',
  '#group': 'task',
  '#rule': 'task',
  '#scope': 'task',
  '#labelObject': 'task',
  '#options': 'task',
  '#horizontallayout': 'task',
  '#verticallayout': 'task',
};

export const modelMapping = {
  'attribute': 'type',
  'mapping': {
    'root': '#root',
    'elements': '#elements',
    'horizontallayout': '#horizontallayout',
    'verticallayout': '#verticallayout',
    'categorization': '#categorization',
    'control': '#control',
    'category': '#category',
    'group': '#group',
    'rule': '#rule',
    'scope': '#scope',
    'labelObject': '#labelObject',
    'options': '#options'
  }
};

export const detailSchemata = {};

export const importedUISchemaModel = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name',
          label: 'Name'
        },
        {
          type: 'Control',
          label: 'Birthday',
          scope: '#/properties/birthday'
        }
      ]
    }
  ]
};
