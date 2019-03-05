import {
  and,
  Categorization,
  categorizationHasCategory,
  JsonFormsState,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jsonforms-categorization-layout',
  template: `
    <mat-tab-group dynamicHeight="true" [fxHide]="hidden">
      <mat-tab
        *ngFor="let category of uischema.elements"
        [label]="category.label"
      >
        <div *ngFor="let element of category.elements">
          <jsonforms-outlet [uischema]="element"></jsonforms-outlet>
        </div>
      </mat-tab>
    </mat-tab-group>
  `
})
export class CategorizationTabLayoutRenderer
  extends JsonFormsBaseRenderer<Categorization>
  implements OnInit, OnDestroy {
  hidden: boolean;
  private subscription: Subscription;

  constructor(private ngRedux: NgRedux<JsonFormsState>) {
    super();
  }

  ngOnInit() {
    this.subscription = this.ngRedux
      .select()
      .subscribe((state: JsonFormsState) => {
        const props = mapStateToLayoutProps(state, this.getOwnProps());
        this.hidden = !props.visible;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

export const categorizationTester: RankedTester = rankWith(
  2,
  and(uiTypeIs('Categorization'), categorizationHasCategory)
);
