import React, { useState } from 'react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import Button from '@mui/material/Button';
import { JsonForms } from '@jsonforms/react';

const schema = {
  type: 'object',
  properties: {
    firstname: {
      type: 'string',
    },
    lastname: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['lastname'],
};

const uischema = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/firstname',
    },
    {
      type: 'Control',
      scope: '#/properties/lastname',
    },
  ],
};

const data = {
  firstname: 'Max',
  lastname: '',
};

let index = 0;

const ValidationExample = () => {
  const validationModes = [
    'ValidateAndShow',
    'ValidateAndHide',
    'NoValidation',
  ];

  const [currentValidationMode, setValidationMode] = useState(
    validationModes[0]
  );

  const toggleValidation = () => {
    index++;
    if (index == validationModes.length) {
      index = 0;
    }
    setValidationMode(validationModes[index]);
  };

  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState([]);

  return (
    <div>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={formData}
        renderers={materialRenderers}
        cells={materialCells}
        validationMode={currentValidationMode}
        onChange={(event) => {
          setFormData(event.data);
          setErrors(event.errors);
        }}
      />
      <Button onClick={toggleValidation} color='primary' variant='contained'>
        Switch Validation Mode
      </Button>
      <p />
      <p>
        <b>Current validation mode:</b> {currentValidationMode}
      </p>
      <p>
        <b>Emitted errors:</b> {errors.map((error) => error.message).join(', ')}
      </p>
    </div>
  );
};

export default ValidationExample;
