import React, { useState } from 'react';
import { Demo } from '../common/Demo';

import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';


export const plainEnumInput = {
  schema: {
  type: 'object',
  properties: {
    plainEnum: {
      type: 'string',
      enum: ['foo', 'bar', 'foobar']
    }
  }
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/plainEnum'
      }
    ]
  },
  data: {plainEnum:'foo'},
};

export const radioGroup = {
  schema: {
  type: 'object',
  properties: {
    radioGroup: {
      type: 'string',
      enum: ['foo', 'bar', 'foobar']
    }
  }
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/radioGroup',
        options: {
          format: "radio"
        }
      }
    ]
  },
  data: {},
};

export const autocompleteEnum = {
  schema: {
  type: 'object',
  properties: {
    autocompleteEnum: {
      type: 'string',
      enum: ['foo', 'bar', 'foobar']
    }
  }
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/autocompleteEnum',
        options: {
          autocomplete: true
        }
      }
    ]
  },
  data: {},
};

export const autocompleteOneOf = {
  schema: {
  type: 'object',
  properties: {
    autocompleteOneOf: {
      type: 'string',
      oneOf: [
        {const: 'foo', title: 'Foo'},
        {const: 'bar', title: 'Bar'},
        {const: 'foobar', title: 'FooBar'}
      ]
    }
  }
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/autocompleteOneOf',
        options: {
          autocomplete: true
        }
      }
    ]
  },
  data: {},
};

export const multiEnumInput = {
  schema: {
  type: 'object',
  properties: {
    multiEnum: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['foo', 'bar', 'foobar']
      }
    }
  }
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/multiEnum'
      }
    ]
  },
  data: {},
};

export const oneOfMultiEnum = {
  schema: {
  type: 'object',
  properties: {
    oneOfMultiEnum: {
      type: 'array',
      uniqueItems: true,
      items: {
        oneOf: [
          { const: 'foo', title: 'My Foo' },
          { const: 'bar', title: 'My Bar' },
          { const: 'foobar', title: 'My FooBar' }
        ]
      }
    },
  }
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/oneOfMultiEnum'
      },
    ]
  },
  data: {
  },
};


export const oneOfEnum = {
  schema: {
  type: 'object',
  properties: {
    oneOfEnum: {
      type: "string",
      oneOf: [
        {
          const: "foo",
          title: "Foo"
        },
        {
          const: "bar",
          title: "Bar"
        },
        {
          const: "foobar",
          title: "FooBar"
        }
      ]
    },
  }
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/oneOfEnum'
      },
    ]
  },
  data: {
    oneOfEnum:'foo'
  },
};

export const PlainEnum = () => (
  <Demo
    data={plainEnumInput.data}
    schema={plainEnumInput.schema}
    uischema={plainEnumInput.uischema}
  />
);

export const MultiEnum = () => (
  <Demo
    data={multiEnumInput.data}
    schema={multiEnumInput.schema}
    uischema={multiEnumInput.uischema}
  />
);

export const OneOfMultiEnum = () => (
  <Demo
    data={oneOfMultiEnum.data}
    schema={oneOfMultiEnum.schema}
    uischema={oneOfMultiEnum.uischema}
  />
);

export const OneOfEnum = () => (
  <Demo
    data={oneOfEnum.data}
    schema={oneOfEnum.schema}
    uischema={oneOfEnum.uischema}
  />
);

export const RadioGroup = () => (
  <Demo
    data={radioGroup.data}
    schema={radioGroup.schema}
    uischema={radioGroup.uischema}
  />
);

export const AutocompleteEnum= () => (
  <Demo
    data={autocompleteEnum.data}
    schema={autocompleteEnum.schema}
    uischema={autocompleteEnum.uischema}
  />
);

export const AutocompleteOneOf= () => (
  <Demo
    data={autocompleteOneOf.data}
    schema={autocompleteOneOf.schema}
    uischema={autocompleteOneOf.uischema}
  />
);

export const TimeOptionTable = () => (
  <div>
    <h2>Time Picker Options</h2>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Option</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>timeFormat</TableCell>
          <TableCell>The time format used for the text input, can be different from the save format</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>timeSaveFormat</TableCell>
          <TableCell>The format in which the time is saved in the data. Note that if you specify a format which is incompatible with JSON Schema's "time" format then
           you should use the UI Schema based invocation, otherwise the control will be marked with an error.</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>ampm</TableCell>
          <TableCell>If set to true, the time picker modal is presented in 12-hour format, otherwise the 24-hour format is used</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>clearLabel</TableCell>
          <TableCell>Label of the "clear" action in the time picker modal</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>cancelLabel</TableCell>
          <TableCell>Label of the "cancel" action in the time picker modal</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>okLabel</TableCell>
          <TableCell>Label of the "confirm" action in the time picker modal</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
