/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import {
  and,
  ArrayLayoutProps,
  composePaths,
  computeLabel,
  createDefaultValue,
  findUISchema,
  getData,
  isPlainLabel,
  isObjectArray,
  JsonFormsState,
  JsonSchema,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
  RankedTester,
  rankWith,
  Resolve,
  uiTypeIs
} from '@jsonforms/core';
import { ResolvedJsonForms } from '@jsonforms/react';
import {
  Avatar,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import find from 'lodash/find';
import map from 'lodash/map';
import range from 'lodash/range';
import React from 'react';
import { connect } from 'react-redux';
import { ArrayLayoutToolbar } from '../layouts/ArrayToolbar';

interface MaterialListWithDetailRendererState {
  selectedIndex: number;
}
export class MaterialListWithDetailRenderer extends React.Component<
  ArrayLayoutProps,
  MaterialListWithDetailRendererState
> {
  state: MaterialListWithDetailRendererState = {
    selectedIndex: undefined
  };
  addItem = (path: string, value: any) => this.props.addItem(path, value);
  removeItem = (path: string, value: number) => () => {
    this.props.removeItems(path, [value])();
    if (this.state.selectedIndex === value) {
      this.state.selectedIndex = undefined;
    } else if (this.state.selectedIndex > value) {
      this.state.selectedIndex--;
    }
  };
  handleListItemClick = (index: number) => () => {
    this.setState({ selectedIndex: index });
  };
  createDefaultValue = () => createDefaultValue(this.props.schema);
  render() {
    const {required, visible, errors, path, data, schema, label} = this.props;
    return (
      <Hidden xsUp={!visible}>
        <ArrayLayoutToolbar
          label={computeLabel(isPlainLabel(label) ? label : label.default, required)}
          errors={errors}
          path={path}
          addItem={this.addItem}
          createDefault={this.createDefaultValue}
        />
        <Grid container direction='row' spacing={16}>
          <Grid item xs={3}>
            <List>
              {data > 0 ? (
                map(range(data), index => (
                  <ConnectedListWithDetailMasterItem
                    index={index}
                    path={path}
                    schema={schema}
                    handleSelect={this.handleListItemClick}
                    removeItem={this.removeItem}
                    selected={this.state.selectedIndex === index}
                    key={index}
                  />
                ))
              ) : (
                <p>No data</p>
              )}
            </List>
          </Grid>
          <Grid item xs>
            {this.renderDetail()}
          </Grid>
        </Grid>
      </Hidden>
    );
  }
  private renderDetail(): any {
    const {uischemas, schema, uischema, path} = this.props;
    if (this.state.selectedIndex !== undefined) {
      const foundUISchema = findUISchema(
        uischemas,
        schema,
        uischema.scope,
        path,
        undefined,
        uischema
      );
      return (
        <ResolvedJsonForms
          uischema={foundUISchema}
          schema={schema}
          path={composePaths(path, `${this.state.selectedIndex}`)}
        />
      );
    }
    return <Typography variant='h6'>No Selection</Typography>;
  }
}
const ConnectedMaterialListWithDetailRenderer = connect(
  mapStateToArrayLayoutProps,
  mapDispatchToArrayControlProps
)(MaterialListWithDetailRenderer);

export default ConnectedMaterialListWithDetailRenderer;
ConnectedMaterialListWithDetailRenderer.displayName =
  'MaterialListWithDetailRenderer';

export const materialListWithDetailTester: RankedTester = rankWith(
  4,
  and(uiTypeIs('ListWithDetail'), isObjectArray)
);

interface OwnPropsOfMasterListItem {
  index: number;
  selected: boolean;
  path: string;
  schema: JsonSchema;
  handleSelect(index: number): () => void;
  removeItem(path: string, value: number): () => void;
}
interface StatePropsOfMasterItem extends OwnPropsOfMasterListItem {
  childLabel: string;
}
class ListWithDetailMasterItem extends React.Component<
  ListWithDetailMasterItemProps,
  any
> {
  render() {
    const {selected, handleSelect, index, childLabel, removeItem, path} = this.props;
    return (
      <ListItem
        button
        selected={selected}
        onClick={handleSelect(index)}
      >
        <ListItemAvatar>
          <Avatar aria-label='Index'>{index + 1}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={childLabel} />
        <ListItemSecondaryAction>
          <IconButton
            aria-label='Delete'
            onClick={removeItem(path, index)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

/**
 * Map state to control props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const mapStateToMasterListItemProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfMasterListItem
): StatePropsOfMasterItem => {
  const { schema, path, index } = ownProps;
  const firstPrimitiveProp = schema.properties
    ? find(Object.keys(schema.properties), propName => {
        const prop = schema.properties[propName];
        return (
          prop.type === 'string' ||
          prop.type === 'number' ||
          prop.type === 'integer'
        );
      })
    : undefined;
  const childPath = composePaths(path, `${index}`);
  const childData = Resolve.data(getData(state), childPath);
  const childLabel = firstPrimitiveProp ? childData[firstPrimitiveProp] : '';

  return {
    ...ownProps,
    childLabel
  };
};
export interface ListWithDetailMasterItemProps extends StatePropsOfMasterItem {}

const ConnectedListWithDetailMasterItem = connect(
  mapStateToMasterListItemProps
)(ListWithDetailMasterItem);
