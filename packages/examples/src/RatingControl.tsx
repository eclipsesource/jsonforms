import * as React from 'react';
import {
  ControlProps,
  ControlState,
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
          onClick={ev => {
            this.onClick(ev);
          }}
          id={this.props.id}
        />
      </div>
    );
  }

  private onClick(ev) {
    this.handleChange(ev.value);
  }
}

export default connect(mapStateToControlProps)(RatingControl);
