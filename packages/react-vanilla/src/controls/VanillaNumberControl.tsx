import type { NodeRendererProps } from '@jsonforms/react';
import { useControlDispatch, useControlNode } from '@jsonforms/react';

export const VanillaNumberControl = ({ id }: NodeRendererProps) => {
  const node = useControlNode(id);
  const { setValue, touch } = useControlDispatch(node);
  const hasIssues = node.issues.length > 0;
  const hint = node.issues[0]?.message ?? node.description;
  const step =
    node.constraints.multipleOf ?? (node.valueType === 'integer' ? 1 : 'any');
  return (
    <div
      className={`jf-control jf-control--number${
        hasIssues ? ' jf-control--invalid' : ''
      }`}
    >
      <label className="jf-label" htmlFor={node.id}>
        {node.label}
        {node.required === true && (
          <span className="jf-required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={node.id}
        className="jf-input"
        type="number"
        value={typeof node.value === 'number' ? node.value : ''}
        min={node.constraints.minimum}
        max={node.constraints.maximum}
        step={step}
        required={node.required}
        disabled={node.disabled}
        readOnly={node.readonly}
        onChange={(event) => {
          const raw = event.target.value;
          setValue(raw === '' ? undefined : Number(raw));
        }}
        onBlur={touch}
      />
      {hint !== undefined && (
        <p className={hasIssues ? 'jf-issues' : 'jf-description'}>{hint}</p>
      )}
    </div>
  );
};
