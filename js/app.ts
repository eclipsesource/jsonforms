/// <reference path="../typings/angularjs/angular.d.ts"/>

angular.module('jsonForms', [
    'ui.bootstrap',
    'ui.validate',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'jsonForms.services',
    'jsonForms.directives',
    'jsonForms.label',
    'jsonForms.verticalLayout',
    'jsonForms.horizontalLayout',
    'jsonForms.table',
    'jsonForms.integerControl',
    'jsonForms.booleanControl',
    'jsonForms.stringControl',
    'jsonForms.numberControl',
    'jsonForms.datetimeControl',
    'jsonForms.enumControl',
]);
