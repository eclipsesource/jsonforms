import * as React from 'react';
import { Provider } from 'react-redux';
import {
    JsonFormsStore,
    JsonSchema,
    UISchemaElement
} from '@jsonforms/core';
import { SchemaService } from './services/schema.service';
import TreeRenderer from './tree/TreeRenderer';

/**
 * Wrapper component for the TreeRenderer which provides it with a redux store.
 */
export class MasterDetail extends React.Component<
    { store: JsonFormsStore,
      schema: JsonSchema,
      uischema: UISchemaElement,
      schemaService: SchemaService
    }> {
    render() {
        const { store, schema, uischema, schemaService } = this.props;

        return (
            <div>
                <Provider store={store}>
                    <TreeRenderer
                      schema={schema}
                      uischema={uischema}
                      schemaService={schemaService}/>
                </Provider>
            </div>
        );
    }
}
