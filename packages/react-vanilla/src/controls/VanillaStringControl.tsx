import type { ChangeEvent } from 'react';
import type { NodeRendererProps } from '@jsonforms/react';
import { useControlDispatch, useControlNode } from '@jsonforms/react';

export const VanillaStringControl = ({ id }: NodeRendererProps) => {
  const node = useControlNode(id);
  const { setValue, touch } = useControlDispatch(node);
  const hasIssues = node.issues.length > 0;
  const hint = node.issues[0]?.message ?? node.description;
  const multiline = node.uiOptions['multi'] === true;
  const value = typeof node.value === 'string' ? node.value : '';
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValue(event.target.value === '' ? undefined : event.target.value);
  return (
    <div
      className={`jf-control jf-control--string${
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
      {multiline ? (
        <textarea
          id={node.id}
          className="jf-input jf-input--multiline"
          value={value}
          rows={3}
          maxLength={node.constraints.maxLength}
          required={node.required}
          disabled={node.disabled}
          readOnly={node.readonly}
          onChange={handleChange}
          onBlur={touch}
        />
      ) : (
        <input
          id={node.id}
          className="jf-input"
          type="text"
          value={value}
          maxLength={node.constraints.maxLength}
          required={node.required}
          disabled={node.disabled}
          readOnly={node.readonly}
          onChange={handleChange}
          onBlur={touch}
        />
      )}
      {hint !== undefined && (
        <p className={hasIssues ? 'jf-issues' : 'jf-description'}>{hint}</p>
      )}
    </div>
  );
};
