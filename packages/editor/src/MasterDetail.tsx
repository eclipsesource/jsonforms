// tslint:disable:max-line-length
import * as React from 'react';
import { Provider } from 'react-redux';
import {
    JsonFormsStore,
    JsonSchema,
    UISchemaElement
} from '@jsonforms/core';
import { SchemaService } from './services/schema.service';
import TreeRenderer from './tree/TreeRenderer';

export class MasterDetail extends React.Component<
    { store: JsonFormsStore,
      schema: JsonSchema,
      uischema: UISchemaElement,
      schemaService: SchemaService
    }> {
    render() {
        const { store, schema, uischema, schemaService } = this.props;
        // const { store } = this.props;

        return (
            <div>
                <Provider store={store}>
                    <TreeRenderer schema={schema} uischema={uischema} schemaService={schemaService}/>
                </Provider>
            </div>
        );
    }
}
