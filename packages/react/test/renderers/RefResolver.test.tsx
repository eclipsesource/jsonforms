import React, { Fragment } from 'react';
import { JsonSchema } from '@jsonforms/core';
import { mount, ReactWrapper } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import $RefParser from 'json-schema-ref-parser';
import waitUntil from 'async-wait-until';
import RefResolver from '../../src/RefResolver';
import { act } from 'react-dom/test-utils';

Enzyme.configure({ adapter: new Adapter() });

const geoSchema = {
  $id: 'https://example.com/geographical-location.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Longitude and Latitude Values',
  description: 'A geographical coordinate.',
  required: ['latitude', 'longitude'],
  type: 'object',
  properties: {
    latitude: {
      type: 'number',
      minimum: -90,
      maximum: 90
    },
    longitude: {
      type: 'number',
      minimum: -180,
      maximum: 180
    }
  }
};

export const resolveRef = (rootSchema: any) => (pointer: string) => {
  const parser = new $RefParser();
  return parser
    .resolve(
      rootSchema,
      {
        dereference: { circular: 'ignore' },
        resolve: {
          geo: {
            order: 1,
            canRead: (file: any) => {
              return file.url.indexOf('geographical-location.schema.json') !== -1;
            },
            read: () => JSON.stringify(geoSchema)
          }
        } as any
      }
    ).then(refs => refs.get(pointer) as JsonSchema);
};

export const waitForResolveRef = async (wrapper: ReactWrapper) => {
  await act(async () => waitUntil(() => wrapper.find(RefResolver).children() != null));
  wrapper.update();
};

test('RefResolver should support resolving a $ref on root', async () => {
  const schema = {
    $ref: 'geographical-location.schema.json#'
  };
  let resolvedSchema: any;
  const wrapper = mount(
    <RefResolver schema={schema} resolveRef={resolveRef(schema)} pointer='#'>
      {(resolved: JsonSchema) => {
        resolvedSchema = resolved;
        return <Fragment />;
      }}
    </RefResolver>
  );
  await waitForResolveRef(wrapper);
  expect(resolvedSchema!.properties.latitude).toBeDefined();
  wrapper.unmount();
});
