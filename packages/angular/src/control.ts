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

    ngOnInit() {
        this.subscription = this.subscribe();
    }

    subscribe() {
        return this.ngRedux
            .select()
            .map(this.mapToProps(this.getOwnProps()))
            .subscribe(this.updateProps);
    }

    validate = () => {
        return this.errors.length > 0 ? ({ schema: this.errors[0] }) : null;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateProps = props => {
        if (!this.form) {
            this.form = new FormControl(
                props.data,
                {updateOn: 'change', validators: this.validate}
            );
        }
        this.onChange = ev => {
            props.handleChange(props.path, ev.value);
        };
        this.errors = props.errors;
        this.error = props.errors.join('\n');

        this.label = computeLabel(
            isPlainLabel(props.label) ? props.label : props.label.default, props.required);

        this.uischema = props.uischema as ControlElement;
        this.schema = props.schema;
        this.scopedSchema = Resolve.schema(this.schema, (this.uischema as ControlElement).scope);

        this.value = props.data;
        this.disabled = !props.enabled;

        // these cause the correct update of the error underline, seems to be
        // related to ionic-team/ionic#11640
        this.form.markAsTouched();
        this.form.updateValueAndValidity();
    }

    protected mapToProps = (ownProps: any) => (state: JsonFormsState) => {
        const props = mapStateToControlProps(state, ownProps);
        const dispatch = mapDispatchToControlProps(this.ngRedux.dispatch);
        return {...props, ...dispatch};
    }

}
