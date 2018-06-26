import {
  computeLabel,
  ControlElement,
  isPlainLabel,
  JsonFormsState,
  JsonSchema,
  mapDispatchToControlProps,
  mapStateToControlProps,
  Resolve
} from '@jsonforms/core';
import * as _ from 'lodash';
import { OnDestroy, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { JsonFormsBaseRenderer } from './base.renderer';

export class JsonFormsControl extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

  onChange: (event?: any) => void;
  scopedSchema: JsonSchema;
  label: string;
  value: any;
  disabled: boolean;
  subscription: Subscription;
  form;
  errors: any[] = [];
  error: string;

  constructor(protected ngRedux: NgRedux<JsonFormsState>) {
    super();
  }

  connectControlToJsonForms = (store, ownProps: any) =>
    store.select().map(state => {
      const props = mapStateToControlProps(state, ownProps);
      const dispatch = mapDispatchToControlProps(store.dispatch);
      return {...props, ...dispatch};
    })

  ngOnInit() {
    this.subscription = this
      .connectControlToJsonForms(this.ngRedux, this.getOwnProps())
      .subscribe(state => {
        if (!this.form) {
          this.form = new FormControl(
            _.get(this.ngRedux.getState().jsonforms.core.data, state.path),
            {updateOn: 'change', validators: this.validate}
          );
        }
        this.onChange = ev => {
          state.handleChange(state.path, ev.value);
        };
        this.errors = state.errors;
        this.error = state.errors.join('\n');

        this.label = computeLabel(
          isPlainLabel(state.label) ? state.label : state.label.default, state.required);

        this.uischema = state.uischema as ControlElement;
        this.schema = state.schema;
        this.scopedSchema = Resolve.schema(this.schema, (this.uischema as ControlElement).scope);
        this.value = state.data;
        this.disabled = !state.enabled;

        // these cause the correct update of the error underline, seems to be
        // related to ionic-team/ionic#11640
        this.form.markAsTouched();
        this.form.updateValueAndValidity();
      });
  }

  validate = () => {
    return this.errors.length > 0 ? ({ schema: this.errors[0] }) : null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
