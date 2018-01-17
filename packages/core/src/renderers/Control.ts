import { Renderer, RendererProps } from './renderer';

/**
 * Props of a renderer.
 */
export interface ControlProps extends RendererProps {

  /**
   * The data to be rendered.
   */
  data: any;

  /**
   * The absolute path to the value being rendered.
   * A path is a sequence of property names separated by dots,
   * e.g. for accessing the value of b in the object
   * { foo: { a: { b: 42 } } }, one would use foo.a.b.
   */
  path: string;

  /**
   * Path of the parent renderer, if any.
   */
  parentPath?: string;

  /**
   * An unique ID that can be used to identify the rendered form.
   */
  id: string;

  /**
   * Determines whether the rendered form should be visible.
   */
  visible: boolean;

  /**
   * Determines whether the rendered form should be enabeld.
   */
  enabled: boolean;

  /**
   * The label for the rendered form.
   */
  label: string;

  /**
   * Any validation errors that are caused by the data to be rendered.
   */
  errors: any[];

  /**
   * Whether the rendered data is required.
   */
  required: boolean;

  /**
   * Update handler that emits a data change
   *
   * @param {string} the absolute path
   * @param value
   */
  handleChange(path: string, value: any);
}

export interface ControlState {
  value: any;
  isFocused: boolean;
}

export class Control<P extends ControlProps, S extends ControlState> extends Renderer<P, S> {

  constructor(props: P) {
    super(props);
    // tslint:disable:no-object-literal-type-assertion
    this.state = {
      value: props.data ? props.data : '',
      isFocused: false
    } as Readonly<S>;
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
