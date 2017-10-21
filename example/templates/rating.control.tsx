import { JsonForms } from '../../src/core';
import { RankedTester, rankWith, refEndsWith } from '../../src/core/testers';
import { mapStateToControlProps } from '../../src/renderers/controls/base.control';
import { connect } from 'inferno-redux';
import { Control, ControlProps } from '../../src/renderers/controls/Control';
import { Rating } from './Rating';

/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const ratingControlTester: RankedTester = rankWith(3, refEndsWith('rating'));

export class RatingControl extends Control<ControlProps, void> {

  /**
   * @inheritDoc
   */
  render() {
    return (
      <Rating value={this.props.data} onClick={ev => this.onClick(ev)} />
    );
  }

  private onClick(ev) {
    this.updateData(ev.value);
  }
}

// export default JsonForms.rendererService.registerRenderer(
//   ratingControlTester,
//   connect(mapStateToControlProps)(RatingControl)
// );
