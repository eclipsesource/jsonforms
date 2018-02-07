import * as _ from 'lodash';
import {
    getPropsTransformer,
    mapDispatchToControlProps,
    mapStateToControlProps
    } from '@jsonforms/core';
import { connect } from 'react-redux';

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
