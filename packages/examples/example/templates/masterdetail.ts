import { registerExamples } from '../example';
const schemaArray = {
  'definitions': {
    'folder': {
      'type': 'object',
      'id': '#folder_array',
      'properties': {
        'name': {
          'type': 'string',
          'minLength': 3
        },
        'folders': {
          'type': 'array',
          'items':
          {
            // TODO make recursive
            '$ref': '#/definitions/file'
          }
        },
        'files': {
          'type': 'array',
          'items':
          {
            '$ref': '#/definitions/file'
          }
        }
      },
      'required': ['name']
    },
    'file': {
      'type': 'object',
      'id': '#file_array',
      'properties': {
        'name': {
          'type': 'string',
          'minLength': 3
        }
      },
      'required': ['name']
    },
    'drive': {
      'type': 'object',
      'id': '#drive_array',
      'properties': {
        'name': {
          'type': 'string',
          'minLength': 3
        },
        'folders': {
          'type': 'array',
          'items':
          {
            '$ref': '#/definitions/folder'
          }
        },
        'files': {
          'type': 'array',
          'items':
          {
            '$ref': '#/definitions/file'
          }
        }
      },
      'required': ['name']
    }
  },
  'type': 'array',
  'id': 'drives#',
  'items':
  {
    '$ref': '#/definitions/drive'
  }
};
const schemaObject = {
  'definitions': {
    'folder': {
      'type': 'object',
      'id': '#folder_object',
      'properties': {
        'name': {
          'type': 'string',
          'minLength': 3
        },
        'folders': {
          'type': 'array',
          'items':
          {
            // TODO make recursive
            '$ref': '#/definitions/folder'
          }
        },
        'files': {
          'type': 'array',
          'items':
          {
            '$ref': '#/definitions/file'
          }
        }
      },
      'required': ['name']
    },
    'file': {
      'type': 'object',
      'id': '#file_object',
      'properties': {
        'name': {
          'type': 'string',
          'minLength': 3
        }
      },
      'required': ['name']
    }
  },
  'type': 'object',
  'id': '#drive_object',
  'properties': {
    'name': {
      'type': 'string',
      'minLength': 3
    },
    'folders': {
      'type': 'array',
      'items':
      {
        '$ref': '#/definitions/folder'
      }
    },
    'files': {
      'type': 'array',
      'items':
      {
        '$ref': '#/definitions/file'
      }
    }
  },
  'required': ['name']
};
const uischema = {
  'type': 'MasterDetailLayout',
  'scope': {
    '$ref': '#'
  },
  'options': {
    'labelProvider': {
      '#drive_array': 'name',
      '#folder_array': 'name',
      '#file_array': 'name',
      '#drive_object': 'name',
      '#folder_object': 'name',
      '#file_object': 'name'
    },
    'imageProvider': {
      '#folder_array': 'folder',
      '#file_array': 'page',
      '#drive_array': 'drive',
      '#folder_object': 'folder',
      '#file_object': 'page',
      '#drive_object': 'drive'
    }
  }
};
const dataArray = [
  {
    name: 'c',
    folders:
    [
      {
        name: 'a',
        folders: [
          {
            name: 'aa'
          },
          {
            name: 'ab'
          }
        ]
      },
      {
        name: 'b'
      }
    ],
    files:
    [
      {
          name: 'x',
      },
      {
          name: 'y',
      }
    ]
  },
  {
    name: 'd',
    folders:
    [
      {
        name: 'o',
        folders: [
          {
            name: 'oo'
          },
          {
            name: 'op'
          }
        ]
      },
      {
        name: 'p'
      }
    ],
    files:
    [
      {
        name: 'i',
      },
      {
        name: 'k',
      }
    ]
  }
];
const dataObject = {
  name: 'c',
  folders:
  [
    {
      name: 'a',
      folders: [
        {
          name: 'aa'
        },
        {
          name: 'ab'
        }
      ]
    },
    {
      name: 'b'
    }
  ],
  files:
  [
    {
      name: 'x',
    },
    {
      name: 'y',
    }
  ]
};
registerExamples([
  {name: 'masterdetail_object', label: 'Master Detail Object Root', data: dataObject,
    schema: schemaObject, uiSchema: uischema},
  {name: 'masterdetail_array', label: 'Master Detail Array Root', data: dataArray,
    schema: schemaArray, uiSchema: uischema}
]);
