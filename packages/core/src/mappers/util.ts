import { JsonSchema, UISchemaElement } from '../models';
import { JsonFormsState, getAjv } from '../store';
import { hasEnableRule, isEnabled } from '../util';

/**
 * Indicates whether the given `uischema` element shall be enabled or disabled.
 * Checks the global readonly flag, uischema rule, uischema options (including the config),
 * the schema and the enablement indicator of the parent.
 */
export const isInherentlyEnabled = (
  state: JsonFormsState,
  ownProps: any,
  uischema: UISchemaElement,
  schema: (JsonSchema & { readOnly?: boolean }) | undefined,
  rootData: any,
  config: any
) => {
  if (state?.jsonforms?.readonly) {
    return false;
  }
  if (uischema && hasEnableRule(uischema)) {
    return isEnabled(uischema, rootData, ownProps?.path, getAjv(state));
  }
  if (typeof uischema?.options?.readonly === 'boolean') {
    return !uischema.options.readonly;
  }
  if (typeof uischema?.options?.readOnly === 'boolean') {
    return !uischema.options.readOnly;
  }
  if (typeof config?.readonly === 'boolean') {
    return !config.readonly;
  }
  if (typeof config?.readOnly === 'boolean') {
    return !config.readOnly;
  }
  if (schema?.readOnly === true) {
    return false;
  }
  if (typeof ownProps?.enabled === 'boolean') {
    return ownProps.enabled;
  }
  return true;
};
