import * as React from 'react';
import { Component } from 'react';
import * as _ from 'lodash';

export class Rating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: props.value,
      hoverAt: null
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (prevState.rating !== nextProps.value) {
      return {
        rating: nextProps.value,
        hoverAt: prevState.hoverAt
      };
    }
    return null;
  };

  handleMouseOver(idx) {
    this.setState({
      hoverAt: idx + 1
    });
  }

  handleMouseOut() {
    this.setState({
      hoverAt: null
    });
  }

  handleClick(idx) {
    this.setState({
      rating: idx + 1
    });
  }

  render() {
    const { onClick } = this.props;

    return (
      <div>
        {
          _.range(0, 5).map(i => {
            const rating = this.state.hoverAt != null ? this.state.hoverAt : this.state.rating;

            return (
              <span
                onMouseOver={() => {
                  this.handleMouseOver(i);
                }}
                onMouseOut={() => {
                  this.handleMouseOut();
                }}
                onClick={() => {
                  this.handleClick(i);
                  onClick({ value: i + 1});
                }}
                key={`${this.props.id}_${i}`}
                style={{cursor: 'pointer'}}
              >
                {i < rating ? '\u2605' : '\u2606'}
              </span>
            );
          })
        }
      </div>
    );
  }
}
