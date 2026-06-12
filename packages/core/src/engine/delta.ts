import type {
  NodeId,
  PresentationModel,
  PresentationNode,
} from '../model/nodes';
import type { ModelDelta } from './engine';

/**
 * Applies a {@link ModelDelta} to a presentation model — the client half of
 * the serialized engine protocol (e.g. an engine running in a worker or on a
 * server). Nodes untouched by the delta keep their object identity, so
 * view-layer memoization keeps working across remote updates.
 */
export const applyDelta = (
  model: PresentationModel,
  delta: ModelDelta,
): PresentationModel => {
  const nodes: Record<NodeId, PresentationNode> = { ...model.nodes };
  for (const node of delta.upserted) {
    nodes[node.id] = node;
  }
  for (const id of delta.removed) {
    delete nodes[id];
  }
  return { version: delta.version, rootId: model.rootId, nodes };
};
