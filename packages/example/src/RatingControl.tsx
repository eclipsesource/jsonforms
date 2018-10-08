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
import * as React from 'react';
import {
  ControlProps,
  ControlState,
  mapDispatchToControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  scopeEndsWith
} from '@jsonforms/core';
import { Control } from '@jsonforms/react';
import { Rating } from './Rating';
import { connect } from 'react-redux';

/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const ratingControlTester: RankedTester =
  rankWith(Number.MAX_VALUE, scopeEndsWith('rating'));

export class RatingControl extends Control<ControlProps, ControlState> {

  /**
   * @inheritDoc
   */
  render() {
    return (
      <div
        style={{ paddingTop: '1.5em' }}
      >
        <Rating
          value={this.props.data}
          onClick={(ev: any) => {
            this.props.handleChange(this.props.path, Number(ev.value));
          }}
          id={this.props.id}
        />
      </div>
    );
  }
}

export default connect(mapStateToControlProps, mapDispatchToControlProps)(RatingControl);
