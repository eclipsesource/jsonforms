import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { FormEngine } from '@jsonforms/core';
import type {
  JsonFormsChangeEvent,
  RendererRegistryEntry,
} from '@jsonforms/react';
import { JsonForms } from '@jsonforms/react';
import type { DemoEngineInputs, ServerMessage } from '@jsonforms/demo-shared';
import { createRemoteFormEngine } from '@jsonforms/demo-shared';

export interface RemoteEngineFormProps {
  /**
   * Initial engine configuration — like the `data` prop of `JsonForms`, this
   * is read once on mount. Remount the component (via `key`) to reconfigure.
   */
  inputs: DemoEngineInputs;
  renderers: readonly RendererRegistryEntry[];
  onChange?: (event: JsonFormsChangeEvent) => void;
  /** Shown until the worker delivered the initial model. */
  fallback?: ReactNode;
}

/**
 * Renders a form against an engine hosted in a Web Worker (the demos' server
 * stand-in). The worker is an external system whose lifetime is tied to this
 * component: created on mount, terminated on unmount — no state-driven effect
 * re-runs.
 */
export const RemoteEngineForm = ({
  inputs,
  renderers,
  onChange,
  fallback,
}: RemoteEngineFormProps) => {
  const [initialInputs] = useState(inputs);
  const [engine, setEngine] = useState<FormEngine | undefined>(undefined);

  useEffect(() => {
    const worker = new Worker(new URL('./engine.worker.ts', import.meta.url), {
      type: 'module',
    });
    const connection = createRemoteFormEngine(
      (message) => worker.postMessage(message),
      initialInputs,
    );
    worker.onmessage = (event: MessageEvent) =>
      connection.receive(event.data as ServerMessage);
    let cancelled = false;
    void connection.ready.then((readyEngine) => {
      if (!cancelled) {
        setEngine(readyEngine);
      }
    });
    return () => {
      cancelled = true;
      worker.terminate();
    };
  }, [initialInputs]);

  if (engine === undefined) {
    return fallback;
  }
  return (
    <JsonForms engine={engine} renderers={renderers} onChange={onChange} />
  );
};
