import * as _ from 'lodash';
import {
    getPropsTransformer,
    mapDispatchToControlProps,
    mapStateToControlProps
    } from '@jsonforms/core';
import { connect } from 'react-redux';
/**
 * JSONForms specific connect function. This is a wrapper
 * around redux's connect function that executes any registered
 * prop transformers on the result of the given mapStateToProps
 * function before passing them to the actual connect function.
 *
 * @param {(state, ownProps) => any} mapStateToProps
 * @param {(dispatch, ownProps) => any} mapDispatchToProps
 * @returns {(Component) => any} function expecting a Renderer Component to be connected
 */
export const connectToJsonForms = (
  mapStateToProps: (state, ownProps) => any = mapStateToControlProps,
  mapDispatchToProps: (dispatch, ownProps) => any = mapDispatchToControlProps) => Component => {

  return connect(
    (state, ownProps) =>
      (getPropsTransformer(state) || []).reduce(
        (props, materializer) => {
          return _.merge(props, materializer(state, props));
        },
        mapStateToProps(state, ownProps)
      ),
    mapDispatchToProps
  )(Component);
};
