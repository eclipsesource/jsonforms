import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type {
  ControlNode,
  FormCommand,
  FormEngine,
  LayoutNode,
  NodeId,
  PresentationNode,
} from '@jsonforms/core';
import {
  setValue as setValueCommand,
  touch as touchCommand,
} from '@jsonforms/core';
import { useJsonFormsContext } from './context';

/** The form engine driving the surrounding `<JsonForms>` element. */
export const useFormEngine = (): FormEngine => useJsonFormsContext().engine;

/**
 * Stable dispatch function for form commands — the low-level fallback for
 * custom renderers and custom commands. Regular control renderers should
 * prefer {@link useControlDispatch}.
 */
export const useFormDispatch = (): ((command: FormCommand) => void) =>
  useJsonFormsContext().engine.dispatch;

/**
 * Subscribes to a single presentation node. The component re-renders only when
 * this node's content changes — unchanged nodes keep their object identity.
 */
export const useNode = (id: NodeId): PresentationNode | undefined => {
  const { engine } = useJsonFormsContext();
  const subscribe = useCallback(
    (onStoreChange: () => void) => engine.subscribeNode(id, onStoreChange),
    [engine, id],
  );
  const getSnapshot = useCallback(() => engine.getNode(id), [engine, id]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

/** Like {@link useNode}, but asserts the node is a control node. */
export const useControlNode = (id: NodeId): ControlNode => {
  const node = useNode(id);
  if (node === undefined || node.kind !== 'control') {
    throw new Error(
      `Expected a control node for id '${id}', got '${node?.kind ?? 'none'}'.`,
    );
  }
  return node;
};

/** Like {@link useNode}, but asserts the node is a layout node. */
export const useLayoutNode = (id: NodeId): LayoutNode => {
  const node = useNode(id);
  if (node === undefined || node.kind !== 'layout') {
    throw new Error(
      `Expected a layout node for id '${id}', got '${node?.kind ?? 'none'}'.`,
    );
  }
  return node;
};

/** Node-scoped dispatch API for control renderers. */
export interface ControlDispatch {
  /** Sets (or, with `undefined`, removes) the control's value. */
  setValue: (value: unknown) => void;
  /** Marks the control as interacted-with (typically called on blur). */
  touch: () => void;
}

/**
 * Returns a dispatch API scoped to the given control node: renderers neither
 * see data paths nor node ids. All dispatched commands carry the node as
 * `sourceNodeId` provenance. For anything beyond regular value edits, fall
 * back to {@link useFormDispatch}.
 */
export const useControlDispatch = (node: ControlNode): ControlDispatch => {
  const dispatch = useFormDispatch();
  const { id, path } = node;
  return useMemo(
    () => ({
      setValue: (value: unknown) => dispatch(setValueCommand(path, value, id)),
      touch: () => dispatch(touchCommand(id, id)),
    }),
    [dispatch, path, id],
  );
};
