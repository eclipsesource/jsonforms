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
    Actions,
    configReducer,
    CoreActions,
    coreReducer,
    generateDefaultUISchema,
    generateJsonSchema,
    i18nReducer,
    JsonFormsRendererRegistryEntry,
    JsonFormsState,
    JsonFormsSubStates,
    JsonSchema,
    I18nActions,
    RankedTester,
    setConfig,
    SetConfigAction,
    UISchemaActions,
    UISchemaElement,
    uischemaRegistryReducer,
    UISchemaTester,
    ValidationMode,
    updateI18n
} from '@jsonforms/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JsonFormsBaseRenderer } from './base.renderer';

import { cloneDeep } from 'lodash';
import Ajv, { ErrorObject } from 'ajv';

export const USE_STATE_VALUE = Symbol('Marker to use state value');
export class JsonFormsAngularService {

    private _state: JsonFormsSubStates;
    private state: BehaviorSubject<JsonFormsState>;

    init(initialState: JsonFormsSubStates = { core: { data: undefined, schema: undefined, uischema: undefined, validationMode: 'ValidateAndShow', additionalErrors: undefined } }) {
        this._state = initialState;
        this._state.config = configReducer(undefined, setConfig(this._state.config));
        this._state.i18n = i18nReducer(this._state.i18n, updateI18n(this._state.i18n?.locale, this._state.i18n?.translate, this._state.i18n?.translateError));
        this.state = new BehaviorSubject({ jsonforms: this._state });
        const data = initialState.core.data;
        const schema = initialState.core.schema ?? generateJsonSchema(data);
        const uischema = initialState.core.uischema ?? generateDefaultUISchema(schema);
        this.updateCore(Actions.init(data, schema, uischema));
    }

    get $state(): Observable<JsonFormsState> {
        if (!this.state) {
            throw new Error('Please call init first!');
        }
        return this.state.asObservable();
    }

    /**
     * @deprecated use {@link JsonFormsAngularService.addRenderer}
     */
    registerRenderer(renderer: JsonFormsBaseRenderer<UISchemaElement>, tester: RankedTester): void {
        this.addRenderer(renderer, tester);
    }
    addRenderer(renderer: JsonFormsBaseRenderer<UISchemaElement>, tester: RankedTester): void {
        this._state.renderers.push({ renderer, tester });
        this.updateSubject();
    }

    /**
     * @deprecated use {@link JsonFormsAngularService.setRenderer}
     */
    registerRenderers(renderers: JsonFormsRendererRegistryEntry[]): void {
        this.setRenderers(renderers);
    }
    setRenderers(renderers: JsonFormsRendererRegistryEntry[]): void {
        this._state.renderers = renderers;
        this.updateSubject();
    }

    /**
     * @deprecated use {@link JsonFormsAngularService.removeRenderer}
     */
    unregisterRenderer(tester: RankedTester): void {
        this.removeRenderer(tester);
    }
    removeRenderer(tester: RankedTester): void {
        const findIndex = this._state.renderers.findIndex(v => v.tester === tester);
        if (findIndex === -1) {
            return;
        }
        const renderers = this._state.renderers.filter(v => v.tester !== tester);
        this._state.renderers = renderers;
        this.updateSubject();
    }

    updateValidationMode(validationMode: ValidationMode): void {
        const coreState = coreReducer(this._state.core, Actions.setValidationMode(validationMode));
        this._state.core = coreState;
        this.updateSubject();
    }

    updateI18n<T extends I18nActions>(i18nAction: T): T {
        const i18nState = i18nReducer(this._state.i18n, i18nAction);
        if (i18nState !== this._state.i18n) {
            this._state.i18n = i18nState;
            this.updateSubject();
        }
        return i18nAction;
    }

    updateCore<T extends CoreActions>(coreAction: T): T {
        const coreState = coreReducer(this._state.core, coreAction);
        if (coreState !== this._state.core) {
            this._state.core = coreState;
            this.updateSubject();
        }
        return coreAction;
    }

    /**
     * @deprecated use {@link JsonFormsAngularService.setUiSchemas}
     */
    updateUiSchema<T extends UISchemaActions>(uischemaAction: T): T {
        const uischemaState = uischemaRegistryReducer(this._state.uischemas, uischemaAction);
        this._state.uischemas = uischemaState;
        this.updateSubject();
        return uischemaAction;
    }

    setUiSchemas(uischemas: { tester: UISchemaTester; uischema: UISchemaElement; }[]): void {
        this._state.uischemas = uischemas;
        this.updateSubject();
    }

    updateConfig<T extends SetConfigAction>(setConfigAction: T): T {
        const configState = configReducer(this._state.config, setConfigAction);
        this._state.config = configState;
        this.updateSubject();
        return setConfigAction;
    }

    setUiSchema(uischema: UISchemaElement | undefined): void {
        const newUiSchema = uischema ?? generateDefaultUISchema(this._state.core.schema);
        const coreState = coreReducer(this._state.core, Actions.updateCore(this._state.core.data, this._state.core.schema, newUiSchema));
        if(coreState !== this._state.core) {
            this._state.core = coreState;
            this.updateSubject();
        }
    }

    setSchema(schema: JsonSchema | undefined): void {
        const coreState = coreReducer(this._state.core,
            Actions.updateCore(this._state.core.data, schema ?? generateJsonSchema(this._state.core.data), this._state.core.uischema)
        );
        if(coreState !== this._state.core) {
            this._state.core = coreState;
            this.updateSubject();
        }
    }

    setData(data: any): void {
        const coreState = coreReducer(this._state.core, Actions.updateCore(data, this._state.core.schema, this._state.core.uischema));
        if(coreState !== this._state.core) {
            this._state.core = coreState;
            this.updateSubject();
        }
    }

    setLocale(locale: string): void {
        this._state.i18n.locale = locale;
        this.updateSubject();
    }

    setReadonly(readonly: boolean): void {
        this._state.readonly = readonly;
        this.updateSubject();
    }

    getState(): JsonFormsState {
        return cloneDeep({ jsonforms: this._state });
    }

    refresh(): void {
        this.updateSubject();
    }

    updateCoreState(
        data: any | typeof USE_STATE_VALUE,
        schema: JsonSchema | typeof USE_STATE_VALUE,
        uischema: UISchemaElement | typeof USE_STATE_VALUE,
        ajv: Ajv | typeof USE_STATE_VALUE,
        validationMode: ValidationMode | typeof USE_STATE_VALUE,
        additionalErrors: ErrorObject[] | typeof USE_STATE_VALUE,
    ): void {
        const newData = data === USE_STATE_VALUE ? this._state.core.data : data;
        const newSchema = schema === USE_STATE_VALUE ? this._state.core.schema : schema ?? generateJsonSchema(newData);
        const newUischema = uischema === USE_STATE_VALUE ? this._state.core.uischema : uischema ?? generateDefaultUISchema(newSchema);
        const newAjv = ajv === USE_STATE_VALUE ? this._state.core.ajv : ajv;
        const newValidationMode = validationMode === USE_STATE_VALUE ? this._state.core.validationMode : validationMode;
        const newAdditionalErrors = additionalErrors === USE_STATE_VALUE ? this._state.core.additionalErrors : additionalErrors;
        this.updateCore(
            Actions.updateCore(newData, newSchema, newUischema, {ajv: newAjv, validationMode: newValidationMode, additionalErrors: newAdditionalErrors})
        );
    }

    private updateSubject(): void {
        this.state.next({ jsonforms: this._state });
    }

}
