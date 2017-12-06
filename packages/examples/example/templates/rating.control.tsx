import { JSX } from '../../src/renderers/JSX';
import { RankedTester, rankWith, refEndsWith } from '../../src/core/testers';
import { Control, ControlProps, ControlState } from '../../src/renderers/controls/Control';
import { Rating } from './Rating';

/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const ratingControlTester: RankedTester = rankWith(Number.MAX_VALUE, refEndsWith('rating'));

export class RatingControl extends Control<ControlProps, ControlState> {

  /**
   * @inheritDoc
   */
  render() {
    return (
      <Rating value={this.props.data} onClick={ev => this.onClick(ev)} id={this.props.id} />
    );
  }

  private onClick(ev) {
    this.handleChange(ev.value);
  }
}
