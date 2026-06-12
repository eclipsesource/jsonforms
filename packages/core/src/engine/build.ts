import type {
  ControlConstraints,
  ControlNode,
  DataPath,
  FormIssue,
  LayoutNode,
  NodeId,
  PresentationModel,
  PresentationNode,
} from '../model/nodes';
import type {
  ControlElement,
  LayoutElement,
  UISchemaElement,
} from '../model/uischema';
import type { SchemaSource } from '../schema/source';
import type { ValidationIssue } from '../validation/validation';
import type { IssueDisplayPolicy } from './issue-display';
import { getAtPointer, parsePointer } from '../util/pointer';
import { humanizeName } from '../util/strings';

/** Context handed to {@link NodeProcessor}s. */
export interface BuildContext {
  data: unknown;
  source: SchemaSource;
}

/**
 * Cross-cutting customization hook: every node flows through the configured
 * processor chain during each build. Processors must return serializable nodes
 * and must not mutate their input.
 */
export type NodeProcessor = (
  node: PresentationNode,
  context: BuildContext,
) => PresentationNode;

export interface BuildInput {
  uischema: UISchemaElement;
  data: unknown;
  source: SchemaSource;
  issues: readonly ValidationIssue[];
  issueDisplay: IssueDisplayPolicy;
  touched: ReadonlySet<NodeId>;
  processors: readonly NodeProcessor[];
  /** Previous model for identity preservation of unchanged nodes. */
  previous?: PresentationModel;
  version: number;
}

export const ROOT_NODE_ID: NodeId = '#';

const NO_ISSUES: readonly FormIssue[] = Object.freeze([]);
const NO_OPTIONS: Readonly<Record<string, unknown>> = Object.freeze({});
const NO_CONSTRAINTS: Readonly<ControlConstraints> = Object.freeze({});

/**
 * Pure builder: walks the UI structure and produces the presentation model.
 * Nodes that are structurally equal to their counterpart in `previous` keep
 * their object identity, so subscribers can skip work for unchanged nodes.
 */
export const buildModel = (input: BuildInput): PresentationModel => {
  const nodes: Record<NodeId, PresentationNode> = {};
  const issuesByPath = groupIssuesByPath(input.issues);
  const context: BuildContext = { data: input.data, source: input.source };

  const commit = (candidate: PresentationNode): NodeId => {
    const processed = input.processors.reduce(
      (node, process) => process(node, context),
      candidate,
    );
    const previous = input.previous?.nodes[processed.id];
    nodes[processed.id] =
      previous !== undefined && nodesEqual(previous, processed)
        ? previous
        : processed;
    return processed.id;
  };

  const buildElement = (
    element: UISchemaElement,
    id: NodeId,
    parent: NodeId | undefined,
  ): NodeId =>
    element.type === 'Control'
      ? commit(buildControl(element, id, parent))
      : commit(buildLayout(element, id, parent));

  const buildLayout = (
    element: LayoutElement,
    id: NodeId,
    parent: NodeId | undefined,
  ): LayoutNode => ({
    id,
    kind: 'layout',
    ...(parent !== undefined && { parent }),
    uiOptions: element.options ?? NO_OPTIONS,
    direction: element.type === 'HorizontalLayout' ? 'horizontal' : 'vertical',
    ...(element.label !== undefined && { label: element.label }),
    children: element.elements.map((child, index) =>
      buildElement(child, `${id}/${index}`, id),
    ),
  });

  const buildControl = (
    element: ControlElement,
    id: NodeId,
    parent: NodeId | undefined,
  ): ControlNode => {
    const facets = input.source.describe(element.scope);
    const path = input.source.dataPathFor(element.scope);
    const touched = input.touched.has(id);
    const readOnly = facets?.readOnly === true;
    // Configuration issues bypass the display policy — they must always show.
    const issues: readonly FormIssue[] =
      facets === undefined
        ? [
            {
              severity: 'error',
              key: 'unknown-scope',
              message: `No schema information found for scope '${element.scope}'.`,
            },
          ]
        : input.issueDisplay(issuesByPath.get(path) ?? NO_ISSUES, { touched });
    return {
      id,
      kind: 'control',
      ...(parent !== undefined && { parent }),
      uiOptions: element.options ?? NO_OPTIONS,
      path,
      value: getAtPointer(input.data, path),
      valueType: facets?.valueType ?? 'unknown',
      label: element.label ?? facets?.title ?? humanizeName(lastSegment(path)),
      ...(facets?.description !== undefined && {
        description: facets.description,
      }),
      ...(input.source.isRequired(element.scope) && { required: true }),
      ...(readOnly && { readonly: true, disabled: true }),
      ...(touched && { touched: true }),
      issues,
      constraints: facets?.constraints ?? NO_CONSTRAINTS,
    };
  };

  const rootId = buildElement(input.uischema, ROOT_NODE_ID, undefined);
  return { version: input.version, rootId, nodes };
};

const lastSegment = (path: DataPath): string => {
  const segments = parsePointer(path);
  return segments[segments.length - 1] ?? '';
};

const groupIssuesByPath = (
  issues: readonly ValidationIssue[],
): Map<DataPath, FormIssue[]> => {
  const grouped = new Map<DataPath, FormIssue[]>();
  for (const issue of issues) {
    const formIssue: FormIssue = {
      severity: issue.severity,
      message: issue.message,
      ...(issue.key !== undefined && { key: issue.key }),
    };
    const existing = grouped.get(issue.path);
    if (existing) {
      existing.push(formIssue);
    } else {
      grouped.set(issue.path, [formIssue]);
    }
  }
  return grouped;
};

/** Structural equality of nodes — the basis for identity preservation. */
export const nodesEqual = (a: PresentationNode, b: PresentationNode): boolean =>
  structurallyEqual(a, b);

const structurallyEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((value, index) => structurallyEqual(value, b[index]))
    );
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = Object.keys(a).filter((key) => a[key] !== undefined);
    const bKeys = Object.keys(b).filter((key) => b[key] !== undefined);
    return (
      aKeys.length === bKeys.length &&
      aKeys.every((key) => structurallyEqual(a[key], b[key]))
    );
  }
  return false;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
