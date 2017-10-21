import { Renderer, RendererProps } from '../../core/renderer';
import { update } from '../../actions';

export interface ControlProps extends RendererProps {
  data: any;
  path: string;
}

export class Control<P extends ControlProps, S> extends Renderer<P, S> {

  updateData(value) {
    this.props.dispatch(update(this.props.path, () => value));
  }
}
