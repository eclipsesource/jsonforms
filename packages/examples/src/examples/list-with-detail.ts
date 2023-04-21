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
import { registerExamples } from '../register';

export const data = {
  orders: [
    {
      customer: {
        id: '471201',
        name: 'Sirius Cybernetics Corporation',
        department: 'Complaints Division',
      },
      title: '42 killer robots',
      ordered: true,
      processId: '1890004498',
      assignee: 'Philip J. Fry',
      status: 'ordered',
      startDate: '2018-06-01',
      endDate: '2018-08-01',
    },
    {
      customer: {
        id: '471202',
        name: 'Very Big Corporation of America',
      },
      title: '1000 gallons of MomCorp Oil',
      processId: '1890004499',
      assignee: 'Jen Barber',
      startDate: '2018-07-01',
      status: 'planned',
    },
  ],
};

export const schema = {
  definitions: {
    order: {
      type: 'object',
      properties: {
        customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', format: 'email' },
            department: { type: 'string' },
          },
        },
        title: {
          type: 'string',
          minLength: 5,
          title: 'Official Title',
        },
        ordered: { type: 'boolean' },
        processId: {
          type: 'number',
          minimum: 0,
        },
        assignee: { type: 'string' },
        startDate: {
          type: 'string',
          format: 'date',
        },
        endDate: {
          type: 'string',
          format: 'date',
        },
        status: {
          type: 'string',
          enum: ['unordered', 'planned', 'ordered'],
        },
      },
      required: ['title'],
    },
  },
  type: 'object',
  properties: {
    orders: {
      type: 'array',
      items: {
        $ref: '#/definitions/order',
      },
    },
  },
};

export const uischema = {
  type: 'ListWithDetail',
  scope: '#/properties/orders',
  options: {
    labelRef: '#/items/properties/customer/properties/name',
    detail: {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/title',
            },
            {
              type: 'Control',
              scope: '#/properties/processId',
            },
          ],
        },
        {
          type: 'Group',
          label: 'Customer',
          elements: [
            {
              type: 'Control',
              label: 'ID',
              scope: '#/properties/customer/properties/id',
            },
            {
              type: 'Control',
              label: 'Name',
              scope: '#/properties/customer/properties/name',
            },
            {
              type: 'Control',
              label: 'Department',
              scope: '#/properties/customer/properties/department',
            },
          ],
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'VerticalLayout',
              elements: [
                {
                  type: 'HorizontalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/ordered',
                      options: {
                        toggle: true,
                      },
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/assignee',
                    },
                  ],
                },
                {
                  type: 'HorizontalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/startDate',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/endDate',
                    },
                  ],
                },
                {
                  type: 'Control',
                  scope: '#/properties/status',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

export const uischemaNoLabelRef = {
  type: 'ListWithDetail',
  scope: '#/properties/orders',
  options: {
    detail: {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/title',
            },
            {
              type: 'Control',
              scope: '#/properties/processId',
            },
          ],
        },
        {
          type: 'Group',
          label: 'Customer',
          elements: [
            {
              type: 'Control',
              label: 'ID',
              scope: '#/properties/customer/properties/id',
            },
            {
              type: 'Control',
              label: 'Name',
              scope: '#/properties/customer/properties/name',
            },
            {
              type: 'Control',
              label: 'Department',
              scope: '#/properties/customer/properties/department',
            },
          ],
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'VerticalLayout',
              elements: [
                {
                  type: 'HorizontalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/ordered',
                      options: {
                        toggle: true,
                      },
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/assignee',
                    },
                  ],
                },
                {
                  type: 'HorizontalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/startDate',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/endDate',
                    },
                  ],
                },
                {
                  type: 'Control',
                  scope: '#/properties/status',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

registerExamples([
  {
    name: 'list-with-detail',
    label: 'List With Detail',
    data,
    schema,
    uischema,
  },
]);

registerExamples([
  {
    name: 'list-with-detail-no-labelref',
    label: 'List With Detail (No Label Ref)',
    data,
    schema,
    uischema: uischemaNoLabelRef,
  },
]);
