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
  composeWithUi,
  computeLabel,
  ControlElement,
  isPlainLabel,
  JsonFormsState,
  JsonSchema,
  OwnPropsOfControl,
  StatePropsOfControl
} from '@jsonforms/core';
import { Input, OnDestroy, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { JsonFormsBaseRenderer } from './base.renderer';

export abstract class JsonFormsAbstractControl<
  Props extends StatePropsOfControl
> extends JsonFormsBaseRenderer<ControlElement> implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() disabled: boolean;
  @Input() visible: boolean;

  form: FormControl;
  subscription: Subscription;
  data: any;
  label: string;
  description: string;
  error: string | null;
  scopedSchema: JsonSchema;
  rootSchema: JsonSchema;
  enabled: boolean;
  hidden: boolean;

  constructor(protected ngRedux: NgRedux<JsonFormsState>) {
    super();
    this.form = new FormControl(
      {
        value: '',
        disabled: true
      },
      {
        updateOn: 'change',
        validators: this.validator.bind(this)
      }
    );
  }

  getEventValue = (event: any) => event.value;

  onChange(ev: any) {
    const path = composeWithUi(this.uischema, this.path);
    this.ngRedux.dispatch(Actions.update(path, () => this.getEventValue(ev)));
    this.triggerValidation();
  }

  ngOnInit() {
    this.subscription = this.ngRedux
      .select()
      .subscribe((state: JsonFormsState) => {
        const props = this.mapToProps(state);
        const {
          data,
          enabled,
          errors,
          label,
          required,
          schema,
          rootSchema,
          visible
        } = props;
        this.label = computeLabel(
          isPlainLabel(label) ? label : label.default,
          required
        );
        this.data = data;
        this.error = errors;
        this.enabled = enabled;
        this.enabled ? this.form.enable() : this.form.disable();
        this.hidden = !visible;
        this.scopedSchema = schema;
        this.rootSchema = rootSchema;
        this.description =
          this.scopedSchema !== undefined ? this.scopedSchema.description : '';
        this.id = props.id;
        this.form.setValue(data);
        this.mapAdditionalProps(props);
      });
    this.triggerValidation();
  }

  validator: ValidatorFn = (_c: AbstractControl): ValidationErrors | null => {
    return this.error ? { error: this.error } : null;
  };

  // @ts-ignore
  mapAdditionalProps(props: Props) {
    // do nothing by default
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  protected getOwnProps(): OwnPropsOfControl {
    const props: OwnPropsOfControl = {
      uischema: this.uischema,
      schema: this.schema,
      path: this.path,
      id: this.id
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
