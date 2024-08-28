/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
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
  computeLabel,
  ControlElement,
  JsonFormsState,
  JsonSchema,
  OwnPropsOfControl,
  removeId,
  StatePropsOfControl,
} from '@jsonforms/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { JsonFormsBaseRenderer } from './base.renderer';
import { JsonFormsAngularService } from './jsonforms.service';
import merge from 'lodash/merge';
@Component({
  template: '',
})
export abstract class JsonFormsAbstractControl<
    Props extends StatePropsOfControl
  >
  extends JsonFormsBaseRenderer<ControlElement>
  implements OnInit, OnDestroy
{
  @Input() id: string;
  @Input() disabled: boolean;
  @Input() visible: boolean;

  form: FormControl;
  data: any;
  label: string;
  description: string;
  error: string | null;
  scopedSchema: JsonSchema;
  rootSchema: JsonSchema;
  enabled: boolean;
  hidden: boolean;
  propsPath: string;

  constructor(protected jsonFormsService: JsonFormsAngularService) {
    super();
    this.form = new FormControl(
      {
        value: '',
        disabled: true,
      },
      {
        updateOn: 'change',
        validators: this.validator.bind(this),
      }
    );
  }

  getEventValue = (event: any) => event.value;

  onChange(ev: any) {
    this.jsonFormsService.updateCore(
      Actions.update(this.propsPath, () => this.getEventValue(ev))
    );
    this.triggerValidation();
  }

  shouldShowUnfocusedDescription(): boolean {
    const config = this.jsonFormsService.getConfig();
    const appliedUiSchemaOptions = merge({}, config, this.uischema.options);
    return !!appliedUiSchemaOptions.showUnfocusedDescription;
  }

  ngOnInit() {
    this.addSubscription(
      this.jsonFormsService.$state.subscribe({
        next: (state: JsonFormsState) => {
          const props = this.mapToProps(state);
          const {
            data,
            enabled,
            errors,
            label,
            required,
            schema,
            rootSchema,
            visible,
            path,
            config,
          } = props;
          this.label = computeLabel(
            label,
            required,
            config ? config.hideRequiredAsterisk : false
          );
          this.data = data;
          this.error = errors;
          this.enabled = enabled;
          this.isEnabled() ? this.form.enable() : this.form.disable();
          this.hidden = !visible;
          this.scopedSchema = schema;
          this.rootSchema = rootSchema;
          this.description =
            this.scopedSchema !== undefined
              ? this.scopedSchema.description
              : '';
          this.id = props.id;
          this.form.setValue(data);
          this.propsPath = path;
          this.mapAdditionalProps(props);
        },
      })
    );
    this.triggerValidation();
  }

  validator: ValidatorFn = (_c: AbstractControl): ValidationErrors | null => {
    return this.error ? { error: this.error } : null;
  };

  mapAdditionalProps(_props: Props) {
    // do nothing by default
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    removeId(this.id);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  protected getOwnProps(): OwnPropsOfControl {
    const props: OwnPropsOfControl = {
      uischema: this.uischema,
      schema: this.schema,
      path: this.path,
      id: this.id,
    };
    if (this.disabled !== undefined) {
      props.enabled = !this.disabled;
    }
    if (this.visible !== undefined) {
      props.visible = this.visible;
    }
    return props;
  }

  protected abstract mapToProps(state: JsonFormsState): Props;

  protected triggerValidation() {
    // these cause the correct update of the error underline, seems to be
    // related to ionic-team/ionic#11640
    this.form.markAsTouched();
    this.form.updateValueAndValidity();
  }
}
