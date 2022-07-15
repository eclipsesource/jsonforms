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
  and,
  Categorization,
  categorizationHasCategory,
  defaultJsonFormsI18nState,
  deriveLabelForUISchemaElement,
  JsonFormsState,
  Labelable,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  JsonFormsAngularService,
  JsonFormsBaseRenderer
} from '@jsonforms/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jsonforms-categorization-layout',
  template: `
    <mat-tab-group dynamicHeight="true" [fxHide]="hidden">
      <mat-tab
        *ngFor="let category of uischema.elements; let i = index"
        [label]="categoryLabels[i]"
      >
        <div *ngFor="let element of category.elements">
          <jsonforms-outlet [uischema]="element" [path]="path" [schema]="schema"></jsonforms-outlet>
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
  categoryLabels: string[];

  constructor(private jsonFormsService: JsonFormsAngularService) {
    super();
  }

  ngOnInit() {
    this.subscription = this.jsonFormsService.$state.subscribe({
      next: (state: JsonFormsState) => {
        const props = mapStateToLayoutProps(state, this.getOwnProps());
        this.hidden = !props.visible;
        this.categoryLabels = this.uischema.elements.map(
          element => deriveLabelForUISchemaElement(element as Labelable<boolean>,
            state.jsonforms.i18n?.translate ?? defaultJsonFormsI18nState.translate));
      }
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
