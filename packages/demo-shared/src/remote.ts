import type {
  FormCommand,
  FormEngine,
  ModelDelta,
  NodeId,
  PresentationModel,
} from '@jsonforms/core';
import { applyDelta } from '@jsonforms/core';
import type { DemoEngineInputs } from './demo-engine';
import { createDemoEngine } from './demo-engine';

/**
 * Behavior of the simulated server hosting the engine — lets the demos
 * explore how the UI copes with slow or unreliable backends.
 */
export interface ServerSimulationOptions {
  /** Delay every server response by this many milliseconds. Default: `0`. */
  responseDelayMs?: number;
  /** Reject this percentage (0–100) of value changes. Default: `0`. */
  rejectChangesPercent?: number;
}

/**
 * The serialized engine protocol used by the demos' "server simulation": the
 * engine runs in a Web Worker (a stand-in for a server) and the UI thread only
 * ever exchanges plain JSON — commands in, model + deltas out. A real network
 * server merely swaps the transport.
 */
export type ClientMessage =
  | {
      type: 'init';
      inputs: DemoEngineInputs;
      simulation?: ServerSimulationOptions;
    }
  | { type: 'command'; command: FormCommand };

export type ServerMessage =
  | { type: 'model'; model: PresentationModel; data: unknown }
  | { type: 'delta'; delta: ModelDelta };

/**
 * The "server" half: hosts a real engine and serves it over message passing.
 * Returns the handler for incoming {@link ClientMessage}s.
 */
export const createEngineHost = (
  post: (message: ServerMessage) => void,
): ((message: ClientMessage) => void) => {
  let engine: FormEngine | undefined;
  let simulation: ServerSimulationOptions | undefined;

  const respond = (message: ServerMessage): void => {
    const delay = simulation?.responseDelayMs ?? 0;
    if (delay > 0) {
      setTimeout(() => post(message), delay);
    } else {
      post(message);
    }
  };

  return (message) => {
    switch (message.type) {
      case 'init': {
        simulation = message.simulation;
        engine = createDemoEngine(message.inputs);
        respond({
          type: 'model',
          model: engine.getModel(),
          data: engine.getData(),
        });
        engine.subscribe((delta) => respond({ type: 'delta', delta }));
        break;
      }
      case 'command': {
        const rejectPercent = simulation?.rejectChangesPercent ?? 0;
        if (
          message.command.type === 'set-value' &&
          rejectPercent > 0 &&
          Math.random() * 100 < rejectPercent
        ) {
          // Change rejected by the simulated server — no delta is sent, so
          // the client model (and thereby the UI) keeps the previous value.
          break;
        }
        engine?.dispatch(message.command);
        break;
      }
    }
  };
};

export interface RemoteEngineConnection {
  /** Resolves once the host delivered the initial model. */
  ready: Promise<FormEngine>;
  /** Feed incoming {@link ServerMessage}s into the connection. */
  receive: (message: ServerMessage) => void;
}

/**
 * The client half: a `FormEngine` facade over the message protocol. It holds
 * no schema source and no validator — commands are sent to the host, model
 * updates arrive as deltas and are applied via `applyDelta`, preserving node
 * identities so node-granular re-rendering keeps working.
 */
export const createRemoteFormEngine = (
  post: (message: ClientMessage) => void,
  inputs: DemoEngineInputs,
  simulation?: ServerSimulationOptions,
): RemoteEngineConnection => {
  let model: PresentationModel | undefined;
  let data: unknown;
  const modelListeners = new Set<(delta: ModelDelta) => void>();
  const nodeListeners = new Map<NodeId, Set<() => void>>();
  let resolveReady!: (engine: FormEngine) => void;
  const ready = new Promise<FormEngine>((resolve) => {
    resolveReady = resolve;
  });

  const engine: FormEngine = {
    getModel: () => model as PresentationModel,
    getNode: (id) => model?.nodes[id],
    getData: () => data,
    dispatch: (command) => post({ type: 'command', command }),
    subscribe: (listener) => {
      modelListeners.add(listener);
      return () => {
        modelListeners.delete(listener);
      };
    },
    subscribeNode: (id, listener) => {
      let listeners = nodeListeners.get(id);
      if (listeners === undefined) {
        listeners = new Set();
        nodeListeners.set(id, listeners);
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          nodeListeners.delete(id);
        }
      };
    },
  };

  const receive = (message: ServerMessage): void => {
    if (message.type === 'model') {
      model = message.model;
      data = message.data;
      resolveReady(engine);
      return;
    }
    if (model === undefined) {
      return;
    }
    model = applyDelta(model, message.delta);
    data = message.delta.data;
    for (const listener of [...modelListeners]) {
      listener(message.delta);
    }
    const changedIds = [
      ...message.delta.upserted.map((node) => node.id),
      ...message.delta.removed,
    ];
    for (const id of changedIds) {
      const listeners = nodeListeners.get(id);
      if (listeners) {
        for (const listener of [...listeners]) {
          listener();
        }
      }
    }
  };

  post({ type: 'init', inputs, simulation });
  return { ready, receive };
};

/** The demo apps' engine-location choices. */
export type EngineChoice = 'local' | 'worker';

export interface EngineChoiceInfo {
  id: EngineChoice;
  label: string;
}

export const engineChoices: readonly EngineChoiceInfo[] = [
  { id: 'local', label: 'Local (browser)' },
  { id: 'worker', label: 'Web Worker (server simulation)' },
];
