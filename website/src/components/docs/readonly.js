import React from 'react';
import { Demo } from '../common/Demo';

const data = {
  firstName: "Max",
  lastName: "Mustermann"
}

const readonlyConfig = {
  schema: {
    properties: {
      firstName: {
        type: "string"
      },
      lastName: {
        type: "string"
      }
    }
  },
  uischema: {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/firstName"
      },
      {
        type: "Control",
        scope: "#/properties/lastName",
      }
    ]
  }
}

const readonlyUischema = {
  schema: {
    properties: {
      firstName: {
        type: "string"
      },
      lastName: {
        type: "string"
      }
    }
  },
  uischema: {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/firstName",
        options: {
          readOnly: true
        }
      },
      {
        type: "Control",
        scope: "#/properties/lastName",
      }
    ]
  }
}

const readonlySchema = {
  schema: {
    properties: {
      firstName: {
        type: "string",
        readOnly: true
      },
      lastName: {
        type: "string"
      }
    }
  },
  uischema: {
    type: "VerticalLayout",
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
  }
}

const readonlyRule = {
  schema: {
    properties: {
      firstName: {
        type: "string"
      },
      lastName: {
        type: "string"
      }
    }
  },
  uischema: {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/firstName",
        rule: {
          effect: "DISABLE",
          condition: {
            scope: "#",
            schema: {}
          }
        }
      },
      {
        type: "Control",
        scope: "#/properties/lastName"
      }
    ]
  }
}

export const ReadOnlyConfig = () => (
  <Demo
    data={data}
    schema={readonlyConfig.schema}
    uischema={readonlyConfig.uischema}
    readonly
  />
);

export const ReadOnlyUiSchema = () => (
  <Demo
    data={data}
    schema={readonlyUischema.schema}
    uischema={readonlyUischema.uischema}
  />
);

export const ReadOnlySchema = () => (
  <Demo
    data={data}
    schema={readonlySchema.schema}
    uischema={readonlySchema.uischema}
  />
);

export const ReadOnlyRule = () => (
  <Demo
    data={data}
    schema={readonlyRule.schema}
    uischema={readonlyRule.uischema}
  />
);
