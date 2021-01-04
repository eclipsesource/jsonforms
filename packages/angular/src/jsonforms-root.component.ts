/*
  The MIT License

  Copyright (c) 2017-2020 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import {
    Component,
    EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import { Actions, JsonFormsRendererRegistryEntry, JsonSchema, UISchemaElement, UISchemaTester, ValidationMode } from '@jsonforms/core';
import { Ajv, ErrorObject } from 'ajv';
import { JsonFormsAngularService, USE_STATE_VALUE } from './jsonforms.service';
@Component({
    selector: 'jsonforms',
    template: '<jsonforms-outlet></jsonforms-outlet>',
    providers: [JsonFormsAngularService]
})
export class JsonForms implements OnChanges, OnInit {

    @Input() uischema: UISchemaElement;
    @Input() schema: JsonSchema;
    @Input() data: any;
    @Input() renderers: JsonFormsRendererRegistryEntry[];
    @Input() uischemas: { tester: UISchemaTester; uischema: UISchemaElement; }[];
    @Output() dataChange = new EventEmitter<any>();
    @Input() locale: string;
    @Input() readonly: boolean;
    @Input() validationMode: ValidationMode;
    @Input() ajv: Ajv;
    @Input() config: any;
    @Output() errors = new EventEmitter<ErrorObject[]>();

    private previousData:any;
    private previousErrors:ErrorObject[];

    private initialized = false;

    constructor(private jsonformsService: JsonFormsAngularService) {
    }

    ngOnInit(): void {
        this.jsonformsService.init({
            core: {
                data: this.data,
                uischema: this.uischema,
                schema: this.schema,
                ajv: this.ajv,
                validationMode: this.validationMode
            },
            uischemas: this.uischemas,
            i18n: { locale: this.locale, localizedSchemas: undefined, localizedUISchemas: undefined },
            renderers: this.renderers,
            config: this.config,
            readonly: this.readonly
        });
        this.jsonformsService.$state.subscribe(state => {
            const data = state?.jsonforms?.core?.data;
            const errors = state?.jsonforms?.core?.errors;
            if(this.previousData !== data) {
                this.previousData = data;
                this.dataChange.emit(data);
            }
            if(this.previousErrors !== errors) {
                this.previousErrors = errors;
                this.errors.emit(errors);
            }
        });
        this.initialized = true;
    }

    // tslint:disable-next-line: cyclomatic-complexity
    ngOnChanges(changes: SimpleChanges): void {
        if (!this.initialized) {
            return;
        }
        const newData = changes.data;
        const newSchema = changes.schema;
        const newUiSchema = changes.uischema;
        const newRenderers = changes.renderers;
        const newUischemas = changes.uischemas;
        const newLocale = changes.locale;
        const newReadonly = changes.readonly;
        const newValidationMode = changes.validationMode;
        const newAjv = changes.ajv;
        const newConfig = changes.config;

        if (newData || newSchema || newUiSchema || newValidationMode || newAjv) {
            this.jsonformsService.updateCoreState(
                newData ? newData.currentValue : USE_STATE_VALUE,
                newSchema ? newSchema.currentValue : USE_STATE_VALUE,
                newUiSchema ? newUiSchema.currentValue : USE_STATE_VALUE,
                newAjv ? newAjv.currentValue : USE_STATE_VALUE,
                newValidationMode ? newValidationMode.currentValue : USE_STATE_VALUE
            );
        }

        if (newRenderers && !newRenderers.isFirstChange()) {
            this.jsonformsService.setRenderers(newRenderers.currentValue);
        }

        if (newUischemas && !newUischemas.isFirstChange()) {
            this.jsonformsService.setUiSchemas(newUischemas.currentValue);
        }

        if (newLocale && !newLocale.isFirstChange()) {
            this.jsonformsService.setLocale(newLocale.currentValue);
        }

        if (newReadonly && !newReadonly.isFirstChange()) {
            this.jsonformsService.setReadonly(newReadonly.currentValue);
        }

        if (newConfig && !newConfig.isFirstChange()) {
            this.jsonformsService.updateConfig(Actions.setConfig(newConfig.currentValue));
        }
    }
}
