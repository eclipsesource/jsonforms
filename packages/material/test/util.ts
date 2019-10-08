import { RefResolver } from '@jsonforms/react';
import waitUntil from 'async-wait-until';
import { act } from 'react-dom/test-utils';
import { ReactWrapper } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import RefParser from 'json-schema-ref-parser';
import { JsonSchema, RefResolverFunction } from '@jsonforms/core';

export const waitForRenderer = async (
  wrapper: ReactWrapper,
  Component: any,
  length: number
) => {
  await act(async () => {
    waitUntil(() => wrapper.find(Component).length !== length);
  });
  wrapper.update();
};

export const waitForResolveRef = async (wrapper: ReactWrapper) => {
  await act(async () => waitUntil(() => wrapper.find(RefResolver).children() != null));
  wrapper.update();
};

export const resolveRef = (rootSchema: any): RefResolverFunction => (pointer: string) => {
  const parser = new RefParser();
  return parser
    .resolve(cloneDeep(rootSchema), {
      dereference: { circular: 'ignore' }
    })
    .then(refs => refs.get(pointer) as JsonSchema);
};
