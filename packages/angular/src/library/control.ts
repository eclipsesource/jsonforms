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
import {
  JsonFormsState,
  mapStateToControlProps,
  mapStateToControlWithDetailProps,
  StatePropsOfControl,
  StatePropsOfControlWithDetail,
} from '@jsonforms/core';
import type { OnDestroy, OnInit } from '@angular/core';
import { JsonFormsAbstractControl } from './abstract-control';

export class JsonFormsControl
  extends JsonFormsAbstractControl<StatePropsOfControl>
  implements OnInit, OnDestroy
{
  protected mapToProps(state: JsonFormsState): StatePropsOfControl {
    const props = mapStateToControlProps(state, this.getOwnProps());
    return { ...props };
  }
}

export class JsonFormsControlWithDetail
  extends JsonFormsAbstractControl<StatePropsOfControlWithDetail>
  implements OnInit, OnDestroy
{
  protected mapToProps(state: JsonFormsState): StatePropsOfControlWithDetail {
    const props = mapStateToControlWithDetailProps(state, this.getOwnProps());
    return { ...props };
  }
}
