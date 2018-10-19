import {
    Actions,
    composeWithUi,
    computeLabel,
    ControlElement,
    ControlProps,
    isPlainLabel,
    JsonFormsState,
    JsonSchema,
    mapDispatchToControlProps,
    mapStateToControlProps,
    OwnPropsOfControl,
    Resolve
} from '@jsonforms/core';
import { Input, OnDestroy, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

import { JsonFormsBaseRenderer } from './base.renderer';

export class JsonFormsControl extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

    @Input() id: string;
    @Input() disabled: boolean;

    form: FormControl;
    subscription: Subscription;
    data: any;
    label: string;
    error: string | null;
    scopedSchema: JsonSchema;
    enabled: boolean;

    constructor(protected ngRedux: NgRedux<JsonFormsState>) {
        super();
        this.form = new FormControl(
            null,

            {
                updateOn: 'change',
                validators: this.validator.bind(this)
            }
        );
    }

    getEventValue = (event: any) => event.value;

    onChange(ev: any) {
        const path = composeWithUi(this.uischema as ControlElement, this.path);
        this.ngRedux.dispatch(Actions.update(path, () => this.getEventValue(ev)));
        this.triggerValidation();
    }

    ngOnInit() {
        this.subscription = this.ngRedux
            .select()
            .subscribe((state: JsonFormsState) => {
                const props = this.mapToProps(state);
                const { data, enabled, errors, label, required, schema, uischema } = props;
                this.label = computeLabel(
                    isPlainLabel(label) ? label : label.default, required
                );
                this.data = data;
                this.error = errors ? errors.join('\n') : null;
                this.enabled = enabled;
                this.enabled ? this.form.enable() : this.form.disable();
                this.scopedSchema = Resolve.schema(schema, (uischema as ControlElement).scope);
                this.id = props.id;
                this.mapAdditionalProps(props);
            });
        this.triggerValidation();
    }

    validator: ValidatorFn = (_c: AbstractControl): ValidationErrors | null => {
        return this.error ? { 'error': this.error } : null;
    }

    // @ts-ignore
    mapAdditionalProps(props: ControlProps) {
        // do nothing by default
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    protected getOwnProps(): OwnPropsOfControl {
        return {
          uischema: this.uischema as ControlElement,
          schema: this.schema,
          path: this.path,
          id: this.id,
          enabled: !this.disabled
        };
      }

    protected mapToProps(state: JsonFormsState): ControlProps {
        const props = mapStateToControlProps(state, this.getOwnProps());
        const dispatch = mapDispatchToControlProps(this.ngRedux.dispatch);
        return {...props, ...dispatch};
    }

    private triggerValidation() {
        // these cause the correct update of the error underline, seems to be
        // related to ionic-team/ionic#11640
        this.form.markAsTouched();
        this.form.updateValueAndValidity();
    }
}
