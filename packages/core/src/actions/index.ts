import { RankedTester } from '../testers';
import { JsonSchema, UISchemaElement } from '../';
import { generateDefaultUISchema, generateJsonSchema } from '../generators';

const NAMESPACE = 'jsonforms';

export const INIT = `${NAMESPACE}/INIT`;
export const UPDATE_DATA: 'jsonforms/UPDATE' = 'jsonforms/UPDATE';
export const VALIDATE = `${NAMESPACE}/VALIDATE`;
export const ADD_RENDERER = `${NAMESPACE}/ADD_RENDERER`;
export const REMOVE_RENDERER = `${NAMESPACE}/REMOVE_RENDERER`;
export const ADD_FIELD = `${NAMESPACE}/ADD_FIELD`;
export const REMOVE_FIELD = `${NAMESPACE}/REMOVE_FIELD`;
export const SET_CONFIG = `${NAMESPACE}/SET_CONFIG`;

export interface UpdateAction {
  type: 'jsonforms/UPDATE';
  path: string;
  updater(existingData?: any): any;
}

export const init = (
  data: any,
  schema: JsonSchema = generateJsonSchema(data),
  uischema: UISchemaElement = generateDefaultUISchema(schema)
) =>
    ({
      type: INIT,
      data,
      schema,
      uischema
    });

export const update =
  (path: string, updater: (any) => any): UpdateAction => ({
    type: UPDATE_DATA,
    path,
    updater
  });

export const registerRenderer = (
  tester: RankedTester,
  renderer: any
) => ({
  type: ADD_RENDERER,
  tester,
  renderer
});

export const registerField = (
  tester: RankedTester,
  field: any
) => ({
  type: ADD_FIELD,
  tester,
  field
});

export const unregisterField = (
  tester: RankedTester,
  field: any
) => ({
  type: REMOVE_FIELD,
  tester,
  field
});

export const unregisterRenderer = (
  tester: RankedTester,
  renderer: any
) => ({
  type: REMOVE_RENDERER,
  tester,
  renderer
});

export const setConfig = config => dispatch => {
  dispatch({
    type: SET_CONFIG,
    config,
  });
};
