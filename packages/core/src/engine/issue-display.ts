import type { FormIssue } from '../model/nodes';

export interface IssueDisplayContext {
  /** Whether the user has interacted with the control. */
  touched: boolean;
}

/**
 * Decides which of a control's validation issues land on the node — and are
 * therefore displayed by renderers. The policy runs centrally in the builder,
 * so renderers never combine interaction state with issues themselves.
 *
 * Configuration issues raised by the builder itself (e.g. unknown scopes)
 * bypass this policy.
 */
export type IssueDisplayPolicy = (
  issues: readonly FormIssue[],
  context: IssueDisplayContext,
) => readonly FormIssue[];

const NO_ISSUES: readonly FormIssue[] = Object.freeze([]);

/** Default: issues appear once the user has interacted with the control. */
export const showIssuesWhenTouched: IssueDisplayPolicy = (
  issues,
  { touched },
) => (touched ? issues : NO_ISSUES);

/** Issues are always displayed, regardless of interaction state. */
export const alwaysShowIssues: IssueDisplayPolicy = (issues) => issues;
