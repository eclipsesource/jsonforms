import { describe, expect, test, vi } from 'vitest';
import type { ControlNode } from '@jsonforms/core';
import { setValue } from '@jsonforms/core';
import type {
  DemoEngineInputs,
  ServerMessage,
  ServerSimulationOptions,
} from '../src';
import { createEngineHost, createRemoteFormEngine } from '../src';

// The host resolves examples by id, like a real server owning its schemas.
// '#/0/0' is the 'First Name' control of the shared 'person' example.
const inputs: DemoEngineInputs = {
  exampleId: 'person',
  validation: { choice: 'handwritten' },
};

/**
 * Wires host and client directly, with a JSON round-trip on every message —
 * proving the whole protocol is plain serializable data, exactly like a
 * worker or network transport.
 */
const connect = (
  connectInputs: DemoEngineInputs,
  simulation?: ServerSimulationOptions,
) => {
  const pending: ServerMessage[] = [];
  const sink: { receive?: (message: ServerMessage) => void } = {};
  const wire = <T>(message: T): T => JSON.parse(JSON.stringify(message)) as T;
  const handle = createEngineHost((message) => {
    const serialized = wire(message);
    if (sink.receive) {
      sink.receive(serialized);
    } else {
      pending.push(serialized);
    }
  });
  const connection = createRemoteFormEngine(
    (message) => handle(wire(message)),
    connectInputs,
    simulation,
  );
  sink.receive = connection.receive;
  pending.forEach(connection.receive);
  return connection;
};

describe('remote engine over a serialized transport', () => {
  test('delivers the initial model', async () => {
    const engine = await connect(inputs).ready;
    const firstName = engine.getNode('#/0/0') as ControlNode;
    expect(firstName.label).toBe('First Name');
    expect(firstName.value).toBe('Ada');
  });

  test('round-trips commands and applies deltas with identity preservation', async () => {
    const engine = await connect(inputs).ready;
    const lastNameBefore = engine.getNode('#/0/1');
    engine.dispatch(setValue('/firstName', 'Grace'));
    expect((engine.getNode('#/0/0') as ControlNode).value).toBe('Grace');
    expect(engine.getNode('#/0/1')).toBe(lastNameBefore);
  });

  test('notifies node subscribers on remote updates', async () => {
    const engine = await connect(inputs).ready;
    let notified = 0;
    engine.subscribeNode('#/0/0', () => {
      notified += 1;
    });
    engine.dispatch(setValue('/firstName', 'Grace'));
    expect(notified).toBe(1);
  });

  test('remote validation issues arrive on the nodes', async () => {
    const engine = await connect(inputs).ready;
    engine.dispatch(setValue('/firstName', undefined));
    expect((engine.getNode('#/0/0') as ControlNode).issues).toMatchObject([
      { key: 'required' },
    ]);
  });

  test('zod examples work through the protocol', async () => {
    const engine = await connect({
      exampleId: 'zod-cross-field',
      validation: { choice: 'zod' },
    }).ready;
    // The initial trip data violates the cross-field refinement.
    const endDate = engine.getNode('#/1/1') as ControlNode;
    expect(endDate.path).toBe('/endDate');
    expect(endDate.issues).toMatchObject([
      { message: 'must not be before the start date' },
    ]);
    engine.dispatch(setValue('/endDate', '2026-07-12'));
    expect((engine.getNode('#/1/1') as ControlNode).issues).toEqual([]);
  });

  test('rejected changes leave the model untouched', async () => {
    const engine = await connect(inputs, { rejectChangesPercent: 100 }).ready;
    engine.dispatch(setValue('/firstName', 'Grace'));
    expect((engine.getNode('#/0/0') as ControlNode).value).toBe('Ada');
  });

  test('responses are delayed when configured', async () => {
    const connection = connect(inputs, { responseDelayMs: 20 });
    let ready = false;
    void connection.ready.then(() => {
      ready = true;
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(ready).toBe(false);
    await vi.waitFor(async () => {
      expect(ready).toBe(true);
    });
  });
});
