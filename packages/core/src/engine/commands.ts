import type { DataPath, NodeId } from '../model/nodes';

/** Shared shape of all commands. */
export interface FormCommandBase {
  /**
   * Optional provenance: the node on whose behalf this command was dispatched.
   * Purely informational for the engine — available to interceptors, auditing,
   * and remote backends.
   */
  sourceNodeId?: NodeId;
}

/** Sets (or, with `value === undefined`, removes) the data value at `path`. */
export interface SetValueCommand extends FormCommandBase {
  type: 'set-value';
  path: DataPath;
  value: unknown;
}

/** Marks a node as interacted-with (typically dispatched on blur). */
export interface TouchCommand extends FormCommandBase {
  type: 'touch';
  nodeId: NodeId;
}

/**
 * Commands are the only way to change form state. They are plain serializable
 * JSON, so the same command stream works against a local engine, a worker, or
 * a server.
 */
export type FormCommand = SetValueCommand | TouchCommand;

export const setValue = (
  path: DataPath,
  value: unknown,
  sourceNodeId?: NodeId,
): SetValueCommand => ({
  type: 'set-value',
  path,
  value,
  ...(sourceNodeId !== undefined && { sourceNodeId }),
});

export const touch = (nodeId: NodeId, sourceNodeId?: NodeId): TouchCommand => ({
  type: 'touch',
  nodeId,
  ...(sourceNodeId !== undefined && { sourceNodeId }),
});
