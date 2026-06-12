import type {
  LayoutDirection,
  PresentationNode,
  ValueType,
} from './model/nodes';
import { isControlNode, isLayoutNode } from './model/nodes';

export const NOT_APPLICABLE = -1;

/**
 * Ranks how well a renderer fits a presentation node. Testers only ever see the
 * node — never schemas — which keeps them fast and schema-format independent.
 */
export type NodeTester = (node: PresentationNode) => number;

export type NodePredicate = (node: PresentationNode) => boolean;

export const rankWith =
  (rank: number, predicate: NodePredicate): NodeTester =>
  (node) =>
    predicate(node) ? rank : NOT_APPLICABLE;

export const and =
  (...predicates: readonly NodePredicate[]): NodePredicate =>
  (node) =>
    predicates.every((predicate) => predicate(node));

export const or =
  (...predicates: readonly NodePredicate[]): NodePredicate =>
  (node) =>
    predicates.some((predicate) => predicate(node));

export const isControl: NodePredicate = isControlNode;

export const isLayout: NodePredicate = isLayoutNode;

export const valueTypeIs =
  (valueType: ValueType): NodePredicate =>
  (node) =>
    isControlNode(node) && node.valueType === valueType;

export const directionIs =
  (direction: LayoutDirection): NodePredicate =>
  (node) =>
    isLayoutNode(node) && node.direction === direction;

export const isStringControl = valueTypeIs('string');
export const isBooleanControl = valueTypeIs('boolean');
export const isNumericControl = or(
  valueTypeIs('number'),
  valueTypeIs('integer'),
);
export const isVerticalLayout = directionIs('vertical');
export const isHorizontalLayout = directionIs('horizontal');
