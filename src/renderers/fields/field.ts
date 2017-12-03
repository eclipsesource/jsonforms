import { Component } from '../../common/binding';
import { update } from '../../actions';
import { JsonSchema } from '../../models/jsonSchema';
import { UISchemaElement } from '../../models/uischema';
export interface FieldProps {
  /**
   * The UI schema to be rendered.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that describes the data.
   */
  schema: JsonSchema;
  /**
   * Optional instance path. Necessary when the actual data
   * path can not be inferred via the UI schema element as
   * it is the case with nested controls.
   */
  path?: string;
  data: any;
  className: string;
  id: string;
  visible: boolean;
  enabled: boolean;
  dispatch: any;
}
export interface FieldState {
  value: any;
}
export class Field<P extends FieldProps, S extends FieldState> extends Component<P, S> {

  constructor(props: P) {
    super(props);
    this.state = {
      value: props.data ? props.data : ''
    } as Readonly<S>;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      this.setState({ value: this.props.data } as S);
    }
  }

  handleChange(value) {
    this.setState({ value } as S);
    this.updateData(value);
  }

  private updateData(value) {
    this.props.dispatch(update(this.props.path, () => value));
  }
}
