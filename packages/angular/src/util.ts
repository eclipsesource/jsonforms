import { NgRedux } from '@angular-redux/store';
import {
    ControlProps,
    JsonFormsState,
    mapDispatchToControlProps,
    mapStateToControlProps,
    mapStateToLayoutProps,
    RendererProps
} from '@jsonforms/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

export const connectControlToJsonForms =
(store: NgRedux<JsonFormsState>, ownProps: any): Observable<ControlProps> =>
    store.select().map(state => {
        const props = mapStateToControlProps(state, ownProps);
        const dispatch = mapDispatchToControlProps(store.dispatch);

        return {...props, ...dispatch};
    });
export const connectLayoutToJsonForms =
(store: NgRedux<JsonFormsState>, ownProps: any): Observable<RendererProps> =>
    store.select().map(state => {
        const props = mapStateToLayoutProps(state, ownProps);

        return {...props};
    });
