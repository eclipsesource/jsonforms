"use strict";
var ui_schema_registry_service_1 = require('./ui-schema-registry/ui-schema-registry.service');
var path_resolver_service_1 = require('./path-resolver/path-resolver.service');
var label_service_1 = require('./label/label.service');
var capitalize_filter_1 = require('./capitalize/capitalize.filter');
var services_1 = require("../services/services");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms.services', [
    ui_schema_registry_service_1.default,
    path_resolver_service_1.default,
    label_service_1.default,
    capitalize_filter_1.default
]).value('ServiceIds', {
    validation: services_1.ServiceId.Validation,
    data: services_1.ServiceId.DataProvider,
    schema: services_1.ServiceId.SchemaProvider,
    uischema: services_1.ServiceId.UiSchemaProvider,
    scope: services_1.ServiceId.ScopeProvider,
    rule: services_1.ServiceId.RuleService,
    path: services_1.ServiceId.PathResolver
}).name;
//# sourceMappingURL=ng-services.js.map