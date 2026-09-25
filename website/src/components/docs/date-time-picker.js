import React, { useState } from 'react';
import { Demo } from '../common/Demo';

import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';

import { JsonForms } from '@jsonforms/react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';

import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';

export const TimeSchemaInput = {
  schema: {
    properties: {
        time: {
          type: 'string',
          format: 'time',
          description: 'schema-based time picker'
        },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/time',
  },
  data: {
    time: '13:37:00',
  },
};

export const TimeSchema = () => (
  <Demo
    data={TimeSchemaInput.data}
    schema={TimeSchemaInput.schema}
    uischema={TimeSchemaInput.uischema}
  />
);

export const TimeUiSchemaInput = {
  schema: {
    properties: {
      time: {
        type: 'string'
      },
    }
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/time',
    options: {
      format: 'time'
    }
  },
  data: {
    time: '13:37:00'
  },
};

export const TimeUiSchema = () => (
  <Demo
    data={TimeUiSchemaInput.data}
    schema={TimeUiSchemaInput.schema}
    uischema={TimeUiSchemaInput.uischema}
  />
);


export const TimeUiSchemaOptionsInput = {
  schema: {
    properties: {
      time: {
        type: 'string'
      },
    }
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/time',
    options: {
      format: 'time',
      ampm: true,
      timeFormat: 'HH',
      timeSaveFormat: 'HH:mm',
      clearLabel: 'Clear it!',
      cancelLabel: 'Abort',
      okLabel: 'Do it',
    }
  },
  data: {
    time: '13:00:00'
  },
};

export const TimeUiOptionSchema = () => (
  <Demo
    data={TimeUiSchemaOptionsInput.data}
    schema={TimeUiSchemaOptionsInput.schema}
    uischema={TimeUiSchemaOptionsInput.uischema}
  />
);


export const DateSchemaInput = {
  schema: {
    properties: {
      date: {
        type: 'string',
        format: 'date',
        description: 'schema-based date picker'
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/date',
  },
  data: {
    date: new Date().toISOString().substr(0, 10),
  },
};

export const DateSchema = () => (
  <Demo
    data={DateSchemaInput.data}
    schema={DateSchemaInput.schema}
    uischema={DateSchemaInput.uischema}
  />
);


export const DateSchemaUiInput = {
  schema: {
    properties: {
      date: {
        type: 'string',
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/date',
    options: {
      format: 'date'
    },
  },
  data: {
    date: new Date().toISOString().substr(0, 10),
  },
};

export const DateUiSchema = () => (
  <Demo
    data={DateSchemaUiInput.data}
    schema={DateSchemaUiInput.schema}
    uischema={DateSchemaUiInput.uischema}
  />
);


export const DateSchemaUiOptionsInput = {
  schema: {
    properties: {
      date: {
        type: 'string',
        description: 'does not allow to select days'
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/date',
    label: 'Year Month Picker',
    options: {
      format: 'date',
      clearLabel: 'Clear it!',
      cancelLabel: 'Abort',
      okLabel: 'Do it',
      views: ['year', 'month'],
      dateFormat: 'YYYY.MM',
      dateSaveFormat: 'YYYY-MM'
    },
  },
  data: {
    date: new Date().toISOString().substr(0, 10),
  },
};

export const DateUiSchemaOptions = () => (
  <Demo
    data={DateSchemaUiOptionsInput.data}
    schema={DateSchemaUiOptionsInput.schema}
    uischema={DateSchemaUiOptionsInput.uischema}
  />
);

export const DateTimeSchemaInput = {
  schema: {
    properties: {
      datetime: {
        type: 'string',
        format: 'date-time',
        description: 'schema-based datetime picker'
      }
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/datetime',
  },
  data: {
    datetime: new Date().toISOString()
  },
};

export const DateTimeSchema = () => (
  <Demo
    data={DateTimeSchemaInput.data}
    schema={DateTimeSchemaInput.schema}
    uischema={DateTimeSchemaInput.uischema}
  />
);

export const DateTimeUiSchemaInput = {
  schema: {
    properties: {
      datetime: {
        type: 'string',
        description: 'uischema-based datetime picker'
      }
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/datetime',
    options: {
      format: 'date-time'
    }
  },
  data: {
    datetime: new Date().toISOString()
  },
};

export const DateTimeUiSchema = () => (
  <Demo
    data={DateTimeUiSchemaInput.data}
    schema={DateTimeUiSchemaInput.schema}
    uischema={DateTimeUiSchemaInput.uischema}
  />
);

export const DateTimeUiOptionSchemaInput = {
  schema: {
    properties: {
      datetime: {
        type: 'string',
        description: 'uischema-based datetime picker'
      }
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/datetime',
    options: {
      format: 'date-time',
      clearLabel: 'Clear it!',
      cancelLabel: 'Abort',
      okLabel: 'Do it',
      dateTimeFormat: 'DD-MM-YY hh:mm:a',
      dateTimeSaveFormat: 'YYYY/MM/DD h:mm a',
      ampm: true
    }
  },
  data: {
    datetime: new Date().toISOString()
  },
};

export const DateTimeUiOptionSchema = () => (
  <Demo
    data={DateTimeUiOptionSchemaInput.data}
    schema={DateTimeUiOptionSchemaInput.schema}
    uischema={DateTimeUiOptionSchemaInput.uischema}
  />
);


export const DateSchemaGerman = {
  schema: {
    properties: {
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/date',
    label: 'Datum',
    options: {
      format: 'date',
      clearLabel: 'Zurücksetzen',
      cancelLabel: 'Abbrechen',
      okLabel: 'Ok'
    },
  },
  data: {
    date: new Date().toISOString().substr(0, 10),
  },
};

export const LocalizationExample = () => {
  
  const [data, setData] = useState(DateSchemaInput.data);
  const [local, setLocal] = useState('en');
  const [key, setKey] = useState(1);

  dayjs.locale(local);

  return (
    <div style={{padding:"8px"}}>
    <Grid
      container
      direction='column'
      justifyContent='space-between'
      alignItems="stretch"
      >
        <Select 
            value = {local}
            onChange={(event) =>{
              setKey(key+1);
              setLocal(event.target.value);
            }}
            style={{marginBottom:'20px'}}
            >
            <MenuItem value={'en'}>en</MenuItem>
            <MenuItem value={'de'}>de</MenuItem>
          </Select>
          {local == "en"?
          <JsonForms
            key={key}
            data={data}
            schema={DateSchemaUiInput.schema}
            uischema={DateSchemaUiInput.uischema}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data, _errors }) => setData(data)}
          />:<JsonForms
            key={key}
            data={data}
            schema={DateSchemaGerman.schema}
            uischema={DateSchemaGerman.uischema}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data, _errors }) => setData(data)}
          />}
    </Grid>
    </div>
  );
};

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


export const DateOptionTable = () => (
  <div>
    <h2>Date Picker Options</h2>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Option</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>dateFormat</TableCell>
          <TableCell>The date format used for the text input, can be different from the save format</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>dateSaveFormat</TableCell>
          <TableCell>The format in which the date is saved in the data. Note that if you specify a format which is incompatible with JSON Schema's "date" format then
           you should use the UI Schema based invocation, otherwise the control will be marked with an error.</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>views</TableCell>
          <TableCell>Array defining which views are displayed. Options: year, month, day</TableCell>
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



export const DateTimeOptionTable = () => (
  <div>
    <h2>Date Time Picker Options</h2>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Option</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>dateTimeFormat</TableCell>
          <TableCell>The date-time format used for the text input, can be different from the save format</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>dateTimeSaveFormat</TableCell>
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
