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
    Resolve
} from '@jsonforms/core';
import { OnDestroy, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

import { JsonFormsBaseRenderer } from './base.renderer';

export class JsonFormsControl extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

    form: FormControl;
    subscription: Subscription;

    data: any;
    label: string;
    error: string | null;
    disabled: boolean;
    scopedSchema: JsonSchema;
    id: string;

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

    getEventValue = event => event.value;

    onChange(ev) {
        const path = composeWithUi(this.uischema as ControlElement, this.path);
        this.ngRedux.dispatch(Actions.update(path, () => this.getEventValue(ev)));
        // these cause the correct update of the error underline, seems to be
        // related to ionic-team/ionic#11640
        this.form.markAsTouched();
        this.form.updateValueAndValidity();
    }

    ngOnInit() {
        this.subscription = this.ngRedux
            .select()
            .map((s: JsonFormsState) => this.mapToProps(s))
            .subscribe(props => {
                const { data, enabled, errors, label, required, schema, uischema } = props;
                this.label = computeLabel(
                    isPlainLabel(label) ? label : label.default, required
                );
                this.data = data;
                this.error = errors ? errors.join('\n') : null;
                this.disabled = !enabled;
                this.scopedSchema = Resolve.schema(schema, (uischema as ControlElement).scope);
                this.mapAdditionalProps(props);
		this.id = props.id;
            });
    }

    validator: ValidatorFn = (_c: AbstractControl): ValidationErrors | null => {
        return this.error ? { 'error': this.error } : null;
    }

    // @ts-ignore
    mapAdditionalProps(props: ControlProps) {
        // do nothing by default
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    protected mapToProps(state: JsonFormsState): ControlProps {
        const props = mapStateToControlProps(state, this.getOwnProps());
        const dispatch = mapDispatchToControlProps(this.ngRedux.dispatch);
        return {...props, ...dispatch};
    }
}
