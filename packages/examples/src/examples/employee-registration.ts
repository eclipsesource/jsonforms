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

export const schema = {
  type: 'object',
  description:
    'Demonstrates deeply nested vertical, horizontal, and group layouts with conditional visibility',
  properties: {
    showPersonalInfo: {
      type: 'boolean',
      default: true,
    },
    showAddress: {
      type: 'boolean',
      default: true,
    },
    showEmployment: {
      type: 'boolean',
      default: true,
    },
    showEmergencyContact: {
      type: 'boolean',
      default: true,
    },
    showBenefits: {
      type: 'boolean',
      default: true,
    },
    person: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
        },
        middleName: {
          type: 'string',
          title: 'Middle Name',
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
        },
        dateOfBirth: {
          type: 'string',
          format: 'date',
          title: 'Date of Birth',
        },
        email: {
          type: 'string',
          format: 'email',
          title: 'Email',
        },
        phone: {
          type: 'string',
          title: 'Phone Number',
        },
        showIdDetails: {
          type: 'boolean',
          title: 'Include ID Details',
          default: true,
        },
        showSsn: {
          type: 'boolean',
          title: 'Include SSN',
          default: true,
        },
        showDriversLicense: {
          type: 'boolean',
          title: "Include Driver's License",
          default: true,
        },
        ssn: {
          type: 'string',
          title: 'Social Security Number',
        },
        driversLicense: {
          type: 'string',
          title: "Driver's License",
        },
      },
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
          title: 'Street Address',
        },
        apartment: {
          type: 'string',
          title: 'Apt/Suite',
        },
        city: {
          type: 'string',
          title: 'City',
        },
        state: {
          type: 'string',
          title: 'State',
        },
        zipCode: {
          type: 'string',
          title: 'ZIP Code',
        },
        country: {
          type: 'string',
          title: 'Country',
          default: 'USA',
        },
      },
    },
    employment: {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          title: 'Department',
          enum: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
        },
        position: {
          type: 'string',
          title: 'Position',
        },
        startDate: {
          type: 'string',
          format: 'date',
          title: 'Start Date',
        },
        employmentType: {
          type: 'string',
          title: 'Employment Type',
          enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
        },
        salary: {
          type: 'number',
          title: 'Annual Salary',
        },
        showManagerInfo: {
          type: 'boolean',
          title: 'Assign Manager',
          default: true,
        },
        managerName: {
          type: 'string',
          title: 'Manager Name',
        },
        managerEmail: {
          type: 'string',
          format: 'email',
          title: 'Manager Email',
        },
      },
    },
    emergencyContact: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Contact Name',
        },
        relationship: {
          type: 'string',
          title: 'Relationship',
        },
        primaryPhone: {
          type: 'string',
          title: 'Primary Phone',
        },
        showSecondaryContact: {
          type: 'boolean',
          title: 'Add Secondary Phone',
          default: false,
        },
        secondaryPhone: {
          type: 'string',
          title: 'Secondary Phone',
        },
        address: {
          type: 'string',
          title: 'Address',
        },
      },
    },
    benefits: {
      type: 'object',
      properties: {
        healthInsurance: {
          type: 'boolean',
          title: 'Health Insurance',
        },
        dentalInsurance: {
          type: 'boolean',
          title: 'Dental Insurance',
        },
        visionInsurance: {
          type: 'boolean',
          title: 'Vision Insurance',
        },
        show401k: {
          type: 'boolean',
          title: 'Enroll in 401(k)',
          default: false,
        },
        contribution401k: {
          type: 'number',
          title: '401(k) Contribution %',
          minimum: 0,
          maximum: 100,
        },
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/showPersonalInfo',
          label: 'Show Personal Info',
        },
        {
          type: 'Control',
          scope: '#/properties/showAddress',
          label: 'Show Address',
        },
        {
          type: 'Control',
          scope: '#/properties/showEmployment',
          label: 'Show Employment',
        },
        {
          type: 'Control',
          scope: '#/properties/showEmergencyContact',
          label: 'Show Emergency Contact',
        },
        {
          type: 'Control',
          scope: '#/properties/showBenefits',
          label: 'Show Benefits',
        },
      ],
    },
    {
      type: 'Group',
      label: 'Personal Information',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/showPersonalInfo',
          schema: { const: true },
        },
      },
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/person/properties/firstName',
            },
            {
              type: 'Control',
              scope: '#/properties/person/properties/middleName',
            },
            {
              type: 'Control',
              scope: '#/properties/person/properties/lastName',
            },
          ],
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/person/properties/dateOfBirth',
                },
                {
                  type: 'Control',
                  scope: '#/properties/person/properties/email',
                },
                {
                  type: 'Control',
                  scope: '#/properties/person/properties/phone',
                },
              ],
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/person/properties/showIdDetails',
                },
                {
                  type: 'Control',
                  scope: '#/properties/person/properties/showSsn',
                },
                {
                  type: 'Control',
                  scope: '#/properties/person/properties/showDriversLicense',
                },
              ],
            },
            {
              type: 'HorizontalLayout',
              rule: {
                effect: 'SHOW',
                condition: {
                  scope: '#/properties/person/properties/showIdDetails',
                  schema: { const: true },
                },
              },
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/person/properties/ssn',
                  rule: {
                    effect: 'SHOW',
                    condition: {
                      scope: '#/properties/person/properties/showSsn',
                      schema: { const: true },
                    },
                  },
                },
                {
                  type: 'Control',
                  scope: '#/properties/person/properties/driversLicense',
                  rule: {
                    effect: 'SHOW',
                    condition: {
                      scope:
                        '#/properties/person/properties/showDriversLicense',
                      schema: { const: true },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'VerticalLayout',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/showAddress',
          schema: { const: true },
        },
      },
      elements: [
        {
          type: 'Group',
          label: 'Address',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/address/properties/street',
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/address/properties/apartment',
                },
                {
                  type: 'Control',
                  scope: '#/properties/address/properties/city',
                },
              ],
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/address/properties/state',
                },
                {
                  type: 'Control',
                  scope: '#/properties/address/properties/zipCode',
                },
                {
                  type: 'Control',
                  scope: '#/properties/address/properties/country',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/showEmployment',
          schema: { const: true },
        },
      },
      elements: [
        {
          type: 'Group',
          label: 'Employment Details',
          elements: [
            {
              type: 'VerticalLayout',
              elements: [
                {
                  type: 'HorizontalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/employment/properties/department',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/employment/properties/position',
                    },
                  ],
                },
                {
                  type: 'HorizontalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/employment/properties/startDate',
                    },
                    {
                      type: 'Control',
                      scope:
                        '#/properties/employment/properties/employmentType',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/employment/properties/salary',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Group',
              label: 'Manager Information',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/employment/properties/showManagerInfo',
                },
                {
                  type: 'VerticalLayout',
                  rule: {
                    effect: 'SHOW',
                    condition: {
                      scope:
                        '#/properties/employment/properties/showManagerInfo',
                      schema: { const: true },
                    },
                  },
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/employment/properties/managerName',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/employment/properties/managerEmail',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'Group',
      label: 'Emergency Contact',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/showEmergencyContact',
          schema: { const: true },
        },
      },
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'VerticalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/emergencyContact/properties/name',
                },
                {
                  type: 'Control',
                  scope:
                    '#/properties/emergencyContact/properties/relationship',
                },
              ],
            },
            {
              type: 'Group',
              label: 'Contact Numbers',
              elements: [
                {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope:
                        '#/properties/emergencyContact/properties/primaryPhone',
                    },
                    {
                      type: 'Control',
                      scope:
                        '#/properties/emergencyContact/properties/showSecondaryContact',
                    },
                    {
                      type: 'Control',
                      scope:
                        '#/properties/emergencyContact/properties/secondaryPhone',
                      rule: {
                        effect: 'SHOW',
                        condition: {
                          scope:
                            '#/properties/emergencyContact/properties/showSecondaryContact',
                          schema: { const: true },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'Control',
          scope: '#/properties/emergencyContact/properties/address',
        },
      ],
    },
    {
      type: 'VerticalLayout',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/showBenefits',
          schema: { const: true },
        },
      },
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Group',
              label: 'Insurance Options',
              elements: [
                {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/benefits/properties/healthInsurance',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/benefits/properties/dentalInsurance',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/benefits/properties/visionInsurance',
                    },
                  ],
                },
              ],
            },
            {
              type: 'Group',
              label: 'Retirement',
              elements: [
                {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/benefits/properties/show401k',
                    },
                    {
                      type: 'Control',
                      scope:
                        '#/properties/benefits/properties/contribution401k',
                      rule: {
                        effect: 'SHOW',
                        condition: {
                          scope: '#/properties/benefits/properties/show401k',
                          schema: { const: true },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const data = {
  showPersonalInfo: true,
  showAddress: true,
  showEmployment: true,
  showEmergencyContact: true,
  showBenefits: true,
  person: {
    showIdDetails: true,
    showSsn: true,
    showDriversLicense: true,
  },
  employment: {
    showManagerInfo: true,
  },
  emergencyContact: {
    showSecondaryContact: true,
  },
  benefits: {
    show401k: true,
  },
};

registerExamples([
  {
    name: 'employee-registration',
    label: 'Employee Registration',
    data,
    schema,
    uischema,
  },
]);
