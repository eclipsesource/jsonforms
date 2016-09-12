
import uiSchemaRegistry from './ui-schema-registry/ui-schema-registry.service';
import pathResolver from './path-resolver/path-resolver.service';
import labelService from './label/label.service';
import capitalizeFilter from './capitalize/capitalize.filter';
import {ServiceId} from "../services/services";

export default angular.module('jsonforms.services', [
    uiSchemaRegistry,
    pathResolver,
    labelService,
    capitalizeFilter
]).value('ServiceIds', {
    validation: ServiceId.Validation,
    data: ServiceId.DataProvider,
    schema: ServiceId.SchemaProvider,
    uischema: ServiceId.UiSchemaProvider,
    scope: ServiceId.ScopeProvider,
    rule: ServiceId.RuleService,
    path: ServiceId.PathResolver
}).name;
