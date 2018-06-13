import {connect} from 'react-redux';
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { getData } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';


class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to JSON Forms with React</h1>
            <p className="App-intro">More Forms. Less Code.</p>
          </header>
        </div>

        <h4 className="data-title">Bound data</h4>
        <div className="data-content">
          <pre>{this.props.dataAsString}</pre>
        </div>

        <div className="demoform">
          <JsonForms />
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => {
  return { dataAsString: JSON.stringify(getData(state), null, 2) }
};

export default connect(mapStateToProps, null)(App);

