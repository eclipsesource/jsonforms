import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
    computeLabel,
    Control,
    ControlElement,
    ControlProps,
    ControlState,
    DispatchField,
    formatErrorMessage,
    isControl,
    isDescriptionHidden,
    mapStateToControlProps,
    RankedTester,
    rankWith,
    registerStartupRenderer,
    resolveSchema
  } from '@jsonforms/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { error } from 'util';

@Component({
    selector: 'TextControlRenderer',
    template: `
        <div class="forms_control">
            <label>{{computeLabel(label, required)}}</label>
            <input type="text" (change)="handleChange(ev)" [value]="data"/>
            <div>{{formatErrorMessage(errors)}}</div>
        </div>
    `
    ,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextControlRenderer implements OnInit {
    private id;
    private errors;
    private label;
    private visible;
    private required;
    private data;

    constructor( @Inject('uiSchema') private _uiSchema: ControlElement, @Inject('data') private _data: any) {

    }
    ngOnInit() {
        const {
            id,
            errors,
            label,
            visible,
            required,
            data
          } = mapStateToControlProps(null, null);
        this.id = id;
        this.errors = errors;
        this.label = label;
        this.required = required;
        this.data = data;
    }
}
export const TextControlRendererTester: RankedTester = rankWith(1, isControl);
