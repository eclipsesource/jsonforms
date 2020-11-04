/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the 'Software'), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import React, { Component, CSSProperties } from 'react';
import { JsonFormsDispatch } from '@jsonforms/react';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import './App.css';
import { AppProps, initializedConnect } from './reduxUtil';

const preStyle: CSSProperties = {
  overflowX: 'auto'
};
class App extends Component<AppProps> {
  render() {
    return (
      <JsonFormsReduxContext>
        <div>
          <div className='App'>
            <header className='App-header'>
              <img src='assets/logo.svg' className='App-logo' alt='logo' />
              <h1 className='App-title'>Welcome to JSON Forms with React</h1>
              <p className='App-intro'>More Forms. Less Code.</p>
            </header>
          </div>

          <h4 className='data-title'>Examples</h4>
          <div className='data-content'>
            <select
              value={this.props.selectedExample.name || ''}
              onChange={ev => this.props.changeExample(ev.currentTarget.value)}
            >
              {this.props.examples.map(optionValue => (
                <option
                  value={optionValue.name}
                  label={optionValue.label}
                  key={optionValue.name}
                >
                  {optionValue.label}
                </option>
              ))}
            </select>
          </div>

          <h4 className='data-title'>Bound data</h4>
          <div className='data-content'>
            <pre style={preStyle}>{this.props.dataAsString}</pre>
          </div>
          <div className='demoform'>
            {this.props.getExtensionComponent()}
            <JsonFormsDispatch onChange={this.props.onChange} />
          </div>
        </div>
      </JsonFormsReduxContext>
    );
  }
}

export default initializedConnect(App);
