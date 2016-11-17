export default angular.module('jsonforms-examples.masterdetail', [])
  .value('masterdetail.schema-array',
    {
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
    }
  )
  .value('masterdetail.schema-object',
    {
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
    }
  )
  .value('masterdetail.uischema',
    {
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
          '#folder_array': 'assets/masterdetail-icons/folder.png',
          '#file_array': 'assets/masterdetail-icons/page.png',
          '#drive_array': 'assets/masterdetail-icons/drive.png',
          '#folder_object': 'assets/masterdetail-icons/folder.png',
          '#file_object': 'assets/masterdetail-icons/page.png',
          '#drive_object': 'assets/masterdetail-icons/drive.png'
        }
      }
    }
  )
  .value('masterdetail.data-array',
    [
      {
        'name': 'c',
        'folders':
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
        'files':
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
        'name': 'd',
        'folders':
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
        'files':
        [
          {
            name: 'i',
          },
          {
            name: 'k',
          }
        ]
      }
    ]
  )
  .value('masterdetail.data-object',
    {
      'name': 'c',
      'folders':
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
      'files':
      [
        {
          name: 'x',
        },
        {
          name: 'y',
        }
      ]
    }
  )
.name;
