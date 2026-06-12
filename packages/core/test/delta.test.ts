import { describe, expect, test } from 'vitest';
import type { ModelDelta, PresentationModel, UISchemaElement } from '../src';
import {
  applyDelta,
  createFormEngine,
  jsonSchemaSource,
  setValue,
  type JsonSchema,
} from '../src';

const schema: JsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Name' },
    age: { type: 'integer', title: 'Age' },
  },
};

const uischema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/name' },
    { type: 'Control', scope: '#/properties/age' },
  ],
};

describe('applyDelta', () => {
  test('reproduces the engine model on a serialized copy', () => {
    const engine = createFormEngine({
      schemaSource: jsonSchemaSource(schema),
      uischema,
      data: { name: 'Ada' },
    });
    // A remote client only ever sees serialized models and deltas.
    const remoteModel = JSON.parse(
      JSON.stringify(engine.getModel()),
    ) as PresentationModel;
    const deltas: ModelDelta[] = [];
    engine.subscribe((delta) =>
      deltas.push(JSON.parse(JSON.stringify(delta)) as ModelDelta),
    );

    engine.dispatch(setValue('/name', 'Grace'));
    const next = applyDelta(remoteModel, deltas[0] as ModelDelta);

    expect(next).toEqual(engine.getModel());
    expect(next.version).toBe(remoteModel.version + 1);
  });

  test('preserves identity of untouched nodes', () => {
    const engine = createFormEngine({
      schemaSource: jsonSchemaSource(schema),
      uischema,
      data: { name: 'Ada' },
    });
    const remoteModel = JSON.parse(
      JSON.stringify(engine.getModel()),
    ) as PresentationModel;
    let delta: ModelDelta | undefined;
    engine.subscribe((emitted) => {
      delta = emitted;
    });

    engine.dispatch(setValue('/name', 'Grace'));
    const next = applyDelta(remoteModel, delta as ModelDelta);

    expect(next.nodes['#/0']).not.toBe(remoteModel.nodes['#/0']);
    expect(next.nodes['#/1']).toBe(remoteModel.nodes['#/1']);
    expect(next.nodes['#']).toBe(remoteModel.nodes['#']);
  });

  test('removes nodes listed in the delta', () => {
    const model: PresentationModel = {
      version: 1,
      rootId: '#',
      nodes: {
        '#': {
          id: '#',
          kind: 'layout',
          direction: 'vertical',
          uiOptions: {},
          children: [],
        },
        '#/0': {
          id: '#/0',
          kind: 'control',
          uiOptions: {},
          path: '/name',
          value: 'Ada',
          valueType: 'string',
          label: 'Name',
          issues: [],
          constraints: {},
        },
      },
    };
    const next = applyDelta(model, {
      version: 2,
      upserted: [],
      removed: ['#/0'],
      data: {},
    });
    expect(Object.keys(next.nodes)).toEqual(['#']);
  });
});
