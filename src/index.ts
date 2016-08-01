
import 'angular';
import form from './components/form/form';
import capitalize from './components/ng-services/capitalize/capitalize.filter';
import pathResolver from './components/ng-services/pathresolver/pathresolver-service';
import jsonformsBootstrap from './bootstrap/jsonforms_bootstrap';

require('angular-ui-validate');

export default angular.module('jsonforms', [
    'ui.validate',
    form,
    capitalize,
    pathResolver,
    jsonformsBootstrap
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
    from './components/services/pathresolver/jsonforms-pathresolver';

