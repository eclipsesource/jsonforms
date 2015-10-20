///<reference path="../../typings/angularjs/angular.d.ts"/>

var app = angular.module('jsonforms.renderers', [
    'jsonforms.generators',
    'jsonforms.generators.schema',
    'jsonforms.generators.uischema',
    'jsonforms.pathresolver']
);