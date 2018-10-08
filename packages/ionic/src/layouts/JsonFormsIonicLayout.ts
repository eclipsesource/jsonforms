import { Input, OnDestroy, OnInit } from '@angular/core';
import { JsonFormsState, mapStateToLayoutProps, UISchemaElement } from '@jsonforms/core';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs';

export class JsonFormsIonicLayout extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

    @Input() path: string;
    elements: UISchemaElement[];
    subscription: Subscription;

    constructor(protected ngRedux: NgRedux<JsonFormsState>) {
        super();
    }

    ngOnInit() {
        const ownProps = {
            ...this.getOwnProps(),
            path: this.path
        };
        this.subscription = this.ngRedux
            .select()
            .map((state: JsonFormsState) => mapStateToLayoutProps(state, ownProps))
            .subscribe(props => {
                this.uischema = props.uischema;
                this.schema = props.schema;
                this.mapAdditionalProps();
            });
    }

    // TODO: maybe we should move the subscription as this method into the base renderer?
    mapAdditionalProps() {
        // do nothing by default
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
