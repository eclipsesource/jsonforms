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
import { registerExamples } from './register';

export const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "targetType",
    "targetMap",
    "alerts"
  ],
  "properties": {
    "targetType": {
      "type": "string"
    },
    "targetMap": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "action"
        ],
        "properties": {
          "name": {
            "type": "string",
            "pattern": "^(.*)$"
          },
          "value": {
            "type": "string",
            "default": "",
            "pattern": "^(.*)$"
          },
          "action": {
            "type": "object",
            "required": [
              "operator"
            ],
            "properties": {
              "operator": {
                "type": "string",
                "enum": [
                  "equals",
                  "equalsIgnoreCase",
                  "stepInto"
                ]
              },
              "operatorParameters": {
                "type": "array",
                "items": {
                  "$ref": "#/properties/targetMap/items"
                }
              }
            }
          }
        }
      }
    },
    "alerts": {
      "type": "array",
      "items": {
        "required": [
          "type",
          "parameters"
        ],
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "webhook",
              "email"
            ]
          },
          "parameters": {
            "type": "object"
          },
          "payload": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "type",
                "value"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "sourceField"
                  ]
                },
                "value": {
                  "type": "string",
                  "pattern": "^(.*)$"
                }
              }
            }
          }
        }
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
    name: 'issue-1491',
    label: 'Issue 1491',
    data,
    schema,
    uischema: undefined
  }
]);
