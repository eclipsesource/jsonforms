import { Input, OnDestroy, OnInit } from '@angular/core';
import {
  JsonFormsState,
  mapStateToLayoutProps,
  UISchemaElement
} from '@jsonforms/core';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs';

export class JsonFormsIonicLayout extends JsonFormsBaseRenderer
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
        this.uischema = props.uischema;
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
