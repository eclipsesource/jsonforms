import { Renderer, RendererProps } from '../core/renderer';

export class UnknownRenderer extends Renderer<RendererProps, void> {

  render() {
    return (
      <div style={{color: 'red'}}>
        No applicable renderer found.
      </div>
    );
  }
}
