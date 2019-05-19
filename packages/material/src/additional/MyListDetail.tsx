import {
  and,
  ArrayLayoutProps,
  isObjectArray,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { StatelessRenderer } from '@jsonforms/react';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { connect } from 'react-redux';
import { MaterialListWithDetailRenderer } from './MaterialListWithDetailRenderer';

const myFunc = (_data: any, index: number) => (
  <React.Fragment>
    <DeleteIcon />
    {`Foo ${index}`}
  </React.Fragment>
);
const MyListWithDetail: StatelessRenderer<ArrayLayoutProps> = props => {
  return (
    <MaterialListWithDetailRenderer {...props} masterLabelNodeFnc={myFunc} />
  );
};

export default connect(
  mapStateToArrayLayoutProps,
  mapDispatchToArrayControlProps
)(MyListWithDetail);

export const materialMyListWithDetailTester: RankedTester = rankWith(
  5,
  and(uiTypeIs('ListWithDetail'), isObjectArray)
);
