import { describe, expect, test, vi } from 'vitest';
import type {
  ControlNode,
  LayoutNode,
  UISchemaElement,
  FormEngineOptions,
  FormValidator,
  NodeProcessor,
} from '../src';
import {
  alwaysShowIssues,
  createFormEngine,
  isControlNode,
  jsonSchemaSource,
  setValue,
  touch,
  type JsonSchema,
} from '../src';

const schema: JsonSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', title: 'Name', minLength: 2 },
    age: { type: 'integer', title: 'Age' },
    vegetarian: { type: 'boolean' },
  },
};

const uischema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/name' },
        { type: 'Control', scope: '#/properties/age' },
      ],
    },
    { type: 'Control', scope: '#/properties/vegetarian' },
  ],
};

const createEngine = (overrides: Partial<FormEngineOptions> = {}) =>
  createFormEngine({
    schemaSource: jsonSchemaSource(schema),
    uischema,
    data: { name: 'Ada', age: 36 },
    ...overrides,
  });

describe('initial build', () => {
  test('mirrors the UI structure with stable ids', () => {
    const engine = createEngine();
    const model = engine.getModel();
    const root = model.nodes[model.rootId] as LayoutNode;
    expect(root.kind).toBe('layout');
    expect(root.direction).toBe('vertical');
    expect(root.children).toEqual(['#/0', '#/1']);
    const row = model.nodes['#/0'] as LayoutNode;
    expect(row.direction).toBe('horizontal');
    expect(row.children).toEqual(['#/0/0', '#/0/1']);
  });

  test('controls carry value, label, valueType and required', () => {
    const engine = createEngine();
    const name = engine.getNode('#/0/0') as ControlNode;
    expect(name.path).toBe('/name');
    expect(name.value).toBe('Ada');
    expect(name.label).toBe('Name');
    expect(name.valueType).toBe('string');
    expect(name.required).toBe(true);
    expect(name.constraints.minLength).toBe(2);
    const vegetarian = engine.getNode('#/1') as ControlNode;
    expect(vegetarian.label).toBe('Vegetarian');
    expect(vegetarian.required).toBeUndefined();
    expect(vegetarian.value).toBeUndefined();
  });

  test('omits default-false flags entirely', () => {
    const engine = createEngine();
    const name = engine.getNode('#/0/0') as ControlNode;
    expect('hidden' in name).toBe(false);
    expect('disabled' in name).toBe(false);
    expect('touched' in name).toBe(false);
    expect('readonly' in name).toBe(false);
    const vegetarian = engine.getNode('#/1') as ControlNode;
    expect('required' in vegetarian).toBe(false);
    const row = engine.getNode('#/0') as LayoutNode;
    expect('hidden' in row).toBe(false);
    expect('disabled' in row).toBe(false);
  });

  test('falls back to a generated uischema', () => {
    const engine = createFormEngine({
      schemaSource: jsonSchemaSource(schema),
      data: {},
    });
    const root = engine.getModel().nodes['#'] as LayoutNode;
    expect(root.children).toHaveLength(3);
  });

  test('flags controls with unknown scopes', () => {
    const engine = createEngine({
      uischema: { type: 'Control', scope: '#/properties/missing' },
    });
    const node = engine.getNode('#') as ControlNode;
    expect(node.valueType).toBe('unknown');
    expect(node.issues[0]?.key).toBe('unknown-scope');
  });
});

