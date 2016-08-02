
import uiSchemaRegistry from './uischemaregistry/uischemaregistry-service';
import pathResolver from './pathresolver/pathresolver-service';
import labelService from './label/label-service';
import capitalizeFilter from './capitalize/capitalize.filter';

export default angular.module('jsonforms.services', [
    uiSchemaRegistry,
    pathResolver,
    labelService,
    capitalizeFilter
]).name;
