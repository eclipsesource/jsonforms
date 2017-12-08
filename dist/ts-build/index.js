"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require('angular');
var form_1 = require('./components/form/form');
var ng_services_1 = require('./components/ng-services/ng-services');
require('angular-ui-validate');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms', [
    'ui.validate',
    form_1.default,
    ng_services_1.default
]).name;
__export(require('./uischema'));
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
var path_resolver_1 = require('./components/services/path-resolver/path-resolver');
exports.PathResolver = path_resolver_1.PathResolver;
//# sourceMappingURL=index.js.map