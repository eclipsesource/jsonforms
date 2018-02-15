import * as React from 'react';
import {
  Control,
  ControlProps,
  ControlState,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  scopeEndsWith
} from '@jsonforms/core';
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
      <Rating
        value={this.props.data}
        onClick={ev => {
          this.onClick(ev);
        }}
        id={this.props.id}
      />
    );
  }

  private onClick(ev) {
    this.handleChange(ev.value);
  }
}

export default connect(mapStateToControlProps)(RatingControl);
