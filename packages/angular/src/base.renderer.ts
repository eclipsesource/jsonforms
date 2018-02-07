import { Input } from '@angular/core';
import { UISchemaElement } from '@jsonforms/core';

export class JsonFormsBaseRenderer  {
    @Input() uischema: UISchemaElement;

    protected getOwnProps() {
        return {
            uischema: this.uischema
        };
    }
}
