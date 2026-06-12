import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { JsonSchema, UISchemaElement } from '@jsonforms/core';
import {
  createFormEngine,
  isControl,
  isLayout,
  jsonSchemaSource,
  rankWith,
} from '@jsonforms/core';
import type { NodeRendererProps, RendererRegistryEntry } from '../src';
import {
  JsonForms,
  NodeDispatch,
  useControlDispatch,
  useControlNode,
  useLayoutNode,
} from '../src';

const TestLayout = ({ id }: NodeRendererProps) => {
  const node = useLayoutNode(id);
  return (
    <div data-testid={node.id}>
      {node.children.map((childId) => (
        <NodeDispatch key={childId} id={childId} />
      ))}
    </div>
  );
};

const TestControl = ({ id }: NodeRendererProps) => {
  const node = useControlNode(id);
  const { setValue, touch } = useControlDispatch(node);
  return (
    <label>
      {node.label}
      <input
        value={typeof node.value === 'string' ? node.value : ''}
        onChange={(event) => setValue(event.target.value)}
        onBlur={touch}
      />
    </label>
  );
};

const renderers: RendererRegistryEntry[] = [
  { tester: rankWith(1, isLayout), renderer: TestLayout },
  { tester: rankWith(1, isControl), renderer: TestControl },
];

const schema: JsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Name' },
  },
};

const uischema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [{ type: 'Control', scope: '#/properties/name' }],
};

describe('JsonForms', () => {
  test('renders controls through the registry', () => {
    render(
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={{ name: 'Ada' }}
        renderers={renderers}
      />,
    );
    expect(screen.getByLabelText('Name')).toHaveProperty('value', 'Ada');
  });

  test('edits dispatch commands and emit onChange', () => {
    const onChange = vi.fn();
    render(
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={{ name: 'Ada' }}
        renderers={renderers}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Grace' },
    });
    expect(screen.getByLabelText('Name')).toHaveProperty('value', 'Grace');
    const lastCall = onChange.mock.calls.at(-1)?.[0] as { data: unknown };
    expect(lastCall.data).toEqual({ name: 'Grace' });
  });

  test('useControlDispatch carries the node as provenance', () => {
    const engine = createFormEngine({
      schemaSource: jsonSchemaSource(schema),
      uischema,
      data: {},
    });
    const dispatchSpy = vi.spyOn(engine, 'dispatch');
    render(<JsonForms engine={engine} renderers={renderers} />);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'G' },
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'set-value',
      path: '/name',
      value: 'G',
      sourceNodeId: '#/0',
    });
    fireEvent.blur(screen.getByLabelText('Name'));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'touch',
      nodeId: '#/0',
      sourceNodeId: '#/0',
    });
  });

  test('renders a hint for nodes without a matching renderer', () => {
    render(
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={{}}
        renderers={[{ tester: rankWith(1, isLayout), renderer: TestLayout }]}
      />,
    );
    expect(screen.getByRole('note').textContent).toContain(
      'No renderer registered',
    );
  });
});
