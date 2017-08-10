import { Renderer } from '../core/renderer';

export class UnknownRenderer extends Renderer {

  render() {
    return (
      <div style={{color: 'red'}}>
    No applicable renderer found.
    </div>
  );
  }
}
