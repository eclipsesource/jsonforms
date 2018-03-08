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
import { Component } from 'react';
import * as _ from 'lodash';
export interface RatingState {
  rating: number;
  hoverAt: number | null;
}

export interface RatingProps {
  onClick: any;
  value: number;
  id: string;
}

export class Rating extends Component<RatingProps, RatingState> {

  constructor(props) {
    super(props);
    this.state = {
      rating: props.value,
      hoverAt: null
    };
  }

  handleMouseOver(idx: number) {
    this.setState({
      hoverAt: idx + 1
    });
  }

  handleMouseOut() {
    this.setState({
      hoverAt: null
    });
  }

  handleClick(idx: number) {
    this.setState({
      rating: idx + 1
    });
  }

  render() {
    const { onClick } = this.props;

    return (
      <div>
        {
          _.range(0, 5).map(i => {
            const rating = this.state.hoverAt != null ? this.state.hoverAt : this.state.rating;

            return (
              <span
                onMouseOver={() => {
                  this.handleMouseOver(i);
                }}
                onMouseOut={() => {
                  this.handleMouseOut();
                }}
                onClick={() => {
                  this.handleClick(i);
                  onClick({ value: i + 1});
                }}
                key={`${this.props.id}_${i}`}
              >
                {i < rating ? '\u2605' : '\u2606'}
              </span>
            );
          })
        }
      </div>
    );
  }
}

export default Rating;
