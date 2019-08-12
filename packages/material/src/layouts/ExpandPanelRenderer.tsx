import React, { Fragment, Dispatch, ReducerAction } from 'react';
import { ComponentType } from 'enzyme';
import {
  areEqual,
  JsonFormsDispatch,
  JsonFormsStateContext,
  withJsonFormsContext
} from '@jsonforms/react';
import {
  composePaths,
  ControlElement,
  findUISchema,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  moveDown,
  moveUp,
  Resolve,
  UISchemaElement,
  UISchemaTester,
  update
} from '@jsonforms/core';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import IconButton from '@material-ui/core/IconButton';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import find from 'lodash/find';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

const iconStyle: any = { float: 'right' };

interface OwnPropsOfExpandPanel {
  index: number;
  path: string;
  uischema: ControlElement;
  schema: JsonSchema;
  expanded: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  rootSchema: JsonSchema;
  enableMoveUp: boolean;
  enableMoveDown: boolean;
  handleExpansion(panel: string): (event: any, expanded: boolean) => void;
}

interface StatePropsOfExpandPanel extends OwnPropsOfExpandPanel {
  childLabel: string;
  childPath: string;
  uischemas: { tester: UISchemaTester; uischema: UISchemaElement }[];
  enableMoveUp: boolean;
  enableMoveDown: boolean;
}

/**
 * Dispatch props of a table control
 */
export interface DispatchPropsOfExpandPanel {
  removeItems(path: string, toDelete: number[]): (event: any) => void;
  moveUp(path: string, toMove: number): (event: any) => void;
  moveDown(path: string, toMove: number): (event: any) => void;
}

export interface ExpandPanelProps
  extends StatePropsOfExpandPanel,
  DispatchPropsOfExpandPanel { }

const ExpandPanelRenderer = (props: ExpandPanelProps) => {
  const {
    childLabel,
    childPath,
    index,
    expanded,
    moveDown,
    moveUp,
    enableMoveDown,
    enableMoveUp,
    handleExpansion,
    removeItems,
    path,
    rootSchema,
    schema,
    uischema,
    uischemas,
    renderers
  } = props;

  const foundUISchema = findUISchema(
    uischemas,
    schema,
    uischema.scope,
    path,
    undefined,
    uischema,
    rootSchema
  );

  return (
    <ExpansionPanel expanded={expanded} onChange={handleExpansion(childPath)}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container alignItems={'center'}>
          <Grid item xs={7} md={10}>
            <Grid container alignItems={'center'}>
              <Grid item xs={2} md={1}>
                <Avatar aria-label='Index'>{index + 1}</Avatar>
              </Grid>
              <Grid item xs={10} md={11}>
                {childLabel}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} md={2}>
            <Grid container justify={'flex-end'}>
              <Grid item>
                <Grid
                  container
                  direction='row'
                  justify='center'
                  alignItems='center'
                >
                  {uischema.options && uischema.options.showSortButtons ? (
                    <Fragment>
                      <Grid item>
                        <IconButton
                          onClick={moveUp(path, index)}
                          style={iconStyle}
                          disabled={!enableMoveUp}
                          aria-label={`Move up`}
                        >
                          <ArrowUpward />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={moveDown(path, index)}
                          style={iconStyle}
                          disabled={!enableMoveDown}
                          aria-label={`Move down`}
                        >
                          <ArrowDownward />
                        </IconButton>
                      </Grid>
                    </Fragment>
                  ) : (
                      ''
                    )}
                  <Grid item>
                    <IconButton
                      onClick={removeItems(path, [index])}
                      style={iconStyle}
                      aria-label={`Delete`}
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
        <JsonFormsDispatch
          schema={schema}
          uischema={foundUISchema}
          path={childPath}
          key={childPath}
          renderers={renderers}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

/**
 * Maps state to dispatch properties of an expand pandel control.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfArrayControl} dispatch props of an expand panel control
 */
export const ctxDispatchToExpandPanelProps: (
  dispatch: Dispatch<ReducerAction<any>>
) => DispatchPropsOfExpandPanel = dispatch => ({
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
        moveUp(array, toMove);
        return array;
      })
    );
  },
  moveDown: (path: string, toMove: number) => (event: any): void => {
    event.stopPropagation();
    dispatch(
      update(path, array => {
        moveDown(array, toMove);
        return array;
      })
    );
  }
});

/**
 * Map state to control props.
 * @param state the JSON Forms state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const withContextToExpandPanelProps = (
  Component: ComponentType<ExpandPanelProps>
): ComponentType<OwnPropsOfExpandPanel> => ({
  ctx,
  props
}: JsonFormsStateContext & ExpandPanelProps) => {
    const dispatchProps = ctxDispatchToExpandPanelProps(ctx.dispatch);
    const { schema, path, index, uischemas } = props;
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
    const childData = Resolve.data(ctx.core.data, childPath);
    const childLabel = firstPrimitiveProp ? childData[firstPrimitiveProp] : '';

    return (
      <Component
        {...props}
        {...dispatchProps}
        childLabel={childLabel}
        childPath={childPath}
        uischemas={uischemas}
      />
    );
  };

export const withJsonFormsExpandPanelProps = (
  Component: ComponentType<ExpandPanelProps>
): ComponentType<OwnPropsOfExpandPanel> =>
  withJsonFormsContext(
    withContextToExpandPanelProps(
      React.memo(
        Component,
        (prevProps: ExpandPanelProps, nextProps: ExpandPanelProps) =>
          areEqual(prevProps, nextProps)
      )
    )
  );

export default withJsonFormsExpandPanelProps(ExpandPanelRenderer);
