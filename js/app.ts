/// <reference path="../typings/angularjs/angular.d.ts"/>

angular.module('jsonforms', [
    'ui.bootstrap',
    'ui.validate',
    'ui.grid',
    'ui.grid.autoResize',
    'ui.grid.edit',
    'ui.grid.pagination',
    'jsonforms.services',
    'jsonforms.directives',
    'jsonforms.label',
    'jsonforms.verticalLayout',
    'jsonforms.horizontalLayout',
    'jsonforms.arrayControl',
    'jsonforms.integerControl',
    'jsonforms.booleanControl',
    'jsonforms.stringControl',
    'jsonforms.numberControl',
    'jsonforms.datetimeControl',
    'jsonforms.enumControl',
    'jsonforms.categorization',
    'jsonforms.autoCompleteControl',
]);
