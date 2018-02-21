import { NgRedux } from '@angular-redux/store';
import {
    ControlProps,
    JsonFormsState,
    mapDispatchToControlProps,
    mapStateToControlProps,
    mapStateToLayoutProps,
    StatePropsOfLayout
} from '@jsonforms/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

export const connectControlToJsonForms =
(store: NgRedux<JsonFormsState>, ownProps: any): Observable<ControlProps> =>
    store.select().map(state => {
        const props = mapStateToControlProps(state, ownProps);
        const dispatch = mapDispatchToControlProps(store.dispatch);
        const result: ControlProps =  {...props, ...dispatch};

        return result;
    });
export const connectLayoutToJsonForms =
(store: NgRedux<JsonFormsState>, ownProps: any): Observable<StatePropsOfLayout> =>
    store.select().map(state => {
        const props = mapStateToLayoutProps(state, ownProps);

        return props;
    });
