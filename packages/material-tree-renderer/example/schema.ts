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
export const taskSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  properties: {
    _type: {
      type: 'string',
      default: 'userGroup'
    },
    label: {
      type: 'string'
    },
    users: {
      type: 'array',
      items: {
        $ref: '#/definitions/user'
      }
    }
  },
  additionalProperties: false,
  definitions: {
    task: {
      type: 'object',
      properties: {
        _type: {
          type: 'string',
          default: 'task'
        },
        name: {
          type: 'string'
        },
        dueDate: {
          type: 'string',
          format: 'date'
        },
        done: {
          type: 'boolean'
        },
        priority: {
          type: 'string',
          enum: ['High', 'Medium', 'Low'],
          default: 'Medium'
        },
        subTasks: {
          type: 'array',
          items: {
            $ref: '#/definitions/task'
          }
        }
      },
      required: ['name', 'priority'],
      additionalProperties: false
    },
    user: {
      type: 'object',
      properties: {
        _type: {
          type: 'string',
          default: 'user'
        },
        name: {
          type: 'string'
        },
        birthday: {
          type: 'string',
          format: 'date'
        },
        nationality: {
          type: 'string',
          enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        },
        tasks: {
          type: 'array',
          items: {
            $ref: '#/definitions/task'
          }
        }
      },
      required: ['name'],
      additionalProperties: false
    }
  }
};
