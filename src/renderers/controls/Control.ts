import { Renderer, RendererProps } from '../../core/renderer';
import { update } from '../../actions';

export interface ControlClassNames {
  input: string;
  label: string;
  wrapper: string;
}

export interface ControlProps extends RendererProps {
  data: any;
  path: string;
  classNames: ControlClassNames;
  id: string;
  visible: boolean;
  enabled: boolean;
  label: string;
}

// const { data, classNames, controlId, visible, enabled, errors, label } = this.props;

export class Control<P extends ControlProps, S> extends Renderer<P, S> {

  updateData(value) {
    this.props.dispatch(update(this.props.path, () => value));
  }
}
