import { memo, useMemo } from 'react';
import type { PresentationNode } from '@jsonforms/core';
import { isControlNode, NOT_APPLICABLE } from '@jsonforms/core';
import type { NodeRendererProps, RendererRegistryEntry } from './context';
import { useJsonFormsContext } from './context';
import { useNode } from './hooks';

/**
 * Resolves the highest-ranking renderer for the node with the given id and
 * renders it. Container renderers recurse by rendering a `NodeDispatch` per
 * child id.
 */
export const NodeDispatch = memo(function NodeDispatch({
  id,
}: NodeRendererProps) {
  const { renderers } = useJsonFormsContext();
  const node = useNode(id);
  const entry = useMemo(
    () => (node ? findRenderer(renderers, node) : undefined),
    [renderers, node],
  );
  if (node === undefined || node.hidden === true) {
    return null;
  }
  if (entry === undefined) {
    return <UnknownNode node={node} />;
  }
  const Renderer = entry.renderer;
  return <Renderer id={id} />;
});

const findRenderer = (
  renderers: readonly RendererRegistryEntry[],
  node: PresentationNode,
): RendererRegistryEntry | undefined => {
  let best: RendererRegistryEntry | undefined;
  let bestRank = NOT_APPLICABLE;
  for (const entry of renderers) {
    const rank = entry.tester(node);
    if (rank > bestRank) {
      best = entry;
      bestRank = rank;
    }
  }
  return best;
};

const UnknownNode = ({ node }: { node: PresentationNode }) => (
  <div
    role="note"
    style={{
      border: '1px dashed #999',
      borderRadius: 4,
      padding: 8,
      fontFamily: 'monospace',
      fontSize: 12,
    }}
  >
    No renderer registered for node kind &apos;{node.kind}&apos;
    {isControlNode(node) ? ` (valueType '${node.valueType}')` : ''}.
  </div>
);
