import { Component } from '@angular/core';
import { isControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
    selector: 'jsonforms-string-control',
    template: `
      <ion-item [hidden]='hidden'>
          <ion-label floating>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
          <ion-input
                  type="text"
                  (ionChange)="onChange($event)"
                  [value]="getValue()"
                  placeholder="{{ description }}"
                  [id]="id"
                  [formControl]="form"
                  [type]="getType()"
          >
          </ion-input>
      </ion-item>
  `
})
export class StringControlRenderer extends JsonFormsControl {
    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
    }
    getValue = () => this.data || '';
    getType = (): string => {
        if (this.uischema.options && this.uischema.options.format) {
            return this.uischema.options.format;
        }
        if (this.scopedSchema && this.scopedSchema.format) {
            switch (this.scopedSchema.format) {
                case 'email': return 'email';
                case 'tel': return 'tel';
                default: return 'text';
            }
        }
        return 'text';
    }
}

export const stringControlTester: RankedTester = rankWith(
    1,
    isControl
);
