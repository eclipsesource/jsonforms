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
import { resolveSchema } from '../../src/util/resolvers';
import test from 'ava';

test('resolveSchema - resolves schema with any ', t => {
  const schema = {
    type: 'object',
    properties: {
      description: {
        oneOf: [{
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          }
        }, {
          type: 'object',
          properties: {
            index: {
              type: 'number'
            }
          }
        }, {
          type: 'object',
          properties: {
            exist: {
              type: 'boolean'
            }
          }
        }]
      }
    }
  };
  // test backward compatibility
  t.deepEqual(resolveSchema(schema, '#/properties/description/oneOf/0/properties/name'), {type: 'string'});
  t.deepEqual(resolveSchema(schema, '#/properties/description/oneOf/1/properties/index'), {type: 'number'});
  // new simple approach
  t.deepEqual(resolveSchema(schema, '#/properties/description/properties/name'), {type: 'string'});
  t.deepEqual(resolveSchema(schema, '#/properties/description/properties/index'), {type: 'number'});
  t.deepEqual(resolveSchema(schema, '#/properties/description/properties/exist'), {type: 'boolean'});
  t.is(resolveSchema(schema, '#/properties/description/properties/notfound'), undefined);
});