import * as React from 'react';
import * as _ from 'lodash';
import {
  composePaths,
  Generate,
  JsonForms,
} from '@jsonforms/core';

export const ArrayControl  =
  ({ classNames, data, label, path, resolvedSchema, onAdd }) => {

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
              data ? _.range(0, data.length).map(index => {

                const generatedUi = Generate.uiSchema(resolvedSchema, 'HorizontalLayout');
                const childPath = composePaths(path, `${index}`);

                return (
                  <JsonForms
                    schema={resolvedSchema}
                    uischema={generatedUi}
                    path={childPath}
                    key={childPath}
                  />
                );
              }) : <p>No data</p>
            }
          </div>
        </fieldset>
      </div>
    );
  };
