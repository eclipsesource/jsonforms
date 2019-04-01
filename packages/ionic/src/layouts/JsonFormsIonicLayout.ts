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
import { Input, OnDestroy, OnInit } from '@angular/core';
import {
  JsonFormsState,
  Layout,
  mapStateToLayoutProps,
  UISchemaElement
} from '@jsonforms/core';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs';

export class JsonFormsIonicLayout extends JsonFormsBaseRenderer<Layout>
  implements OnInit, OnDestroy {
  @Input() path: string;
  elements: UISchemaElement[];
  subscription: Subscription;
  initializers: any[] = [];

  constructor(protected ngRedux: NgRedux<JsonFormsState>) {
    super();
  }

  ngOnInit() {
    this.subscription = this.ngRedux
      .select()
      .subscribe((state: JsonFormsState) => {
        const ownProps = {
          ...this.getOwnProps(),
          path: this.path
        };
        const props = mapStateToLayoutProps(state, ownProps);
        this.uischema = props.uischema as Layout;
        this.schema = props.schema;
        this.initializers.forEach(initializer => initializer(props));
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
