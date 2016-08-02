function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require('angular');
var form_1 = require('./components/form/form');
var capitalize_filter_1 = require('./components/ng-services/capitalize/capitalize.filter');
var pathresolver_service_1 = require('./components/ng-services/pathresolver/pathresolver-service');
var jsonforms_bootstrap_1 = require('./bootstrap/jsonforms_bootstrap');
require('angular-ui-validate');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms', [
    'ui.validate',
    form_1.default,
    capitalize_filter_1.default,
    pathresolver_service_1.default,
    jsonforms_bootstrap_1.default
]).name;
__export(require('./uischema'));
__export(require('./jsonschema'));
var abstract_control_1 = require('./components/renderers/controls/abstract-control');
exports.AbstractControl = abstract_control_1.AbstractControl;
var testers_1 = require('./components/renderers/testers');
exports.Testers = testers_1.Testers;
exports.schemaTypeIs = testers_1.schemaTypeIs;
exports.schemaTypeMatches = testers_1.schemaTypeMatches;
exports.schemaPropertyName = testers_1.schemaPropertyName;
exports.schemaPathEndsWith = testers_1.schemaPathEndsWith;
exports.uiTypeIs = testers_1.uiTypeIs;
exports.optionIs = testers_1.optionIs;
exports.always = testers_1.always;
var jsonforms_pathresolver_1 = require('./components/services/pathresolver/jsonforms-pathresolver');
exports.PathResolver = jsonforms_pathresolver_1.PathResolver;
//# sourceMappingURL=index.js.map