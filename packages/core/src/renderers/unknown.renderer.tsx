import * as React from 'react';
import {Component} from "react";

export class UnknownRenderer extends Component<any, any> {

  render() {
    return (
      <div style={{color: 'red'}}>
        No applicable renderer found.
      </div>
    );
  }
}
