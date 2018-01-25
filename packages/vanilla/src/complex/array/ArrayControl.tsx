import * as React from 'react';
import {
  Generate,
  composePaths,
  DispatchRenderer
} from '@jsonforms/core';

export const ArrayControl  =
  ({ classNames, data, label, path, resolvedSchema, onAdd, config }) => {

    return (
      <div className={classNames.wrapper}>
        <fieldset className={classNames.fieldSet}>
          <legend>
            <button
              className={classNames.button}
              onClick={onAdd}
            >
              +
            </button>
            <label className={'array.label'}>
              {label}
            </label>
          </legend>
          <div className={classNames.children}>
            {
              data ? data.map((_child, index) => {

                const generatedUi = Generate.uiSchema(resolvedSchema, 'HorizontalLayout');
                const childPath = composePaths(path, index + '');

                return (
                  <DispatchRenderer
                    schema={resolvedSchema}
                    uischema={generatedUi}
                    path={childPath}
                    key={childPath}
                    config={config}
                  />
                );
              }) : <p>No data</p>
            }
          </div>
        </fieldset>
      </div>
    );
  };
