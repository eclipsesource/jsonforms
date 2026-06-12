/**
 * Stable identifier of a presentation node. Derived from the structural position
 * of the corresponding UI schema element, e.g. `#/0/2`.
 */
export type NodeId = string;

/** JSON Pointer (RFC 6901) into the form data, e.g. `/address/street`. */
export type DataPath = string;

/**
 * Abstract classification of the value a control edits. Derived from the schema
 * by the active {@link import('../schema/source').SchemaSource}.
 */
export type ValueType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'unknown';

export type IssueSeverity = 'error' | 'warning' | 'info';

/** A validation (or build) issue attached to a node, ready to display. */
export interface FormIssue {
  severity: IssueSeverity;
  /** Final, ready-to-display message. */
  message: string;
  /** Stable key identifying the kind of issue, e.g. the validation keyword. */
  key?: string;
}

/** Widget-relevant constraints, abstracted away from any schema dialect. */
export interface ControlConstraints {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
}

/**
 * All boolean flags on nodes are optional and default to `false`: builders only
 * set them when they apply, which keeps construction simple and serialized
 * models lean.
 */
export interface PresentationNodeBase {
  id: NodeId;
  kind: string;
  parent?: NodeId;
  /** Excluded from rendering. Absent means visible. */
  hidden?: boolean;
  /** Interaction is disabled. Absent means enabled. */
  disabled?: boolean;
  /** Renderer hints from the UI schema element's `options`. */
  uiOptions: Readonly<Record<string, unknown>>;
  /** Open extension bag for {@link import('../engine/build').NodeProcessor}s. */
  annotations?: Readonly<Record<string, unknown>>;
}

/** A node representing a single editable value. */
export interface ControlNode extends PresentationNodeBase {
  kind: 'control';
  path: DataPath;
  value: unknown;
  valueType: ValueType;
  /** Final label (UI schema override, schema title, or derived from the property name). */
  label: string;
  description?: string;
  /** A value is required. Absent means optional. */
  required?: boolean;
  /** The value is shown but not editable. Absent means editable. */
  readonly?: boolean;
  /** The user has interacted with this control (see the `touch` command). */
  touched?: boolean;
  /**
   * Issues to display, as selected by the engine's issue-display policy.
   * Renderers show these unconditionally.
   */
  issues: readonly FormIssue[];
  constraints: Readonly<ControlConstraints>;
}

export type LayoutDirection = 'vertical' | 'horizontal';

/** A node grouping child nodes without binding data itself. */
export interface LayoutNode extends PresentationNodeBase {
  kind: 'layout';
  direction: LayoutDirection;
  label?: string;
  children: readonly NodeId[];
}

export type PresentationNode = ControlNode | LayoutNode;

/**
 * The presentation model: a versioned, normalized, serializable collection of
 * nodes mirroring the rendered form.
 */
export interface PresentationModel {
  /** Monotonically increasing per update. */
  version: number;
  rootId: NodeId;
  nodes: Readonly<Record<NodeId, PresentationNode>>;
}

export const isControlNode = (node: PresentationNode): node is ControlNode =>
  node.kind === 'control';

export const isLayoutNode = (node: PresentationNode): node is LayoutNode =>
  node.kind === 'layout';
