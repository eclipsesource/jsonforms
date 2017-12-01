import { JSX } from '../JSX';
import * as _ from 'lodash';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { sliderControlTester } from '../controls/slider.control';
import { connect, Event } from '../../common/binding';
import { resolveSchema } from '../../path.util';
import { ControlElement } from '../../models/uischema';

export class SliderControl extends Control<ControlProps, ControlState> {

    render() {
        const { classNames, id, visible, enabled, errors, label, uischema, schema } = this.props;
        const controlElement = uischema as ControlElement;
        const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
        // class name has to be range-field otherwise tooltip icon doesn't move on
        // change or it doesn't disappear on mouse down
        classNames.wrapper = 'range-field';

        return (
          <div>
            <label htmlFor={id} className={classNames.label} data-error={errors}>
              {label}
            </label>
            <div className={classNames.wrapper}>
              <input type='range'
                     max={resolvedSchema.maximum}
                     min={resolvedSchema.minimum}
                     value={this.state.value}
                     onChange={(ev: Event<HTMLInputElement>) =>
                       this.handleChange(_.toNumber(ev.currentTarget.value))
                     }
                     className={classNames.input}
                     id={id}
                     hidden={!visible}
                     disabled={!enabled}
                     autoFocus={uischema.options && uischema.options.focus}
              />
            </div>
          </div>
        );
    }
}

export default registerStartupRenderer(
    withIncreasedRank(1, sliderControlTester),
    connect(mapStateToControlProps)(SliderControl)
);
