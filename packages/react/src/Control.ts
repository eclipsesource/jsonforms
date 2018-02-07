import { Renderer } from './Renderer';
import { ControlProps, ControlState } from '@jsonforms/core';

export class Control<P extends ControlProps, S extends ControlState> extends Renderer<P, S> {

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

  handleChange(value) {
    this.setState({ value });
    this.updateData(value);
  }

  onFocus() {
    this.setState({ isFocused:  true });
  }

  onBlur() {
    this.setState({ isFocused:  false });
  }

  private updateData(value) {
    this.props.handleChange(this.props.path, value);
  }
}
