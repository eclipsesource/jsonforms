import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { autocompleteControlTester } from '../controls/autocomplete.control';
import { connect, Event } from '../../common/binding';
declare let $;

export class MaterializedAutocompleteControl extends Control<ControlProps, ControlState> {

    componentDidMount() {
      const {
        uischema,
        schema,
        id
      } = this.props;

      const options = resolveSchema(
        schema,
        (uischema as ControlElement).scope.$ref
      ).enum;

      const dataObject = {};

      for (const i of options) {
        dataObject[i] = null;
      }

      $(`[id='${id}']`).autocomplete({
        data: dataObject
      });
    }

    render() {
        const {
            classNames,
            id,
            label,
            visible,
            enabled,
            errors
        } = this.props;

        return (
          <div className={classNames.wrapper}>
              <input
                className={classNames.input}
                hidden={!visible}
                disabled={!enabled}
                value={this.state.value}
                onChange={(ev: Event<HTMLInputElement>) => {
                    if (ev.currentTarget) {
                      this.handleChange(ev.currentTarget.value);
                    }
                  }
                }
                id={id}
                type='text'
              />
              <label htmlFor={id} className={classNames.label} data-error={errors}>
                {label}
              </label>
          </div>
        );
    }
}

export default registerStartupRenderer(
    withIncreasedRank(1, autocompleteControlTester),
    connect(mapStateToControlProps)(MaterializedAutocompleteControl)
);
