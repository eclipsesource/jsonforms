import type { NodeRendererProps } from '@jsonforms/react';
import { NodeDispatch, useLayoutNode } from '@jsonforms/react';

/**
 * Renders vertical and horizontal layouts as flex containers. Only the flex
 * direction is set inline; everything else is styleable via the `jf-` classes.
 */
export const VanillaLayout = ({ id }: NodeRendererProps) => {
  const node = useLayoutNode(id);
  const horizontal = node.direction === 'horizontal';
  return (
    <div className={`jf-layout jf-layout--${node.direction}`}>
      {node.label !== undefined && (
        <div className="jf-layout-label">{node.label}</div>
      )}
      <div
        className="jf-layout-items"
        style={{
          display: 'flex',
          flexDirection: horizontal ? 'row' : 'column',
          gap: '1rem',
        }}
      >
        {node.children.map((childId) => (
          <div
            key={childId}
            className="jf-layout-item"
            style={horizontal ? { flex: 1, minWidth: 0 } : undefined}
          >
            <NodeDispatch id={childId} />
          </div>
        ))}
      </div>
    </div>
  );
};
