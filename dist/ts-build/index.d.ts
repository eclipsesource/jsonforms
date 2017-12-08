declare var _default: string;
export default _default;
export interface JsonFormsScope extends angular.IScope {
    data: any;
    schema: any;
    uiSchema: any;
}
export * from './uischema';
export * from './jsonschema';
export { AbstractControl } from './components/renderers/controls/abstract-control';
export { Testers, schemaTypeIs, schemaTypeMatches, schemaPropertyName, schemaPathEndsWith, uiTypeIs, optionIs, always } from './components/renderers/testers';
export { PathResolver } from './components/services/path-resolver/path-resolver';
