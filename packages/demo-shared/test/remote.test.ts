import { describe, expect, test, vi } from 'vitest';
import type { ControlNode } from '@jsonforms/core';
import { setValue } from '@jsonforms/core';
import type {
  DemoEngineInputs,
  ServerMessage,
  ServerSimulationOptions,
} from '../src';
import { createEngineHost, createRemoteFormEngine } from '../src';

const inputs: DemoEngineInputs = {
  schema: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', title: 'Name', minLength: 2 },
      age: { type: 'integer', title: 'Age' },
    },
  },
  data: { name: 'Ada' },
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
    const name = engine.getNode('#/0') as ControlNode;
    expect(name.label).toBe('Name');
    expect(name.value).toBe('Ada');
    expect(engine.getData()).toEqual({ name: 'Ada' });
  });

  test('round-trips commands and applies deltas with identity preservation', async () => {
    const engine = await connect(inputs).ready;
    const ageBefore = engine.getNode('#/1');
    engine.dispatch(setValue('/name', 'Grace'));
    expect((engine.getNode('#/0') as ControlNode).value).toBe('Grace');
    expect(engine.getData()).toEqual({ name: 'Grace' });
    expect(engine.getNode('#/1')).toBe(ageBefore);
  });

  test('notifies node subscribers on remote updates', async () => {
    const engine = await connect(inputs).ready;
    let notified = 0;
    engine.subscribeNode('#/0', () => {
      notified += 1;
    });
    engine.dispatch(setValue('/name', 'Grace'));
    expect(notified).toBe(1);
  });

  test('remote validation issues arrive on the nodes', async () => {
    const engine = await connect(inputs).ready;
    engine.dispatch(setValue('/name', undefined));
    expect((engine.getNode('#/0') as ControlNode).issues).toMatchObject([
      { key: 'required' },
    ]);
  });

  test('rejected changes leave the model untouched', async () => {
    const engine = await connect(inputs, { rejectChangesPercent: 100 }).ready;
    engine.dispatch(setValue('/name', 'Grace'));
    expect((engine.getNode('#/0') as ControlNode).value).toBe('Ada');
    expect(engine.getData()).toEqual({ name: 'Ada' });
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
