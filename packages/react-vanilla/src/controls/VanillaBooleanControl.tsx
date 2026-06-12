import type { NodeRendererProps } from '@jsonforms/react';
import { useControlDispatch, useControlNode } from '@jsonforms/react';

export const VanillaBooleanControl = ({ id }: NodeRendererProps) => {
  const node = useControlNode(id);
  const { setValue, touch } = useControlDispatch(node);
  const hasIssues = node.issues.length > 0;
  const hint = node.issues[0]?.message ?? node.description;
  return (
    <div
      className={`jf-control jf-control--boolean${
        hasIssues ? ' jf-control--invalid' : ''
      }`}
    >
      <label className="jf-label jf-label--checkbox" htmlFor={node.id}>
        <input
          id={node.id}
          className="jf-checkbox"
          type="checkbox"
          checked={node.value === true}
          required={node.required}
          disabled={node.disabled}
          onChange={(event) => setValue(event.target.checked)}
          onBlur={touch}
        />
        {node.label}
        {node.required === true && (
          <span className="jf-required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {hint !== undefined && (
        <p className={hasIssues ? 'jf-issues' : 'jf-description'}>{hint}</p>
      )}
    </div>
  );
};
