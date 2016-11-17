
import 'angular';
import form from './components/form/form';
import ngServices from './components/ng-services/ng-services';

require('angular-ui-validate');

export default angular.module('jsonforms', [
    'ui.validate',
    form,
    ngServices
]).name;

export interface JsonFormsScope extends angular.IScope {
    data: any;
    schema: any;
    uiSchema: any;
}

export * from './uischema';
export * from './jsonschema';

export {AbstractControl} from './components/renderers/controls/abstract-control'


export {
    Testers,
    schemaTypeIs,
    schemaTypeMatches,
    schemaPropertyName,
    schemaPathEndsWith,
    uiTypeIs,
    optionIs,
    always
} from './components/renderers/testers';

export {PathResolver}
    from './components/services/path-resolver/path-resolver';
