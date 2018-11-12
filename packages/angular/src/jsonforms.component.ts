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
    ComponentRef,
    Directive,
    Input,
    OnDestroy,
    OnInit,
    Type,
    ViewContainerRef
} from '@angular/core';
import {
    createId,
    isControl,
    JsonFormsProps, JsonFormsState,
    JsonSchema,
    mapStateToJsonFormsRendererProps,
    OwnPropsOfRenderer
} from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';
import 'rxjs/add/operator/map';
import { UnknownRenderer } from './unknown.component';
import { JsonFormsBaseRenderer } from './base.renderer';
import { Subscription } from 'rxjs';
import { JsonFormsControl } from './control';

@Directive({
    selector: 'jsonforms-outlet',
})
export class JsonFormsOutlet extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

    private subscription: Subscription;
    private currentComponentRef: ComponentRef<any>;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private ngRedux: NgRedux<any>
    ) {
        super();
    }

    @Input()
    set renderProps(renderProps: OwnPropsOfRenderer) {
        this.path = renderProps.path;
        this.schema = renderProps.schema;
        this.uischema = renderProps.uischema;
        this.update(this.ngRedux.getState());
    }

    ngOnInit(): void {
        this.subscription = this.ngRedux
            .select()
            .subscribe((state: JsonFormsState) => this.update(state));
    }

    update(state: JsonFormsState) {
        const props = mapStateToJsonFormsRendererProps(
            state,
            {
                schema: this.schema,
                uischema: this.uischema,
                path: this.path
            }
        );
        const { renderers } = props as JsonFormsProps;
        const schema : JsonSchema = this.schema || props.schema;
        const uischema = this.uischema || props.uischema;
        const id = isControl(props.uischema) ? createId(props.uischema.scope) : undefined;

        const renderer = _.maxBy(renderers, r => r.tester(uischema, schema));
        let bestComponent: Type<any> = UnknownRenderer;
        if (renderer !== undefined && renderer.tester(uischema, schema) !== -1) {
            bestComponent = renderer.renderer;
        }

        const componentFactory =
            this.componentFactoryResolver.resolveComponentFactory(bestComponent);

        if (this.currentComponentRef === undefined) {
            this.currentComponentRef = this.viewContainerRef.createComponent(componentFactory);
        } else if (this.currentComponentRef.componentType !== componentFactory.componentType) {
            this.viewContainerRef.clear();
            this.currentComponentRef = this.viewContainerRef.createComponent(componentFactory);
        }

        if (this.currentComponentRef.instance instanceof JsonFormsBaseRenderer) {
            const instance = (this.currentComponentRef.instance as JsonFormsBaseRenderer);
            instance.uischema = uischema;
            instance.schema = schema;
            instance.path = this.path;
            if (instance instanceof  JsonFormsControl) {
                (instance as JsonFormsControl).id = id;
            }
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
