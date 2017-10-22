import { JSX } from '../JSX';
import { connect } from 'inferno-redux';
import * as _ from 'lodash';
import { LabelElement } from '../../models/uischema';
import { isVisible, Renderer, RendererProps } from '../../core/renderer';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { JsonForms } from '../../core';
import { registerStartupRenderer } from '../renderer.util';

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const labelRendererTester: RankedTester = rankWith(1, uiTypeIs('Label'));

/**
 * Default renderer for a label.
 */
export class LabelRenderer extends Renderer<RendererProps, void> {

  /**
   * @inheritDoc
   */
  render() {
    const { uischema, visible } = this.props;
    const labelElement: LabelElement = uischema as LabelElement;
    const classNames = [JsonForms.stylingRegistry.getAsClassName('label-control')];
    const isHidden = !visible;

    return (
      <label hidden={isHidden} className={classNames}>
        {
          labelElement.text !== undefined && labelElement.text !== null ?
            labelElement.text : ''
        }
      </label>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    visible
  };
};

export default registerStartupRenderer(
  labelRendererTester,
  connect(mapStateToProps)(LabelRenderer)
);
