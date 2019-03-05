import { Component } from '@angular/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsState } from '@jsonforms/core';

@Component({
  selector: 'jsonforms-autocomplete-control',
  template: `
    <ion-item no-padding no-lines>
      <ion-label stacked>{{ label }}</ion-label>
      <ion-label stacked *ngIf="error" color="error">{{ error }}</ion-label>
      <ionic-selectable
        item-content
        [ngModel]="data"
        [items]="options"
        [canSearch]="true"
        (onChange)="onChange($event)"
      >
        <ng-template ionicSelectablePlaceholderTemplate>
          {{ description }}
        </ng-template>
      </ionic-selectable>
    </ion-item>
  `
})
// TODO pressing ESC twice causes crash, see https://github.com/ionic-team/ionic/issues/11776
export class AutoCompleteControlRenderer extends JsonFormsControl {
  options: any[];

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  mapAdditionalProps() {
    this.options = this.scopedSchema.enum;
  }
}
