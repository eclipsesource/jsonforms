import { registerExamples } from './register';

export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    fileOrFolder: {
      title: 'fileOrFolder',
      oneOf: [{ $ref: '#/definitions/file' }, { $ref: '#/definitions/folder' }]
    },
    file: {
      title: 'File',
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    },
    folder: {
      type: 'object',
      title: 'Folder',
      properties: {
        name: { type: 'string' },
        children: {
          type: 'array',
          items: {
            $ref: '#/definitions/fileOrFolder'
          }
        }
      }
    }
  },
  type: 'object',
  properties: {
    root: {
      type: 'array',
      items: {
        $ref: '#/definitions/folder'
      }
    }
  }
};

export const uischema = {
  type: 'Control',
  scope: '#'
};

const data = {};

registerExamples([
  {
    name: 'oneOf-recursive',
    label: 'oneOf recursive',
    data,
    schema,
    uischema
  }
]);
