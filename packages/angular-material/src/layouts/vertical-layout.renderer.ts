/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    JsonFormsState,
    RankedTester,
    rankWith,
    StatePropsOfLayout,
    uiTypeIs
} from '@jsonforms/core';

import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { connectLayoutToJsonForms } from '../util';

@Component({
    selector: 'VerticalLayoutRenderer',
    template: `
    <div fxLayout='column'>
        <div *ngFor="let child of uischema.elements" fxFlex>
            <jsonforms-outlet [uischema]="child" ></jsonforms-outlet>
        </div>
    </div>
    `
})
export class VerticalLayoutRenderer extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

    stateProps: StatePropsOfLayout;

    private subscription: Subscription;

    constructor(private ngRedux: NgRedux<JsonFormsState>) {
        super();
    }

    ngOnInit() {
        const state$ = connectLayoutToJsonForms(this.ngRedux, this.getOwnProps());
        this.subscription = state$.subscribe(state => {
            this.stateProps = state;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));
