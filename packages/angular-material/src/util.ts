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
    store.select(
        state => {
            const props = mapStateToControlProps(state, ownProps);
            const dispatch = mapDispatchToControlProps(store.dispatch);
            const result: ControlProps =  {...props, ...dispatch};

            return result;
        },
        ({handleChange: _x, ...x}, {handleChange: _y, ...y}) => _.isEqual(x, y)
    );

export const connectLayoutToJsonForms =
(store: NgRedux<JsonFormsState>, ownProps: any): Observable<StatePropsOfLayout> =>
    store.select(state => {
        const props = mapStateToLayoutProps(state, ownProps);

        return props;
    });
