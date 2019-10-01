import { ScopedRenderer, ResolveRef } from '@jsonforms/react';
import waitUntil from 'async-wait-until';
import { act } from 'react-dom/test-utils';
import { ReactWrapper } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import RefParser from 'json-schema-ref-parser';

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

export const waitForScopedRenderer = async (wrapper: ReactWrapper) => {
  await act(async () => {
    waitUntil(() => wrapper.find(ScopedRenderer).children() !== null);
  });
  wrapper.update();
};

export const waitForRefResolver = async (wrapper: ReactWrapper) => {
  await act(async () => {
    waitUntil(() => {
      const len = wrapper.find(ResolveRef).children().length;
      return len > 0;
    });
  });
  wrapper.update();
};

export const resolveRef = (rootSchema: any) => async (pointer: string) => {
  const parser = new RefParser();
  return parser
    .resolve(cloneDeep(rootSchema), {
      dereference: { circular: 'ignore' }
    })
    .then(refs => refs.get(pointer));
};
