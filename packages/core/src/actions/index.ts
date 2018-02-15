import { RankedTester } from '../testers';
import { Renderer } from '../renderers';
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
  renderer: Renderer
) => ({
  type: ADD_RENDERER,
  tester,
  renderer
});

export const unregisterRenderer = (
  tester: RankedTester,
  renderer: Renderer
) => ({
  type: REMOVE_RENDERER,
  tester,
  renderer
});
