/**
 * The "server": hosts a real form engine inside a Web Worker. The UI thread
 * never builds models or validates — it only exchanges serialized messages
 * with this worker, exactly as it would with a network server.
 */
import type { ClientMessage } from '@jsonforms/demo-shared';
import { createEngineHost } from '@jsonforms/demo-shared';

const scope = self as unknown as {
  postMessage(message: unknown): void;
  onmessage: ((event: MessageEvent) => void) | null;
};

const handle = createEngineHost((message) => scope.postMessage(message));
scope.onmessage = (event) => handle(event.data as ClientMessage);
