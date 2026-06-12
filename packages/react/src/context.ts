import { createContext, useContext } from 'react';
import type { ComponentType } from 'react';
import type { FormEngine, NodeId, NodeTester } from '@jsonforms/core';

/** Props every node renderer receives — the node itself is read via {@link useNode}. */
export interface NodeRendererProps {
  id: NodeId;
}

/** A renderer registration: the highest-ranking tester wins the node. */
export interface RendererRegistryEntry {
  tester: NodeTester;
  renderer: ComponentType<NodeRendererProps>;
}

export interface JsonFormsContextValue {
  engine: FormEngine;
  renderers: readonly RendererRegistryEntry[];
}

export const JsonFormsContext = createContext<
  JsonFormsContextValue | undefined
>(undefined);

export const useJsonFormsContext = (): JsonFormsContextValue => {
  const context = useContext(JsonFormsContext);
  if (context === undefined) {
    throw new Error(
      'JSON Forms hooks must be used within a <JsonForms> element.',
    );
  }
  return context;
};
