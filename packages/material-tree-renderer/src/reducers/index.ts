import * as _ from 'lodash';
import { ModelMapping } from '../editor-context';
import { Property } from '../services/property.util';

export const ADD_UI_SCHEMA: 'jsonforms/treeWithDetail/ADD_UISCHEMA' =
  'jsonforms/treeWithDetail/ADD_UISCHEMA';
export const SET_CONTAINER_PROPERTIES:
  'jsonforms/treeWithDetail/SET_CONTAINER_PROPERTIES' =
  'jsonforms/treeWithDetail/SET_CONTAINER_PROPERTIES';

export const getUiSchemata = state => extractUiSchemata(state.jsonforms.treeWithDetail);
export const getImageMapping = state => extractImageMapping(state.jsonforms.treeWithDetail);
export const getLabelMapping = state => extractLabelMapping(state.jsonforms.treeWithDetail);
export const getModelMapping = state => extractModelMapping(state.jsonforms.treeWithDetail);
export const getResources = state => extractResources(state.jsonforms.treeWithDetail);
export const getIdentifyingProperty = state =>
  extractIdentifyingProperty(state.jsonforms.treeWithDetail);
export const getContainerProperties = state =>
  extractContainerProperties(state.jsonforms.treeWithDetail);

export interface AddUiSchemaAction {
    type: 'jsonforms/treeWithDetail/ADD_UISCHEMA';
    schemaId: string;
    uiSchema: any;
}

export interface SetContainerPropertiesAction {
  type: 'jsonforms/treeWithDetail/SET_CONTAINER_PROPERTIES';
  containerProperties: { [schemaId: string]: Property[] };
}

const extractUiSchemata = state => state.uiSchemata;
const extractImageMapping = state => state.imageMapping;
const extractLabelMapping = state => state.labelMapping;
const extractModelMapping = state => state.modelMapping;
const extractResources = state => state.resources;
const extractIdentifyingProperty = state => state.identifyingProperty;
const extractContainerProperties = state => state.containerProperties;

// TODO Add action to add a resource when referencing is implemented

/**
 * Creates an action to add a detail UI schema for the Tree with detail.
 * If there already is a UI Schema for the given schema id,
 * it is overwritten with the given one.
 *
 * @param schemaId The JSON Schema's id for which the UI Schema will be used
 * @param uiSchema The UI Schema defining the rendered detail view
 */
export const addUiSchema = (schemaId: string, uiSchema): AddUiSchemaAction => {
    return {
        type: ADD_UI_SCHEMA,
        schemaId: schemaId,
        uiSchema: uiSchema
    };
};

/**
 * Creates an action to set calculated container properties for the given schema id
 * If there already are container properties for the given schema id
 * they are overwritten with the given one
 *
 * @param containerProperties
 * @returns {SetContainerPropertiesAction}
 */
export const setContainerProperties =
  (containerProperties: { [schemaId: string]: Property[] }):
    SetContainerPropertiesAction => {
  return {
    type: SET_CONTAINER_PROPERTIES,
    containerProperties: containerProperties
  };
};

export interface TreeWithDetailState {
    uiSchemata?: { [uiSchemaId: string]: any };
    /**
     * Configures the image mappings for the types defined in the treeWithDetail's schema.
     * An image mapping maps from a schema id to the schema's image name.
     *  This name is used to resolve the css style that configure a label
     * for instances of the type in the containment tree.
     * Both the id and the name are configured as Strings.
     */
    imageMapping?: { [schemaId: string]: string };
    /**
     * Configures the label mappings for the types defined in the treeWithDetail's schema.
     * A label mapping maps from a schema id to a property defined in this schema.
     * This property defines the name of a rendered object in the containment tree.
     * Both the id and the property name are configured as Strings.
     */
    labelMapping?: { [schemaId: string]: string };
    /**
     * The model mapping defines mappings from a property value to a type.
     * Thereby, the model mapping defines which property is considered.
     * This property is the same for all types.
     * A mapping maps from a specific value of this property to a schema id.
     * If an element contains a mapped value in the defined property,
     * it is assumed to be of the type defined by the mapped schema id.
     *
     * A model mapping is necessary for all types used in anyOf sections of a schema
     * in order to determine which type objects of a "anyOf-property" belong to.
     */
    modelMapping?: ModelMapping;

    /**
     * Property names define the name of the resource.
     * This name is used in reference configurations to define
     * which data is searched for reference targets.
     * The content is the actual data.
     * e.g.
     * {
     *   'data1': { "name": "Robert", "age": 25 },
     *   'data2': { "name": "Bello", "species": "dog", "sex": "male"}
     * }
     */
    resources?: { [property: string]: Object };

    /**
     * The identifying property is the name of the property that contains
     * a data element's unique ID when id-based referencing is used.
     */
    identifyingProperty?: string;

    /**
     * Stores calculated container properties for a given schema
     */
    containerProperties: { [schemaId: string]: Property[] };
}

export const treeWithDetailReducer = (
    state: TreeWithDetailState = {
        uiSchemata: {},
        containerProperties: {}
    },
    action): TreeWithDetailState => {
    switch (action.type) {
        case ADD_UI_SCHEMA:
            if (_.isEmpty(action.schemaId)) {
                return state;
            }
            if (action.uiSchema === undefined || action.uiSchema === null) {
                return state;
            }
            const uiSchemata = _.merge({},
                                       state.uiSchemata,
                                       { [action.schemaId]: action.uiSchema });
            return {
                ...state,
                uiSchemata: uiSchemata
            };
        case SET_CONTAINER_PROPERTIES:
            return {
              ...state,
              containerProperties: action.containerProperties
            };
        default:
            return state;
    }
};
