import { JSX } from '../src/renderers/JSX';
import * as _ from 'lodash';
import { BooleanControl, booleanControlTester } from '../src/renderers/controls/boolean.control';
import {and, rankWith, schemaMatches, schemaTypeIs, uiTypeIs} from '../src/core/testers';
import { JsonFormsControl, registerStartupRenderer } from '../src/renderers/renderer.util';
import { connect } from 'inferno-redux';
import { mapStateToControlProps } from '../src/renderers/controls/base.control';
import { convertToClassName } from '../src/core/renderer';
import { ControlElement } from '../src/models/uischema';
declare let $;

const materializedBooleanControlTester = rankWith(3, and(
  uiTypeIs('Control'),
  schemaTypeIs('boolean')
));

export class MaterializedBooleanControl extends BooleanControl {

  render() {
    const { uischema, labelText, errors } = this.props;
    const controlElement = uischema as ControlElement;
    const isValid = _.isEmpty(errors);

    const classes: string[] = !_.isEmpty(controlElement.scope) ?
      []
        .concat([`control ${convertToClassName(controlElement.scope.$ref)}`])
        .concat([isValid ? 'valid' : 'invalid'])
      : [''];
    const controlId = _.has(controlElement.scope, '$ref') ? controlElement.scope.$ref : '';

    return (
      <JsonFormsControl
        classes={classes.join(' ')}
        controlId={controlId}
        labelText={labelText}
        validationErrors={errors}
        createValidationDiv={false}
        labelFirst={false}
      >
        {this.createInputElement()}
      </JsonFormsControl>
    );
  }

}

export default registerStartupRenderer(
  materializedBooleanControlTester,
  connect(mapStateToControlProps)(MaterializedBooleanControl)
);
