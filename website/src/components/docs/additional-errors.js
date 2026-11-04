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

const AdditionalErrorsExample = () => {
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

    const addAdditionalError = () => {
        setAdditionalErrors(errors => [...errors, {
            // path the the property in the schema
            instancePath: '/lastname',
            // message to display
            message: `New error #${errors.length + 1}`,
            schemaPath: '',
            keyword: '',
            params: {},
        }]);
    };

    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState([]);
    const [additionalErrors, setAdditionalErrors] = useState([]);

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
                additionalErrors={additionalErrors}
            />
            <Button onClick={addAdditionalError} color='primary' variant='contained' sx={{ marginRight: 2 }}>
                Add Additional Error
            </Button>
            <Button onClick={toggleValidation} color='primary' variant='outlined'>
                Switch Validation Mode
            </Button>
            <p />
            <p>
                <b>Additional errors:</b> {additionalErrors.map((error) => error.message).join(', ')}
            </p>
            <p>
                <b>Emitted errors:</b> {errors.map((error) => error.message).join(', ')}
            </p>
            <p>
                <b>Current validation mode:</b> {currentValidationMode}
            </p>
        </div>
    );
};

export default AdditionalErrorsExample;
