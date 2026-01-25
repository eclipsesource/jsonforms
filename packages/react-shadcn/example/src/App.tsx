import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { shadcnRenderers, shadcnCells } from '@jsonforms/react-shadcn';

const schema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 3,
      description: 'Please enter your first name',
    },
    lastName: {
      type: 'string',
      minLength: 3,
      description: 'Please enter your last name',
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
  required: ['firstName', 'lastName'],
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/firstName',
    },
    {
      type: 'Control',
      scope: '#/properties/lastName',
    },
    {
      type: 'Control',
      scope: '#/properties/email',
    },
  ],
};

const initialData = {
  firstName: 'John',
  lastName: 'Doe',
};

function App() {
  const [data, setData] = useState(initialData);

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          JSON Forms shadcn/ui Example
        </h1>

        <div className="mb-8 p-6 border rounded-lg bg-card text-card-foreground">
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={shadcnRenderers}
            cells={shadcnCells}
            onChange={({ data }) => setData(data)}
          />
        </div>

        <div className="p-6 border rounded-lg bg-muted text-muted-foreground">
          <h2 className="text-xl font-semibold mb-4">Form Data</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
