var uischemaregistry_service_1 = require('./uischemaregistry/uischemaregistry-service');
var pathresolver_service_1 = require('./pathresolver/pathresolver-service');
var label_service_1 = require('./label/label-service');
var capitalize_filter_1 = require('./capitalize/capitalize.filter');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms.services', [
    uischemaregistry_service_1.default,
    pathresolver_service_1.default,
    label_service_1.default,
    capitalize_filter_1.default
]).name;
//# sourceMappingURL=ng-services.js.map