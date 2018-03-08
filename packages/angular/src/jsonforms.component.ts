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
import * as _ from 'lodash';
import {
  ComponentFactoryResolver,
  Directive,
  Input,
  OnInit,
  Type,
  ViewContainerRef
} from '@angular/core';
import {
  JsonFormsProps,
  mapStateToDispatchRendererProps,
  UISchemaElement
} from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';
import 'rxjs/add/operator/map';
import { UnknownRenderer } from './unknown.component';
import { JsonFormsBaseRenderer } from './base.renderer';

@Directive({
  selector: 'jsonforms-outlet',
})
export class JsonFormsOutlet implements OnInit {

  @Input() uischema: UISchemaElement;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngRedux: NgRedux<any> ) {
  }

  ngOnInit(): void {
    const state$ = this.ngRedux.select().map(state =>
       mapStateToDispatchRendererProps(state, {uischema: this.uischema})
    );
    state$.subscribe(props => {
      const {renderers, schema, uischema} = props as JsonFormsProps;
      const renderer = _.maxBy(renderers, r => r.tester(uischema, schema));
      let bestComponent: Type<any> = UnknownRenderer;
      if (renderer !== undefined && renderer.tester(uischema, schema) !== -1) {
        bestComponent = renderer.renderer;
      }
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(bestComponent);
      this.viewContainerRef.clear();

      const componentRef = this.viewContainerRef.createComponent(componentFactory);
      if (componentRef.instance instanceof JsonFormsBaseRenderer) {
        const instance = (componentRef.instance as JsonFormsBaseRenderer);
        instance.uischema = uischema;
        instance.schema = schema;
      }
    });
  }

}
