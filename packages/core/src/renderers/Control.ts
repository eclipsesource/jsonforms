import { RendererComponent } from './Renderer';
import { StatePropsOfScopedRenderer } from './common';

/**
 * State-based props of a Control
 */
export interface StatePropsOfControl extends StatePropsOfScopedRenderer {

  /**
   * Any validation errors that are caused by the data to be rendered.
   */
  errors: any[];

  /**
   * The label for the rendered element.
   */
  label: string;

  /**
   * Whether the rendered data is required.
   */
  required: boolean;
}

/**
 * Dispatch-based props of a Control.
 */
export interface DispatchPropsOfControl {

  /**
   * Update handler that emits a data change
   *
   * @param {string} path the path to the data to be updated
   * @param {any} value the new value that should be written to the given path
   */
  handleChange(path: string, value: any);
}

/**
 * Props of a Control.
 */
export interface ControlProps extends StatePropsOfControl, DispatchPropsOfControl {

}

/**
 * The state of a control.
 */
export interface ControlState {
  /**
   * The current value.
   */
  value: any;

  /**
   * Whether the control is focused.
   */
  isFocused: boolean;
}

/**
 * A controlled component convenience wrapper that additionally manages a focused state.
 *
 * @template P control specific properties
 * @template S the state managed by the control
 */
export class Control<P extends ControlProps, S extends ControlState>
  extends RendererComponent<P, S> {

  constructor(props: P) {
    super(props);
    // tslint:disable:no-object-literal-type-assertion
    this.state = {
      value: props.data ? props.data : '',
      isFocused: false
    } as S;
    // tslint:enable:no-object-literal-type-assertion
  }

  /**
   * Propagates a value change.
   *
   * @param value the updated value
   */
  handleChange = value => {
    this.setState({ value });
    this.updateData(value);
  }

  /**
   * Set the focused state to true.
   */
  onFocus = () => {
    this.setState({ isFocused:  true });
  }

  /**
   * Set the focused state to false.
   */
  onBlur = () => {
    this.setState({ isFocused:  false });
  }

  private updateData = value => {
    this.props.handleChange(this.props.path, value);
  }
}
