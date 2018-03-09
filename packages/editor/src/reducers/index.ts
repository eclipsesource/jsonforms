import * as _ from 'lodash';

export const ADD_UI_SCHEMA: 'jsonforms/editor/ADD_UISCHEMA' = 'jsonforms/editor/ADD_UISCHEMA';

export const getUiSchemata = state => extractUiSchemata(state.jsonforms.editor);

export interface AddUiSchemaAction {
  type: 'jsonforms/editor/ADD_UISCHEMA';
  schemaId: string;
  uiSchema: any;
}

const extractUiSchemata = state => state.uiSchemata;

export const addUiSchema = (schemaId: string, uiSchema): AddUiSchemaAction => {
    return {
        type: ADD_UI_SCHEMA,
        schemaId: schemaId,
        uiSchema: uiSchema
    };
};

export interface EditorState {
    uiSchemata?: { [uiSchemaId: string]: any };
}

export const editorReducer = (
    state = {
        uiSchemata: {}
    },
    action): EditorState => {
      switch (action.type) {
        case ADD_UI_SCHEMA:
          if (_.isEmpty(action.schemaId)) {
              return state;
          }
          if (action.uiSchema === undefined || action.uiSchema === null) {
              return state;
          }

          return {
              uiSchemata: _.merge({}, state.uiSchemata, { [action.schemaId]: action.uiSchema })
          };
        default:
          return state;
      }
    };
