import merge from 'lodash/merge';
import React, {
  ComponentType,
  Dispatch,
  Fragment,
  ReducerAction,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  JsonFormsDispatch,
  JsonFormsStateContext,
  withJsonFormsContext,
} from '@jsonforms/react';
import {
  composePaths,
  ControlElement,
  findUISchema,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  moveDown,
  moveUp,
  update,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
  createId,
  removeId,
  ArrayTranslations,
  computeChildLabel,
  UpdateArrayContext,
} from '@jsonforms/core';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

const iconStyle: any = { float: 'right' };

interface OwnPropsOfExpandPanel {
  enabled: boolean;
  index: number;
  path: string;
  uischema: ControlElement;
  schema: JsonSchema;
  expanded: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  uischemas?: JsonFormsUISchemaRegistryEntry[];
  rootSchema: JsonSchema;
  enableMoveUp: boolean;
  enableMoveDown: boolean;
  config: any;
  childLabelProp?: string;
  handleExpansion(panel: string): (event: any, expanded: boolean) => void;
  translations: ArrayTranslations;
  disableRemove?: boolean;
}

interface StatePropsOfExpandPanel extends OwnPropsOfExpandPanel {
  childLabel: string;
  childPath: string;
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
    DispatchPropsOfExpandPanel {}

const ExpandPanelRendererComponent = (props: ExpandPanelProps) => {
  const [labelHtmlId] = useState<string>(createId('expand-panel'));

  useEffect(() => {
    return () => {
      removeId(labelHtmlId);
    };
  }, [labelHtmlId]);

  const {
    enabled,
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
    renderers,
    cells,
    config,
    translations,
    disableRemove,
  } = props;

  const foundUISchema = useMemo(
    () =>
      findUISchema(
        uischemas,
        schema,
        uischema.scope,
        path,
        undefined,
        uischema,
        rootSchema
      ),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema]
  );

  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const showSortButtons =
    appliedUiSchemaOptions.showSortButtons ||
    appliedUiSchemaOptions.showArrayLayoutSortButtons;

  return (
    <Accordion
      aria-labelledby={labelHtmlId}
      expanded={expanded}
      onChange={handleExpansion(childPath)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container alignItems={'center'}>
          <Grid item xs={7} md={9}>
            <Grid container alignItems={'center'}>
              <Grid item xs={2} md={1}>
                <Avatar aria-label='Index'>{index + 1}</Avatar>
              </Grid>
              <Grid item xs={10} md={11}>
                <span id={labelHtmlId}>{childLabel}</span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} md={3}>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Grid
                  container
                  direction='row'
                  justifyContent='center'
                  alignItems='center'
                >
                  {showSortButtons && enabled ? (
                    <Fragment>
                      <Grid item>
                        <Tooltip
                          id='tooltip-up'
                          title={translations.up}
                          placement='bottom'
                          open={enableMoveUp ? undefined : false}
                        >
                          <IconButton
                            onClick={moveUp(path, index)}
                            style={iconStyle}
                            disabled={!enableMoveUp}
                            aria-label={translations.upAriaLabel}
                            size='large'
                          >
                            <ArrowUpward />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          id='tooltip-down'
                          title={translations.down}
                          placement='bottom'
                          open={enableMoveDown ? undefined : false}
                        >
                          <IconButton
                            onClick={moveDown(path, index)}
                            style={iconStyle}
                            disabled={!enableMoveDown}
                            aria-label={translations.downAriaLabel}
                            size='large'
                          >
                            <ArrowDownward />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Fragment>
                  ) : (
                    ''
                  )}
                  {enabled && !disableRemove && (
                    <Grid item>
                      <Tooltip
                        id='tooltip-remove'
                        title={translations.removeTooltip}
                        placement='bottom'
                      >
                        <IconButton
                          onClick={removeItems(path, [index])}
                          style={iconStyle}
                          aria-label={translations.removeAriaLabel}
                          size='large'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <JsonFormsDispatch
          enabled={enabled}
          schema={schema}
          uischema={foundUISchema}
          path={childPath}
          key={childPath}
          renderers={renderers}
          cells={cells}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const ExpandPanelRenderer = React.memo(ExpandPanelRendererComponent);

/**
 * Maps state to dispatch properties of an expand pandel control.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfArrayControl} dispatch props of an expand panel control
 */
export const ctxDispatchToExpandPanelProps: (
  dispatch: Dispatch<ReducerAction<any>>
) => DispatchPropsOfExpandPanel = (dispatch) => ({
  removeItems: useCallback(
    (path: string, toDelete: number[]) =>
      (event: any): void => {
        event.stopPropagation();
        dispatch(
          update(
            path,
            (array) => {
              toDelete
                .sort()
                .reverse()
                .forEach((s) => array.splice(s, 1));
              return array;
            },
            { type: 'REMOVE', indices: toDelete } as UpdateArrayContext
          )
        );
      },
    [dispatch]
  ),
  moveUp: useCallback(
    (path: string, toMove: number) =>
      (event: any): void => {
        event.stopPropagation();
        dispatch(
          update(
            path,
            (array) => {
              moveUp(array, toMove);
              return array;
            },
            {
              type: 'MOVE',
              moves: [{ from: toMove, to: toMove - 1 }],
            } as UpdateArrayContext
          )
        );
      },
    [dispatch]
  ),
  moveDown: useCallback(
    (path: string, toMove: number) =>
      (event: any): void => {
        event.stopPropagation();
        dispatch(
          update(
            path,
            (array) => {
              moveDown(array, toMove);
              return array;
            },
            {
              type: 'MOVE',
              moves: [{ from: toMove, to: toMove + 1 }],
            } as UpdateArrayContext
          )
        );
      },
    [dispatch]
  ),
});

/**
 * Map state to control props.
 * @param state the JSON Forms state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const withContextToExpandPanelProps = (
  Component: ComponentType<ExpandPanelProps>
): ComponentType<{
  ctx: JsonFormsStateContext;
  props: OwnPropsOfExpandPanel;
}> => {
  return function WithContextToExpandPanelProps({
    ctx,
    props,
  }: {
    ctx: JsonFormsStateContext;
    props: ExpandPanelProps;
  }) {
    const dispatchProps = ctxDispatchToExpandPanelProps(ctx.dispatch);
    const {
      // eslint is unable to detect that these props are "checked" via Typescript already
      // eslint-disable-next-line react/prop-types
      childLabelProp,
      // eslint-disable-next-line react/prop-types
      schema,
      // eslint-disable-next-line react/prop-types
      uischema,
      // eslint-disable-next-line react/prop-types
      rootSchema,
      // eslint-disable-next-line react/prop-types
      path,
      // eslint-disable-next-line react/prop-types
      index,
      // eslint-disable-next-line react/prop-types
      uischemas,
    } = props;
    const childPath = composePaths(path, `${index}`);

    const childLabel = useMemo(() => {
      return computeChildLabel(
        ctx.core.data,
        childPath,
        childLabelProp,
        schema,
        rootSchema,
        ctx.i18n.translate,
        uischema
      );
    }, [
      ctx.core.data,
      childPath,
      childLabelProp,
      schema,
      rootSchema,
      ctx.i18n.translate,
      uischema,
    ]);

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
};

export const withJsonFormsExpandPanelProps = (
  Component: ComponentType<ExpandPanelProps>
): ComponentType<OwnPropsOfExpandPanel> =>
  withJsonFormsContext(withContextToExpandPanelProps(Component));

export default withJsonFormsExpandPanelProps(ExpandPanelRenderer);
