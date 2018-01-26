import * as React from 'react';

// tslint:disable:variable-name
export const JsonFormsLayout = ({ className, children, visible }) => {
// tslint:enable:variable-name

  return (
    <div
      className={className}
      hidden={visible === undefined || visible === null ? false : !visible}
    >
      {children}
    </div>
  );
};
