import { JSX } from './JSX';
import { Component } from '../common/binding';

export class UnknownRenderer extends Component<any, any> {

  render() {
    return (
      <div style={{color: 'red'}}>
        No applicable renderer found.
      </div>
    );
  }
}
