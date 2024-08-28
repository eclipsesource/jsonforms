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
  Category,
  defaultJsonFormsI18nState,
  deriveLabelForUISchemaElement,
  getAjv,
  isVisible,
  JsonFormsState,
  Labelable,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { Component, OnInit } from '@angular/core';
import {
  JsonFormsAngularService,
  JsonFormsBaseRenderer,
} from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-categorization-layout',
  template: `
    <mat-tab-group
      [ngStyle]="{ display: hidden ? 'none' : '' }"
      dynamicHeight="true"
    >
      <mat-tab
        *ngFor="let category of visibleCategories; let i = index"
        [label]="categoryLabels[i]"
      >
        <div *ngFor="let element of category.elements">
          <jsonforms-outlet
            [uischema]="element"
            [path]="path"
            [schema]="schema"
          ></jsonforms-outlet>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class CategorizationTabLayoutRenderer
  extends JsonFormsBaseRenderer<Categorization>
  implements OnInit
{
  hidden: boolean;
  visibleCategories: (Category | Categorization)[];
  categoryLabels: string[];

  constructor(private jsonFormsService: JsonFormsAngularService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.jsonFormsService.$state.subscribe({
        next: (state: JsonFormsState) => {
          const props = mapStateToLayoutProps(state, this.getOwnProps());
          this.hidden = !props.visible;
          this.visibleCategories = this.uischema.elements.filter(
            (category: Category | Categorization) =>
              isVisible(category, props.data, undefined, getAjv(state))
          );
          this.categoryLabels = this.visibleCategories.map((element) =>
            deriveLabelForUISchemaElement(
              element as Labelable<boolean>,
              state.jsonforms.i18n?.translate ??
                defaultJsonFormsI18nState.translate
            )
          );
        },
      })
    );
  }
}

export const categorizationTester: RankedTester = rankWith(
  2,
  and(uiTypeIs('Categorization'), categorizationHasCategory)
);
