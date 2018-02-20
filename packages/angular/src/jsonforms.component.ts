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
