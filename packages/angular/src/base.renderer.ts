import { Input } from '@angular/core';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';

export class JsonFormsBaseRenderer  {
    @Input() uischema: UISchemaElement;
    @Input() schema: JsonSchema;

    protected getOwnProps() {
        return {
            uischema: this.uischema,
            schema: this.schema
        };
    }
}
