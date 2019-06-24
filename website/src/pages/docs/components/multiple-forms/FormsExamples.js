import React from 'react';
import _ from 'lodash';
import {Provider} from 'react-redux';
import {JsonForms} from '@jsonforms/react';
import {person} from '@jsonforms/examples';
import {Demo} from '../../../../components/common';
import {createJsonFormsStore} from "../../../../common/store";
import { materialRenderers } from '@jsonforms/material-renderers';

export const schema = {
  type: "object",
  properties: {
    person: {
      title: "Person",
      type: "object",
      properties: {
        firstName: {
          type: "string"
        },
        lastName: {
          type: "string"
        },
        age: {
          description: "Age in years",
          type: "integer",
          minimum: 0
        },
        shippingAddress: {
          $ref: "#/properties/address/properties/addressId"
        }
      },
      required: ["firstName", "lastName"]
    },
    address: {
      title: "Order",
      type: "object",
      properties: {
        addressId: {
          type: "string",
          label: "Address Type",
          enum: [
            "Home Address 1",
            "Home Address 2",
            "Workplace",
          ]
        },
        street: {
          type: "string",
        },
        city: {
          type: "string"
        },
        zipCode: {
          type: "string"
        }
      }
    }
  }
};

export const uischema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Group",
      label: "Person",
      elements: [
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/person/properties/firstName"
            },
            {
              type: "Control",
              scope: "#/properties/person/properties/lastName"
            }
          ]
        },
        {
          type: "HorizontalLayout",
          elements: [{
            type: "Control",
            scope: "#/properties/person/properties/age"
          },
            {
              type: "Control",
              label: "Address",
              scope: "#/properties/person/properties/shippingAddress"
            }
          ]
        }
      ]
    },
    {
      type: "Group",
      label: "Address",
      elements: [
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/person/properties/shippingAddress"
            },
            {
              type: "Control",
              scope: "#/properties/address/properties/street"
            }
          ]
        },
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/address/properties/city"
            },
            {
              type: "Control",
              scope: "#/properties/address/properties/zipCode"
            }
          ]
        }
      ]
    }
  ]
};

const clonedPersonSchema = _.cloneDeep(schema.properties.person);
clonedPersonSchema.properties.shippingAddress = { type: "string" };

export const schemas = {
  person: clonedPersonSchema,
  address: schema.properties.address
};

export const uischemas = {
  person: {
    type: "Group",
    label: "Person",
    elements: [
      {
        type: "HorizontalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/firstName"
          },
          {
            type: "Control",
            scope: "#/properties/lastName"
          }
        ]
      },
      {
        type: "HorizontalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/age"
          },
          {
            type: "Control",
            scope: "#/properties/shippingAddress"
          }
        ]
      }
    ]
  },
  address: {
    type: "Group",
    label: "Address",
    elements: [
      {
        type: "HorizontalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/addressId"
          },
          {
            type: "Control",
            scope: "#/properties/street"
          },
        ]
      },
      {
        type: "HorizontalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/city"
          },
          {
            type: "Control",
            scope: "#/properties/zipCode"
          }
        ]
      }
    ]
  }
};


//const store = createJsonFormsStore({
//  data: person.data,
//  schema: person.personCoreSchema,
//  uischema: person.uischema
//});

const pdata = {};
const pschema = _.cloneDeep(schema);
const puischema = _.cloneDeep(uischema);

const linkedFormsStore = createJsonFormsStore({
  data: pdata,
  schema: pschema,
  uischema: puischema
});

const store = createJsonFormsStore({
  data: person.data,
  schema: person.personCoreSchema,
  uischema: person.uischema
});

export const LinkedForms = () => (
  <Provider store={linkedFormsStore}>
    <Demo
      js={() => (
        <JsonForms schema={pschema}
                   uischema={puischema}
        />
      )}
      schema={pschema}
      uischema={puischema}
    />
    </Provider>
)

export const MultipleForms = () => (
  <Provider store={store}>
    <Demo
      js={() => (
        <div>
          <JsonForms
            schema={schemas.person}
            uischema={uischemas.person}
            renderers={materialRenderers}
          />
          <JsonForms
            schema={schemas.address}
            uischema={uischemas.address}
            renderers={materialRenderers}
          />
        </div>
      )}
      schema={schemas}
      uischema={uischemas}
    />
  </Provider>
);
