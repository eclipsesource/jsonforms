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
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { JsonFormsBaseRenderer } from './base.renderer';

export class JsonFormsControl extends JsonFormsBaseRenderer<ControlElement>
  implements OnInit, OnDestroy {
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
          uischema,
          visible
        } = props;
        this.label = computeLabel(
          isPlainLabel(label) ? label : label.default,
          required
        );
        this.data = data;
        this.error = errors ? errors.join('\n') : null;
        this.enabled = enabled;
        this.enabled ? this.form.enable() : this.form.disable();
        this.hidden = !visible;
        this.scopedSchema = Resolve.schema(schema, uischema.scope);
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
  mapAdditionalProps(props: ControlProps) {
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

  protected mapToProps(state: JsonFormsState): ControlProps {
    const props = mapStateToControlProps(state, this.getOwnProps());
    const dispatch = mapDispatchToControlProps(this.ngRedux.dispatch);
    return { ...props, ...dispatch };
  }

  protected triggerValidation() {
    // these cause the correct update of the error underline, seems to be
    // related to ionic-team/ionic#11640
    this.form.markAsTouched();
    this.form.updateValueAndValidity();
  }
}
