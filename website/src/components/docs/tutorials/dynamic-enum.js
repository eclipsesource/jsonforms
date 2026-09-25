import { Demo } from '../../common/Demo';
import { materialRenderers } from '@jsonforms/material-renderers';
import React from 'react';

import countryControlTester from '../../common/country/countryControlTester';
import CountryControl from '../../common/country/CountryControl';
import regionControlTester from '../../common/region/regionControlTester';
import RegionControl from '../../common/region/RegionControl';
import { API } from '../../common/api';

const data = {
};

const schema = {
    "x-url": "www.api.com",
    "type": "object",
    "properties": {
      "country": {
        "type": "string",
        "x-endpoint": "countries",
        "x-dependent": ["region", "city"]
      },
      "region": {
        "type": "string",
        "x-endpoint": "regions",
        "x-dependent": ["city"]
      },
      "city": {
        "type": "string"
      },
  }}
  

const regionUiSchema = {
    "type": "HorizontalLayout",
    "elements": [
        {
            "type": "Control",
            "scope": "#/properties/country"
        },
        {
            "type": "Control",
            "scope": "#/properties/region"
        },
        {
            "type": "Control",
            "scope": "#/properties/city"
        }
        ]
  }

export const WithRegionRenderer = () => (
  <Demo
    data= {data}
    schema = {schema}
    uischema={regionUiSchema}
    renderers={[
      ...materialRenderers,
      { tester: countryControlTester, renderer: CountryControl },
      { tester: regionControlTester, renderer: RegionControl },
    ]}
  />
);

const url = schema['x-url'];
export const APIContext = React.createContext(new API(url));