import { RendererComponent } from './Renderer';
import { ControlProps, ControlState } from '@jsonforms/core';

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

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({ value: this.props.data });
    }
  }

  /**
   * Propagates a value change.
   *
   * @param value the updated value
   */
  handleChange(value) {
    this.setState({ value });
    this.updateData(value);
  }

  /**
   * Set the focused state to true.
   */
  onFocus() {
    this.setState({ isFocused:  true });
  }

  /**
   * Set the focused state to false.
   */
  onBlur() {
    this.setState({ isFocused:  false });
  }

  private updateData(value) {
    this.props.handleChange(this.props.path, value);
  }
}