describe('set-value', () => {
  test('updates data and the affected node', () => {
    const engine = createEngine();
    engine.dispatch(setValue('/name', 'Grace'));
    expect(engine.getData()).toEqual({ name: 'Grace', age: 36 });
    expect((engine.getNode('#/0/0') as ControlNode).value).toBe('Grace');
  });

  test('removes data when setting undefined', () => {
    const engine = createEngine();
    engine.dispatch(setValue('/age', undefined));
    expect(engine.getData()).toEqual({ name: 'Ada' });
    expect((engine.getNode('#/0/1') as ControlNode).value).toBeUndefined();
  });

  test('preserves identity of unchanged nodes', () => {
    const engine = createEngine();
    const before = engine.getModel();
    engine.dispatch(setValue('/name', 'Grace'));
    const after = engine.getModel();
    expect(after.version).toBe(before.version + 1);
    expect(after.nodes['#/0/0']).not.toBe(before.nodes['#/0/0']);
    expect(after.nodes['#/0/1']).toBe(before.nodes['#/0/1']);
    expect(after.nodes['#/1']).toBe(before.nodes['#/1']);
    expect(after.nodes['#/0']).toBe(before.nodes['#/0']);
    expect(after.nodes['#']).toBe(before.nodes['#']);
  });

  test('notifies only subscribers of changed nodes', () => {
    const engine = createEngine();
    const nameListener = vi.fn();
    const ageListener = vi.fn();
    engine.subscribeNode('#/0/0', nameListener);
    engine.subscribeNode('#/0/1', ageListener);
    engine.dispatch(setValue('/name', 'Grace'));
    expect(nameListener).toHaveBeenCalledTimes(1);
    expect(ageListener).not.toHaveBeenCalled();
  });

  test('emits deltas with upserted nodes and current data', () => {
    const engine = createEngine();
    const deltas: unknown[] = [];
    engine.subscribe((delta) => deltas.push(delta));
    engine.dispatch(setValue('/name', 'Grace'));
    expect(deltas).toHaveLength(1);
    const delta = deltas[0] as {
      upserted: ControlNode[];
      data: unknown;
      removed: string[];
    };
    expect(delta.upserted.map((node) => node.id)).toEqual(['#/0/0']);
    expect(delta.removed).toEqual([]);
    expect(delta.data).toEqual({ name: 'Grace', age: 36 });
  });

  test('unsubscribing stops notifications', () => {
    const engine = createEngine();
    const listener = vi.fn();
    const unsubscribe = engine.subscribeNode('#/0/0', listener);
    unsubscribe();
    engine.dispatch(setValue('/name', 'Grace'));
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('touch', () => {
  test('marks only the touched node', () => {
    const engine = createEngine();
    const before = engine.getModel();
    engine.dispatch(touch('#/0/0'));
    const after = engine.getModel();
    expect((after.nodes['#/0/0'] as ControlNode).touched).toBe(true);
    expect(after.nodes['#/0/1']).toBe(before.nodes['#/0/1']);
  });

  test('touching twice is a no-op', () => {
    const engine = createEngine();
    engine.dispatch(touch('#/0/0'));
    const version = engine.getModel().version;
    engine.dispatch(touch('#/0/0'));
    expect(engine.getModel().version).toBe(version);
  });
});

describe('validation', () => {
  const lengthValidator: FormValidator = {
    validate: (data) => {
      const name = (data as { name?: unknown })?.name;
      return typeof name === 'string' && name.length >= 2
        ? []
        : [
            {
              path: '/name',
              severity: 'error',
              key: 'minLength',
              message: 'Too short.',
            },
          ];
    },
  };

  test('shows issues immediately by default', () => {
    const engine = createEngine({
      data: { name: 'A' },
      validator: lengthValidator,
    });
    expect((engine.getNode('#/0/0') as ControlNode).issues).toEqual([
      { severity: 'error', key: 'minLength', message: 'Too short.' },
    ]);
    expect((engine.getNode('#/0/1') as ControlNode).issues).toEqual([]);
  });

  test('config.showIssuesOnTouch gates issues behind interaction', () => {
    const engine = createEngine({
      data: { name: 'A' },
      validator: lengthValidator,
      config: { showIssuesOnTouch: true },
    });
    expect((engine.getNode('#/0/0') as ControlNode).issues).toEqual([]);
    engine.dispatch(touch('#/0/0'));
    expect((engine.getNode('#/0/0') as ControlNode).issues).toEqual([
      { severity: 'error', key: 'minLength', message: 'Too short.' },
    ]);
  });

  test('an explicit issueDisplay policy overrides the config', () => {
    const engine = createEngine({
      data: { name: 'A' },
      validator: lengthValidator,
      config: { showIssuesOnTouch: true },
      issueDisplay: alwaysShowIssues,
    });
    expect((engine.getNode('#/0/0') as ControlNode).issues).toHaveLength(1);
  });

  test('clears issues once the data is fixed', () => {
    const engine = createEngine({
      data: { name: 'A' },
      validator: lengthValidator,
    });
    engine.dispatch(setValue('/name', 'Ada'));
    expect((engine.getNode('#/0/0') as ControlNode).issues).toEqual([]);
  });

  test('applies async validation results as a follow-up update', async () => {
    const asyncValidator: FormValidator = {
      validate: async (data) => lengthValidator.validate(data),
    };
    const engine = createEngine({
      data: { name: 'A' },
      validator: asyncValidator,
    });
    expect((engine.getNode('#/0/0') as ControlNode).issues).toEqual([]);
    await vi.waitFor(() => {
      expect((engine.getNode('#/0/0') as ControlNode).issues).toHaveLength(1);
    });
  });
});

describe('node processors', () => {
  test('run for every node during builds', () => {
    const shout: NodeProcessor = (node) =>
      isControlNode(node) ? { ...node, label: node.label.toUpperCase() } : node;
    const engine = createEngine({ processors: [shout] });
    expect((engine.getNode('#/0/0') as ControlNode).label).toBe('NAME');
    engine.dispatch(setValue('/name', 'Grace'));
    expect((engine.getNode('#/0/0') as ControlNode).label).toBe('NAME');
  });
});
