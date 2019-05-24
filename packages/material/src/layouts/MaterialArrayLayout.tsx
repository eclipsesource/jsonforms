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
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import find from 'lodash/find';
import range from 'lodash/range';
import React from 'react';
import {
  ArrayLayoutProps,
  composePaths,
  computeLabel,
  ControlElement,
  createDefaultValue,
  findUISchema,
  getData,
  isPlainLabel,
  JsonFormsRendererRegistryEntry,
  JsonFormsState,
  JsonSchema,
  Resolve,
  UISchemaElement,
  UISchemaTester,
  update
} from '@jsonforms/core';
import { ResolvedJsonForms } from '@jsonforms/react';
import IconButton from '@material-ui/core/IconButton';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import map from 'lodash/map';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownWard from '@material-ui/icons/ArrowDownWard';
import { connect } from 'react-redux';
import { AnyAction, Dispatch } from 'redux';
import { ArrayLayoutToolbar } from './ArrayToolbar';

const paperStyle = { padding: 10 };
const iconStyle: any = { float: 'right' };
interface MaterialArrayLayoutState {
  expanded: string | boolean;
}
export class MaterialArrayLayout extends React.Component<ArrayLayoutProps, MaterialArrayLayoutState> {
  state: MaterialArrayLayoutState = {
    expanded: null
  };
  innerCreateDefaultValue = () => createDefaultValue(this.props.schema);
  handleChange = (panel: string) => (_event: any, expanded: boolean) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };
  isExpanded = (index: number) =>
    this.state.expanded === composePaths(this.props.path, `${index}`);
  render() {
    const {
      data,
      path,
      schema,
      uischema,
      errors,
      addItem,
      renderers,
      label,
      required
    } = this.props;

    return (
      <Paper style={paperStyle}>
        <ArrayLayoutToolbar
          label={computeLabel(isPlainLabel(label) ? label : label.default, required)}
          errors={errors}
          path={path}
          addItem={addItem}
          createDefault={this.innerCreateDefaultValue}
        />
        <div>
          {data > 0 ? (
            map(range(data), index => {
              return (
                <ConnectedExpandPanelRenderer
                  index={index}
                  expanded={this.isExpanded(index)}
                  schema={schema}
                  path={path}
                  handleExpansion={this.handleChange}
                  uischema={uischema}
                  renderers={renderers}
                  key={index}
                  isLast={(data - 1) == index}
                />
              );
            })
          ) : (
              <p>No data</p>
            )}
        </div>
      </Paper>
    );
  }
}

class ExpandPanelRenderer extends React.Component<ExpandPanelProps, any> {
  render() {
    const {
      index,
      expanded,
      childLabel,
      schema,
      childPath,
      removeItems,
      moveDown,
      moveUp,
      path,
      handleExpansion,
      uischema,
      uischemas,
      renderers,
      isLast
    } = this.props;
    const foundUISchema = findUISchema(
      uischemas,
      schema,
      uischema.scope,
      path,
      undefined,
      uischema
    );
    debugger;
    return (
      <ExpansionPanel expanded={expanded} onChange={handleExpansion(childPath)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container alignItems={'center'}>
            <Grid item xs={10}>
              <Grid container alignItems={'center'}>
                <Grid item xs={1}>
                  <Avatar aria-label='Index'>{index + 1}</Avatar>
                </Grid>
                <Grid item xs={2}>
                  {childLabel}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container justify={'flex-end'}>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    {uischema.options && uischema.options.sortButtons ?
                      <Grid item>
                        <IconButton
                          onClick={moveUp(path, index)}
                          style={iconStyle}
                        >
                          <ArrowUpward color={index == 0 ? "disabled" : "inherit"} />
                        </IconButton>
                      </Grid> : ""}
                    {uischema.options && uischema.options.sortButtons ?
                      <Grid item>
                        <IconButton
                          onClick={moveDown(path, index)}
                          style={iconStyle}
                        >
                          <ArrowDownWard color={isLast ? "disabled" : "inherit"} />
                        </IconButton>
                      </Grid> :
                      ""}
                    <Grid item>
                      <IconButton
                        onClick={removeItems(path, [index])}
                        style={iconStyle}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ResolvedJsonForms
            schema={schema}
            uischema={foundUISchema}
            path={childPath}
            key={childPath}
            renderers={renderers}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

interface OwnPropsOfExpandPanel {
  index: number;
  path: string;
  uischema: ControlElement;
  schema: JsonSchema;
  expanded: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  handleExpansion(panel: string): (event: any, expanded: boolean) => void;
  isLast?: boolean;
}
interface StatePropsOfExpandPanel extends OwnPropsOfExpandPanel {
  childLabel: string;
  childPath: string;
  uischemas: { tester: UISchemaTester; uischema: UISchemaElement }[];
}
/**
 * Map state to control props.
 * @param state the store's state
 * @param ownProps any own props
* @returns {StatePropsOfControl} state props for a control
  */
export const mapStateToExpandPanelProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfExpandPanel
): StatePropsOfExpandPanel => {
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
    childLabel,
    childPath,
    uischemas: state.jsonforms.uischemas
  };
};

/**
 * Dispatch props of a table control
 */
export interface DispatchPropsOfExpandPanel {
  removeItems(path: string, toDelete: number[]): (event: any) => void;
  moveUp(path: string, toMove: number): (event: any) => void;
  moveDown(path: string, toMove: number): (event: any) => void;
}

/**
 * Maps state to dispatch properties of an expand pandel control.
 *
 * @param dispatch the store's dispatch method
* @returns {DispatchPropsOfArrayControl} dispatch props of an expand panel control
  */
export const mapDispatchToExpandPanelProps: (dispatch: Dispatch<AnyAction>) => DispatchPropsOfExpandPanel = dispatch => ({
  removeItems: (path: string, toDelete: number[]) => (event: any): void => {
    event.stopPropagation();
    dispatch(
      update(path, array => {
        toDelete
          .sort()
          .reverse()
          .forEach(s => array.splice(s, 1));
        return array;
      })
    );
  },
  moveUp: (path: string, toMove: number) => (event: any): void => {
    event.stopPropagation();
    dispatch(
      update(path, array => {
        if (toMove == 0) {
          return array;
        }
        let elementToMove = array[toMove];
        array[toMove] = array[toMove - 1]
        array[toMove - 1] = elementToMove
        return array;
      })
    );
  },
  moveDown: (path: string, toMove: number) => (event: any): void => {
    event.stopPropagation();
    dispatch(
      update(path, array => {
        if (toMove == array.length - 1) {
          return array;
        }
        let elementToMove = array[toMove];
        array[toMove] = array[toMove + 1]
        array[toMove + 1] = elementToMove
        return array;
      })
    );
  },
});
export interface ExpandPanelProps
  extends StatePropsOfExpandPanel,
  DispatchPropsOfExpandPanel { }

const ConnectedExpandPanelRenderer = connect(
  mapStateToExpandPanelProps,
  mapDispatchToExpandPanelProps
)(ExpandPanelRenderer);
