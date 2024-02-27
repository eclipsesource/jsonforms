import merge from 'lodash/merge';
import get from 'lodash/get';
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
  JsonSchema4,
  JsonSchema7,
  moveDown,
  moveUp,
  Resolve,
  update,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
  getFirstPrimitiveProp,
  createId,
  removeId,
  ArrayTranslations,
  encode,
  enumToEnumOptionMapper,
  oneOfToEnumOptionMapper,
  getI18nKeyPrefix,
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
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';

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
                  {enabled && (
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
          update(path, (array) => {
            toDelete
              .sort()
              .reverse()
              .forEach((s) => array.splice(s, 1));
            return array;
          })
        );
      },
    [dispatch]
  ),
  moveUp: useCallback(
    (path: string, toMove: number) =>
      (event: any): void => {
        event.stopPropagation();
        dispatch(
          update(path, (array) => {
            moveUp(array, toMove);
            return array;
          })
        );
      },
    [dispatch]
  ),
  moveDown: useCallback(
    (path: string, toMove: number) =>
      (event: any): void => {
        event.stopPropagation();
        dispatch(
          update(path, (array) => {
            moveDown(array, toMove);
            return array;
          })
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
): ComponentType<OwnPropsOfExpandPanel> =>
  function WithContextToExpandPanelProps({
    ctx,
    props,
  }: JsonFormsStateContext & ExpandPanelProps) {
    const dispatchProps = ctxDispatchToExpandPanelProps(ctx.dispatch);
    const {
      childLabelProp,
      schema,
      uischema,
      rootSchema,
      path,
      index,
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

function hasEnumField(schema: JsonSchema4 | JsonSchema7) {
  return schema && (schema.enum !== undefined || schema.const !== undefined);
}

function hasOneOfField(schema: JsonSchema4 | JsonSchema7) {
  return schema && schema.oneOf !== undefined;
}

function computeChildLabel(
  data: any,
  childPath: string,
  childLabelProp: any,
  schema: any,
  rootSchema: any,
  translateFct: any,
  uiSchema: any
) {
  const childData = Resolve.data(data, childPath);

  if (childLabelProp) {
    const currentValue = get(childData, childLabelProp, '');

    const childSchema = Resolve.schema(
      schema,
      `#/properties/${encode(childLabelProp)}`,
      rootSchema
    );

    if (hasEnumField(childSchema)) {
      const enumChildLabel = enumToEnumOptionMapper(
        currentValue,
        translateFct,
        getI18nKeyPrefix(schema, uiSchema, childPath)
      );

      return enumChildLabel.label;
    } else if (hasOneOfField(childSchema)) {
      const oneOfArray = childSchema.oneOf as (JsonSchema4 | JsonSchema7)[];
      const oneOfSchema = oneOfArray.find(
        (e: JsonSchema4 | JsonSchema7) => e.const === currentValue
      );

      if (oneOfSchema === undefined) return currentValue;

      const oneOfChildLabel = oneOfToEnumOptionMapper(
        oneOfSchema,
        translateFct,
        getI18nKeyPrefix(schema, uiSchema, childPath)
      );

      return oneOfChildLabel.label;
    } else {
      return currentValue;
    }
  } else {
    return get(childData, getFirstPrimitiveProp(schema), '');
  }
}

export const withJsonFormsExpandPanelProps = (
  Component: ComponentType<ExpandPanelProps>
): ComponentType<OwnPropsOfExpandPanel> =>
  withJsonFormsContext(withContextToExpandPanelProps(Component));

export default withJsonFormsExpandPanelProps(ExpandPanelRenderer);
